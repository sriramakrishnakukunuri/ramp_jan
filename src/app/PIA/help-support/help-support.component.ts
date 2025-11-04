import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../_services/common-service.service';
import { Ticket } from '../../_models/ticket.model';
import { APIS } from '../../constants/constants';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

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

  priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  types = ['BUG', 'FEATURE', 'ENHANCEMENT', 'SUPPORT'];

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
     private toastrService: ToastrService,
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
getAssineeData:any=[]
  getAssigneeName() {
    this.getAssineeData=[];
     this.commonService.getDataByUrl(APIS.tickets.getAllAssineeId).subscribe({
      next: (response) => {
        if (response && response.data?.length > 0) {
           this.getAssineeData = response.data;
        }  else {
          this.getAssineeData = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
        this.showMessage('Error loading tickets', 'error');
        this.loading = false;
      }
    });

  }
  // Load all tickets
  loadTickets(): void {
    this.loading = true;
    this.commonService.getDataByUrl(APIS.tickets.getAll).subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          this.tickets = response;
        } else if (response && response.data) {
          this.tickets = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          this.tickets = [];
        }
        this.loading = false;
      },
      error: (error) => {
       
        this.loading = false;
      }
    });
  }

  // Create or update ticket
  onSubmit(): void {
    this.isSubmitted = true;
    console.log('Form Values:', this.ticketForm.value);
    if (this.ticketForm.invalid) {
      this.markFormGroupTouched(this.ticketForm);
      return;
    }

    this.loading = true;
    const ticketData: any = this.ticketForm.value;

    if (this.isEditMode && this.selectedTicket?.id) {
      // Update existing ticket
      if (this.selectedFiles.length > 0) {
        // const formData = new FormData();
        // formData.append('ticket', JSON.stringify(ticketData));
        // this.selectedFiles.forEach((file) => {
        //   formData.append('files', file);
        // });
       let formData={...ticketData,attachments:this.selectedFiles}
        this.commonService.updatedata(APIS.tickets.update + this.selectedTicket.id, formData).subscribe({
          next: (response) => {
           
            this.toastrService.success('Ticket updated successfully!');
            // this.handleSuccess('Ticket updated successfully!');
          },
          error: (error) => {
            console.error('Error updating ticket:', error);
            this.toastrService.error('Error updating ticket');
            // this.showMessage('Error updating ticket', 'error');
            this.loading = false;
          }
        });
      } else {
        this.commonService.updatedata(APIS.tickets.update + this.selectedTicket.id, ticketData).subscribe({
          next: (response) => {
             
             this.toastrService.success('Ticket updated successfully!');
          },
          error: (error) => {
            
            console.error('Error updating ticket:', error);
            // this.showMessage('Error updating ticket', 'error');
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
        this.selectedFiles.forEach((file:any) => {
          formData.append('files', file);
        });
        
        this.commonService.add(APIS.tickets.save, formData).subscribe({
          next: (response:any) => {
             
            this.toastrService.success('Ticket created successfully!');
          },
          error: (error:any) => {
            
            console.error('Error creating ticket:', error);
            this.toastrService.error('Error creating ticket');
            // this.showMessage('Error creating ticket', 'error');
            this.loading = false;
          }
        });
      } else {
         const formData = new FormData();
        formData.append('ticket', JSON.stringify(ticketData));
        this.commonService.add(APIS.tickets.save, formData).subscribe({
          next: (response:any) => {
           
            this.toastrService.success('Ticket created successfully!');
            // this.handleSuccess('Ticket created successfully!');
          },
          error: (error:any) => {
             
            console.error('Error creating ticket:', error);
            this.toastrService.error('Error creating ticket');
            // this.showMessage('Error creating ticket', 'error');
            this.loading = false;
          }
        });
      }
    }
    this.handleSuccess()
  }

  // Handle success response
  handleSuccess(): void {
    // this.showMessage(message, 'success');
    this.resetForm();
    setTimeout(() => {this.loadTickets();},500)
    
    this.loading = false;
    
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
      this.selectedFiles=ticket.attachments || [];
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
    // Open modal using Bootstrap
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

        this.showMessage('Ticket deleted successfully!', 'success');
        this.loadTickets();
        this.loading = false;
        // Close modal
        const deleteModal = document.getElementById('deleteConfirmModal');
        if (deleteModal) {
          const modal = bootstrap.Modal.getInstance(deleteModal);
          modal?.hide();
        }
      },
      error: (error) => {
        console.error('Error deleting ticket:', error);
        this.showMessage('Error deleting ticket', 'error');
        this.loading = false;
      }
    });
  }

  // Handle file selection
  onFileSelect(event: any): void {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
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

  // Cancel edit
  cancelEdit(): void {
    this.resetForm();
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
