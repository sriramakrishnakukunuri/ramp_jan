import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../_services/common-service.service';
import { Ticket } from '../../_models/ticket.model';
import { APIS, API_BASE_URL } from '../../constants/constants';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.css']
})
export class HelpSupportComponent implements OnInit {
  ticketForm: FormGroup;
  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  isEditMode = false;
  loading = false;
  selectedFiles: any = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  deleteTicketId: string = '';
  isSubmitted = false;
  dataTable: any;

  // File preview properties
  filePreviewUrl: string = '';
  filePreviewType: 'image' | 'pdf' | 'document' = 'document';
  selectedFileName: string = '';
  currentTicketFiles: any[] = [];
  isDocViewerAvailable = false;

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  types = ['BUG', 'FEATURE', 'ENHANCEMENT', 'SUPPORT'];

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.getAssigneeName()
    this.ticketForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MEDIUM', [Validators.required]],
      status: ['OPEN', [Validators.required]],
      type: ['BUG', [Validators.required]],
      assigneeId: ['', [Validators.required]],
      assigneeName: ['',]
    });
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  getAssineeData: any = []
  getAssigneeName() {
    this.getAssineeData = [];
    this.commonService.getDataByUrl(APIS.tickets.getAllAssineeId).subscribe({
      next: (response) => {
        if (response && response.data?.length > 0) {
          this.getAssineeData = response.data;
        } else {
          this.getAssineeData = [];
        }
      },
      error: (error) => {
        console.error('Error loading assignees:', error);
        this.showMessage('Error loading assignees', 'error');
      }
    });
  }

  // Load all tickets - Modified to work with DataTable
  loadTickets(): void {
    this.loading = true;
    this.commonService.getDataByUrl(APIS.tickets.getAll).subscribe({
      next: (response) => {
        console.log('Load tickets response:', response);
        if (response && Array.isArray(response)) {
          this.tickets = response;
          this.totalElements = response.length;
        } else if (response && response.data) {
          if (Array.isArray(response.data)) {
            this.tickets = response.data;
            this.totalElements = response.totalElements || response.data.length;
          } else {
            this.tickets = [response.data];
            this.totalElements = 1;
          }
        } else {
          this.tickets = [];
          this.totalElements = 0;
        }
        
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.loading = false;
        this.reinitializeDataTable();
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.loading = false;
        this.tickets = [];
        this.totalElements = 0;
        this.reinitializeDataTable();
      }
    });
  }

  // DataTable methods
  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      this.initServerSideDataTable();
    }, 100);
  }
 

  // Server-side DataTable (when API supports pagination)
  initServerSideDataTable() {
    const self = this;
    
    this.dataTable = $('#tickets-table').DataTable({
      destroy: true,
      scrollY: "415px",
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      serverSide: true,
      processing: true,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      autoWidth: false,
      info: true,
      searching: false,
      ajax: (data: any, callback: any, settings: any) => {
        const page = data.start / data.length;
        const size = data.length;
        const sortColumn = data.order[0]?.column;
        const sortDirection = data.order[0]?.dir || 'asc';
        
        // Map column index to field name
        const columnMapping = ['', 'title', 'description', 'type', 'priority', 'status', 'assigneeId', 'createdAt', ''];
        const sortField = columnMapping[sortColumn] || 'createdAt';
        
        let params = `?page=${page}&size=${size}`;
        
        if (sortField && sortField !== '') {
          params += `&sort=${sortField},${sortDirection}`;
        }
        
        if (data.search.value) {
          params += `&search=${encodeURIComponent(data.search.value)}`;
        }
        
        console.log('API Call:', `${APIS.tickets.getAll}${params}`);
        
        this.commonService.getDataByUrl(`${APIS.tickets.getAll}${params}`)
          .subscribe({
            next: (res: any) => {
              console.log('Server response:', res);
              let responseData = [];
              let totalElements = 0;
              
              if (res && Array.isArray(res)) {
                responseData = res;
                totalElements = res.length;
              } else if (res && res.data) {
                responseData = Array.isArray(res.data) ? res.data : [res.data];
                totalElements = res.totalElements || res.totalRecords || responseData.length;
              }
              
              self.tickets = responseData;
              self.totalElements = totalElements;
              
              callback({
                draw: data.draw,
                recordsTotal: totalElements,
                recordsFiltered: totalElements,
                data: responseData
              });
            },
            error: (err) => {
              console.error('Error loading tickets:', err);
              self.toastrService.error(err.message || 'Error loading tickets', "Tickets Error!");
              callback({
                draw: data.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
              });
            }
          });
      },
      columns: [
        { 
          title: 'S.No',
          render: function(data: any, type: any, row: any, meta: any) {
            return meta.settings._iDisplayStart + meta.row + 1;
          },
          className: 'text-center',
          orderable: false,
          width: '5%'
        },
        { 
          data: 'title',
          title: 'Title',
          className: 'text-start',
          width: '15%'
        },
        { 
          data: 'description',
          title: 'Description',
          render: function(data: any, type: any, row: any) {
            return data ? (data.length > 50 ? data.slice(0, 50) + '...' : data) : '-';
            },
            className: 'text-start',
            width: '20%'
            },
            { 
            data: 'type',
            title: 'Type',
            render: function(data: any, _type: any, _row: any) {
              if (!data) return '-';
              // Assign color based on type
              let style = '';
              switch (data) {
              case 'BUG':
                style = 'background-color: #dc3545; color: #fff;'; // red
                break;
              case 'FEATURE':
                style = 'background-color: #28a745; color: #fff;'; // green
                break;
              case 'ENHANCEMENT':
                style = 'background-color: #17a2b8; color: #fff;'; // blue
                break;
              case 'SUPPORT':
                style = 'background-color: #007bff; color: #fff;'; // primary blue
                break;
              default:
                style = 'background-color: #6c757d; color: #fff;'; // secondary
              }
              return `<span class="badge" style="${style}">${data}</span>`;
            },
            className: 'text-center',
            width: '10%'
            },
        // { 
        //   data: 'priority',
        //   title: 'Priority',
        //   render: function(data: any, type: any, row: any) {
        //     if (!data) return '-';
        //     let badgeClass = 'badge-secondary';
        //     switch(data) {
        //       case 'LOW': badgeClass = 'badge-info'; break;
        //       case 'MEDIUM': badgeClass = 'badge-warning'; break;
        //       case 'HIGH': badgeClass = 'badge-danger'; break;
        //       case 'CRITICAL': badgeClass = 'badge-dark'; break;
        //     }
        //     return `<span class="badge ${badgeClass}">${data}</span>`;
        //   },
        //   className: 'text-center',
        //   width: '8%'
        // },
        // { 
        //   data: 'status',
        //   title: 'Status',
        //   render: function(data: any, type: any, row: any) {
        //     if (!data) return '-';
        //     const statusText = data.replace('_', ' ');
        //     let badgeClass = 'badge-secondary';
        //     switch(data) {
        //       case 'OPEN': badgeClass = 'badge-primary'; break;
        //       case 'IN_PROGRESS': badgeClass = 'badge-warning'; break;
        //       case 'RESOLVED': badgeClass = 'badge-success'; break;
        //       case 'CLOSED': badgeClass = 'badge-secondary'; break;
        //     }
        //     return `<span class="badge ${badgeClass}">${statusText}</span>`;
        //   },
        //   className: 'text-center',
        //   width: '10%'
        // },
        //   { 
        //   data: 'type',
        //   title: 'Type',
        //   className: 'text-start',
        //   width: '12%'
        // },
          {
            data: 'priority',
            title: 'Priority',
            render: function(data: any, _type: any, _row: any) {
              if (!data) return '-';
              let style = '';
              switch (data) {
                case 'LOW':
                  style = 'background-color: #17a2b8; color: #fff;'; // blue
                  break;
                case 'MEDIUM':
                  style = 'background-color: #ffc107; color: #212529;'; // yellow
                  break;
                case 'HIGH':
                  style = 'background-color: #fd7e14; color: #fff;'; // orange
                  break;
                case 'CRITICAL':
                  style = 'background-color: #dc3545; color: #fff;'; // red
                  break;
                default:
                  style = 'background-color: #6c757d; color: #fff;'; // secondary
              }
              return `<span class="badge" style="${style}">${data}</span>`;
            },
            className: 'text-center',
            width: '10%'
          },
          {
            data: 'status',
            title: 'Status',
            render: function(data: any, _type: any, _row: any) {
              if (!data) return '-';
              const statusText = data.replace('_', ' ');
              let style = '';
              switch (data) {
                case 'OPEN':
                  style = 'background-color: #007bff; color: #fff;'; // blue
                  break;
                case 'IN_PROGRESS':
                  style = 'background-color: #ffc107; color: #212529;'; // yellow
                  break;
                case 'RESOLVED':
                  style = 'background-color: #28a745; color: #fff;'; // green
                  break;
                case 'CLOSED':
                  style = 'background-color: #6c757d; color: #fff;'; // gray
                  break;
                default:
                  style = 'background-color: #adb5bd; color: #fff;'; // light gray
              }
              return `<span class="badge" style="${style}">${statusText}</span>`;
            },
            className: 'text-center',
            width: '10%'
          },
          {
            data: 'assigneeId',
            title: 'Assignee',
            render: function(data: any, _type: any, row: any) {
              // Show assigneeName if available, else show assigneeId
              return row.assigneeName || data || '-';
            },
            className: 'text-start',
            width: '12%'
          },
          {
            data: 'createdAt',
            title: 'Created Date',
            render: function(data: any, type: any, row: any) {
            if (data) {
              try {
                const date = new Date(data);
                return date.toLocaleDateString('en-GB');
              } catch (e) {
                return data;
              }
            }
            return '-';
          },
          className: 'text-center',
          width: '10%'
        },
        { 
          data: null,
          title: 'Actions',
          render: function(data: any, type: any, row: any, meta: any) {
            let actions = `
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-lime-green btn-sm edit-btn" data-row='${JSON.stringify(row).replace(/'/g, "&#39;")}' title="Edit Ticket">
                  <i class="fas fa-edit"></i>
                </button>
            `;
            
            if (row.attachments && row.attachments.length > 0) {
              actions += `
                <button type="button" class="btn btn-lime-green btn-sm view-files-btn ms-3" data-row='${JSON.stringify(row).replace(/'/g, "&#39;")}' title="View Files">
                  <i class="fas fa-paperclip"></i>
                </button>
              `;
            }
            
            // actions += `
            //     <button type="button" class="btn btn-outline-danger btn-sm delete-btn" data-row='${JSON.stringify(row).replace(/'/g, "&#39;")}' title="Delete Ticket">
            //       <i class="fas fa-trash"></i>
            //     </button>
            //   </div>
            // `;
            return actions;
          },
          className: 'text-center',
          orderable: false,
          width: '10%'
        }
      ],
      initComplete: function() {
        console.log('Server-side DataTable initialization complete');
        self.attachEventHandlers();
      },
      drawCallback: function() {
        self.attachEventHandlers();
      }
    });
  }

  // Attach event handlers for action buttons
  attachEventHandlers() {
    const self = this;
    
    // Remove existing event handlers to prevent duplicates
    $('#tickets-table').off('click', '.edit-btn');
    $('#tickets-table').off('click', '.view-files-btn');
    $('#tickets-table').off('click', '.delete-btn');
    
    // Add event listeners for action buttons
    $('#tickets-table').on('click', '.edit-btn', function(this: HTMLElement) {
      let rowData;
      if ($(this).data('index') !== undefined) {
        // Client-side mode
        const index = $(this).data('index');
        rowData = self.tickets[index];
      } else {
        // Server-side mode
        rowData = JSON.parse($(this).attr('data-row') || '{}');
      }
      console.log('Edit button clicked for:', rowData);
      self.openTicketModal('edit', rowData);
    });

    $('#tickets-table').on('click', '.view-files-btn', function(this: HTMLElement) {
      let rowData;
      if ($(this).data('index') !== undefined) {
        const index = $(this).data('index');
        rowData = self.tickets[index];
      } else {
        rowData = JSON.parse($(this).attr('data-row') || '{}');
      }
      console.log('View files button clicked for:', rowData);
      self.viewTicketFiles(rowData);
    });

    $('#tickets-table').on('click', '.delete-btn', function(this: HTMLElement) {
      let rowData;
      if ($(this).data('index') !== undefined) {
        const index = $(this).data('index');
        rowData = self.tickets[index];
      } else {
        rowData = JSON.parse($(this).attr('data-row') || '{}');
      }
      console.log('Delete button clicked for:', rowData);
      self.deleteTicket(rowData.id);
    });
  }

  // File viewing methods
 // Update the viewTicketFiles method
viewTicketFiles(ticket: any): void {
  this.currentTicketFiles = ticket.attachments || [];
  
  // Clear single file preview data when showing multiple files
  if (this.currentTicketFiles.length > 1) {
    this.filePreviewUrl = '';
    this.filePreviewType = 'document';
    this.selectedFileName = '';
  }
  
  const modalElement = document.getElementById('filePreviewModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// Update the previewFile method to work with the new modal
previewFile(file: any, index: number): void {
  this.selectedFileName = file.fileName || file.name;
  this.filePreviewUrl = this.getFileDownloadUrl(file);
  this.filePreviewType = this.getFileType(this.selectedFileName);
  this.currentTicketFiles = [file]; // Show only single file
  
  const modalElement = document.getElementById('filePreviewModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
  getFileDownloadUrl(file: any): string {
    if (file.fileUrl) {
      return file.fileUrl;
    } else if (file.fileName) {
      return `${API_BASE_URL}/tickets/files/download/${file.fileName}`;
    } else {
      return `${API_BASE_URL}/tickets/files/download/${file.name}`;
    }
  }

  getFileType(fileName: string): 'image' | 'pdf' | 'document' {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
      return 'image';
    } else if (ext === 'pdf') {
      return 'pdf';
    } else {
      return 'document';
    }
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'fas fa-file-powerpoint text-warning';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return 'fas fa-file-image text-info';
      case 'txt':
        return 'fas fa-file-alt text-secondary';
      case 'zip':
      case 'rar':
      case '7z':
        return 'fas fa-file-archive text-dark';
      default:
        return 'fas fa-file text-muted';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Create or update ticket
  onSubmit(): void {
    this.isSubmitted = true;
    console.log('Form Values:', this.ticketForm.value,this.selectedFiles);
    if (this.ticketForm.invalid) {
      this.markFormGroupTouched(this.ticketForm);
      return;
    }

    this.loading = true;
    const ticketData: any = this.ticketForm.value;

    if (this.isEditMode && this.selectedTicket?.id) {
      // Update existing ticket
      if (this.selectedFiles.length > 0) {
        let formData = { ...ticketData, attachments: this.selectedFiles }
        this.commonService.updatedata(APIS.tickets.update + this.selectedTicket.id, formData).subscribe({
          next: (response) => {
            this.toastrService.success('Ticket updated successfully!');
            this.handleSuccess();
          },
          error: (error) => {
            console.error('Error updating ticket:', error);
            this.toastrService.error('Error updating ticket');
            this.loading = false;
          }
        });
      } else {
        this.commonService.updatedata(APIS.tickets.update + this.selectedTicket.id, {...ticketData,attachments:this.selectedFiles}).subscribe({
          next: (response) => {
            this.toastrService.success('Ticket updated successfully!');
            this.handleSuccess();
          },
          error: (error) => {
            console.error('Error updating ticket:', error);
            this.toastrService.error('Error updating ticket');
            this.loading = false;
          }
        });
      }
    } else {
      // Create new ticket
      if (this.selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append('ticket', JSON.stringify(ticketData));
        this.selectedFiles.forEach((file: any) => {
          formData.append('files', file);
        });
        
        this.commonService.add(APIS.tickets.save, formData).subscribe({
          next: (response: any) => {
            this.toastrService.success('Ticket created successfully!');
            this.handleSuccess();
          },
          error: (error: any) => {
            console.error('Error creating ticket:', error);
            this.toastrService.error('Error creating ticket');
            this.loading = false;
          }
        });
      } else {
        const formData = new FormData();
        formData.append('ticket', JSON.stringify(ticketData));
        this.commonService.add(APIS.tickets.save, formData).subscribe({
          next: (response: any) => {
            this.toastrService.success('Ticket created successfully!');
            this.handleSuccess();
          },
          error: (error: any) => {
            console.error('Error creating ticket:', error);
            this.toastrService.error('Error creating ticket');
            this.loading = false;
          }
        });
      }
    }
  }

  // Handle success response
  handleSuccess(): void {
    this.resetForm();
    this.loading = false;
    
    // Refresh the table
    setTimeout(() => { 
      this.loadTickets();
    }, 500);
    
    // Close modal
    const modal = document.getElementById('addTicketModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance?.hide();
    }
  }

  // Open ticket modal
  openTicketModal(mode: string, ticket?: any): void {
    this.isEditMode = mode === 'edit';
    this.isSubmitted = false;
    
    if (mode === 'edit' && ticket) {
      this.selectedTicket = ticket;
      this.selectedFiles = ticket.attachments || [];
      this.ticketForm.patchValue({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        type: ticket.type,
        assigneeId: ticket.assigneeId,
        assigneeName: ticket.assigneeName
      });
    } else {
      this.selectedFiles = [];
      this.resetForm();
    }

    setTimeout(() => {
      const fileInput = document.getElementById('files') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }, 100);

    const modalElement = document.getElementById('addTicketModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Delete ticket (show confirmation modal)
  deleteTicket(ticketId: string): void {
    this.deleteTicketId = ticketId;
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
      const modal = new bootstrap.Modal(deleteModal);
      modal.show();
    }
  }

  // Confirm delete ticket
  confirmDeleteTicket(ticketId: string): void {
    this.loading = true;
    this.commonService.deleteId(APIS.tickets.delete, ticketId).subscribe({
      next: (response) => {
        this.toastrService.success('Ticket deleted successfully!');
        this.loadTickets();
        this.loading = false;
        
        const deleteModal = document.getElementById('deleteConfirmModal');
        if (deleteModal) {
          const modal = bootstrap.Modal.getInstance(deleteModal);
          modal?.hide();
        }
      },
      error: (error) => {
        console.error('Error deleting ticket:', error);
        this.toastrService.error('Error deleting ticket');
        this.loading = false;
      }
    });
  }

  // Handle file selection
  onFileSelect(event: any): void {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
    console.log('Selected files:', this.selectedFiles);
  }

  // Remove selected file
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // Reset form
  resetForm(): void {
    this.ticketForm.reset({
      priority: 'MEDIUM',
      status: 'OPEN',
      type: 'BUG'
    });
    this.selectedTicket = null;
    const fileInput = document.getElementById('files') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.isEditMode = false;
    this.selectedFiles = [];
  }

  // Show message
  showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  // Mark form group as touched for validation
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Reset ticket form for modal
  resetTicketForm(): void {
    this.resetForm();
  }

  // Get form control for validation
  get f() { return this.ticketForm.controls; }
}