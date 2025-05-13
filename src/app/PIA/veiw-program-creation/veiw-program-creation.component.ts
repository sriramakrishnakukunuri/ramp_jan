import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { API_BASE_URL, APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { event } from 'jquery';
declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-veiw-program-creation',
  templateUrl: './veiw-program-creation.component.html',
  styleUrls: ['./veiw-program-creation.component.css']
})
export class VeiwProgramCreationComponent implements OnInit, AfterViewInit {
  localStorageData: any;
  sessionDetailsList: any;
  tableList: any;
  dataTable: any;
  agencyList: any = [];
  loginsessionDetails: any;
  agencyId: any;
  constructor(
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,
  ) { 
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
    this.agencyId = this.loginsessionDetails.agencyId;
  }

  ngOnInit(): void {
    // console.log(this.loginsessionDetails);
    if(this.loginsessionDetails.userRole == 'ADMIN') {
      this.getAgenciesList()
    }
    else{
      this.getProgramDetails();
      this.getData()
      this.selectedAgencyId=this.agencyId
    }
    
  }

  ngAfterViewInit() {
    this.initializeDataTable(this.loginsessionDetails.agencyId);
  }
  GetProgramsByAgency(event:any){
    this.agencyByAdmin=event;
    this.selectedAgencyId = event;
    this.getData()
    this._commonService.getDataByUrl(APIS.programCreation.getProgramsListByAgencyDetails+event).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data;
        this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }

  getProgramDetails(): any {
    this.tableList = '';

    this._commonService.getDataByUrl(APIS.programCreation.getProgramsListByAgencyDetails+this.loginsessionDetails.agencyId).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data;
        this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }

  sessionDetails(dataList: any): any {
    // console.log(dataList)
    this.sessionDetailsList = dataList.programSessionList;
  }

  editProgram(dataList: any): any {
    this.router.navigateByUrl('/program-creation-edit/' + dataList.programId);
  }

  editSession(dataList: any): any {
    this.router.navigateByUrl('/program-sessions-edit/' + dataList.programId);
  }

  initializeDataTable(agency:any) { 
    const self = this;
    this.dataTable = new DataTable('#view-table-program', {
      scrollY: "505px",
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      serverSide: true, // Enable server-side processing
      pageLength: 10, // Default page size
      lengthMenu: [5, 10, 25, 50], // Available page sizes
      autoWidth: true,
      info: false,
      searching: false,
      destroy: true,
      ajax: function (data:any, callback, settings) {
        // Extract pagination parameters
        let page = data.start / data.length;
        let size = data.length;
       
        // Fetch data from API
        fetch(APIS.programCreation.getProgramsListByAgencyDetails+agency+`?page=${page}&size=${size}`)
            .then(res => res.json())
            .then(json => {
                callback({
                    draw: data.draw,
                    recordsTotal: json.totalElements,
                    recordsFiltered: json.totalElements,
                    data: json.data
                });
            });
    },
    columns: [
      { 
          title: 'S.No',
          render: function(data, type, row, meta:any) {
            // console.log(data,meta,type, row)
              return meta.settings?._iDisplayStart+meta.row  + 1;
          },
          className: 'dt-center'
      },
   
      { 
        title: 'Actions',
        data: null,
        render: function(data:any, type:any, row:any,meta: any) {
          // console.log(data,row,meta)
            // if (this.loginsessionDetails?.userRole == 'AGENCY_MANAGER' || this.loginsessionDetails?.userRole == 'AGENCY_EXECUTOR') {
                return `  <button type="button" class="btn btn-default btn-sm text-lime-green edit-btn" 
                title="Sessions" data-bs-toggle="modal" data-bs-target="#viewModal" 
                data-id="${row.id}" title="View">
                <span class="bi bi-eye"></span>
              </button>
                <button type="button" class="btn btn-default btn-sm text-danger editable-btn" data-id="${row.id}" title="Delete"><span class="bi bi-pencil"></span></button>
              <button type="button" class="btn btn-default btn-sm text-danger delete-btn" data-id="${row.id}" title="Delete"><span class="bi bi-trash"></span></button>
              `;
            // }
            // return '';
        },
        orderable: false,
        className: 'text-center'
    },
        { 
          data: 'startDate',
          title: 'Start Date',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
      { 
        data: 'endDate',
        title: 'End Date',
        render: function(data, type, row) {
          return data ? data : '';
        }
    },
      { 
          data: 'startTime',
          title: 'In Time',
          className: 'text-center',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
      { 
          data: 'endTime',
          title: 'Out Time',
          className: 'text-center',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
      { 
        data: 'programLocationName',
        title: 'Program Location',
        render: function(data, type, row) {
          return data ? data : '';
        }
    },
    { 
      data: 'programType',
      title: 'Type Of Program',
      render: function(data, type, row) {
        return data ? data : '';
      }
    },
    { 
      data: 'agencyName',
      title: 'Agency Name',
      render: function(data, type, row) {
        return data ? data : '';
      }
    },
    { 
      data: 'programTitle',
      title: 'Title Of Program',
      render: function(data, type, row) {
        return data ? data : '';
      }
    },
    { 
      data: 'status',
      title: 'Status',
      render: function(data, type, row) {
        return data ? data : '';
      }
    },
   
     { 
          data: 'activityName',
          title: 'Type Of Activity',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
      { 
          data: 'subActivityName',
          title: 'Sub Activity',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
      
     
      { 
          data: 'spocName',
          title: 'SPOC Name',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
      { 
          data: 'spocContactNo',
          title: 'SPOC Contact No.',
          render: function(data, type, row) {
            return data ? data : '';
          }
      },
     
      // { 
      //   data: null,
      //   title: 'Edit / Delete',
      //   render: (data: any, type: any, row: any, meta: any) => {
      //     // Use meta.row for the current displayed row index
      //     return `
      //       <button type="button" class="btn btn-default text-lime-green btn-sm edit-btn" data-index="${meta.row}">
      //         <span class="bi bi-eye"></span>
      //       </button>
      //       // <button type="button" class="btn btn-default text-danger btn-sm delete-btn" data-index="${meta.row}">
      //       //   <span class="bi bi-trash"></span>
      //       // </button>
      //     `;
      //   },
      //   className: 'text-center',
      //   orderable: false
      // }
     
  ],
  initComplete: function() {
    // Use proper event handling with arrow function
    $('#view-table-program').on('click', '.edit-btn', (event:any) => {
      const rowData = self.dataTable.row($(event.currentTarget).parents('tr')).data();
      self.sessionDetails(rowData); // Call your method with proper data
    });
    $('#view-table-program').on('click', '.editable-btn', (event:any) => {
      const rowData = self.dataTable.row($(event.currentTarget).parents('tr')).data();
      self.editProgram(rowData); // Call your method with proper data
    });
    $('#view-table-program').off('click', '.delete-btn').on('click', '.delete-btn', (event: any) => {
      const rowData = self.dataTable.row($(event.currentTarget).parents('tr')).data();
      self.deleteExpenditure(rowData);
    });
    // $('#view-table-program').on('click', '.delete-btn', (event:any) => {
    //   const rowData = self.dataTable.row($(event.currentTarget).parents('tr')).data();
    //   self.deleteExpenditure(rowData);
    // });
  }
    });
  }

  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      if( this.loginsessionDetails?.userRole == 'ADMIN'){
        this.initializeDataTable( this.agencyByAdmin);
      }
      else{
        this.initializeDataTable(this.loginsessionDetails.agencyId);
      }
     
    }, 0);
  }
  agencyByAdmin:any
  selectedAgencyId:any=-1
  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      this.selectedAgencyId =-1
      this.getData()
      this.GetProgramsByAgency(-1);
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }

  previewData:any;    
  async showPreviewPopup(dataList: any) {
    this.previewData = ''
    let url = `${API_BASE_URL}/program/file/download/${dataList.programSessionFileId}`
    this.previewData = url
  }

  getFileIcon(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'doc':
      case 'docx': return 'fas fa-file-word';
      case 'xls':
      case 'xlsx': return 'fas fa-file-excel';
      case 'ppt':
      case 'pptx': return 'fas fa-file-powerpoint';
      default: return 'fas fa-file';
    }
  }
  
  getIconColor(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '#e74c3c';
      case 'doc':
      case 'docx': return '#3498db';
      case 'xls':
      case 'xlsx': return '#2ecc71';
      case 'ppt':
      case 'pptx': return '#e67e22';
      default: return '#7f8c8d';
    }
  }
  
  getFileName(filePath: string): string {
    return filePath.split('/').pop() || 'Download';
  }
  
  collapseStates: { [key: number]: boolean } = {};

  toggleIcon(index: number): void {
    this.collapseStates[index] = !this.collapseStates[index];
  }
  PrigramSummaryData:any={}
  getData() {
    this.PrigramSummaryData ={}
    this._commonService.getById(APIS.programCreation.programSummary, this.selectedAgencyId).subscribe({
      next: (res: any) => {          
        // this.PrigramSummaryData = res?.data   
      // console.log( this.PrigramSummaryData)
      this.PrigramSummaryData = res?.data
      },
      error: (err) => {
        this.toastrService.error('Data Not Available', "Summary Data Error!");
        new Error(err);
      },
    });
    // console.log(this.ParticipantAttentance)
  }


     // delete Expenditure
     deleteProgramId:any ={}
     deleteExpenditure(item: any) {
       if(item?.status=='Program Scheduled' || item.status=='Sessions Created'){
        this.deleteProgramId = item?.programId
         document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        const myModal = new bootstrap.Modal(document.getElementById('exampleModalDeleteProgram'));
         myModal.show();
       }
      else{
        console.log(item,'warming')
        this.toastrService.warning('Selected Program has Participants Added hence can not be deleted!', "Delete not Allowed!");
        return;
      }
     
   }
     ConfirmdeleteExpenditure(item:any){
       this._commonService
       .deleteId(APIS.programCreation.deleteProgram,item).subscribe({
         next: (data: any) => {
           if(data?.status==400){
             this.toastrService.error(data?.message, "Program Data Error!");
             this.closeModalDelete();
             this.deleteProgramId =''
           }
           else{
            this.getProgramDetails()
            this.reinitializeDataTable();
             this.closeModalDelete();
             this.deleteProgramId =''
           this.toastrService.success( 'Program Deleted Successfully', "Program Data Success!");
           }
           
         },
         error: (err) => {
           this.closeModalDelete();
           this.deleteProgramId ={}
           this.toastrService.error(err.message, "Program Data Error!");
           new Error(err);
         },
       });
 
     }
     closeModalDelete(): void {

      const editSessionModal = document.getElementById('exampleModalDeleteProgram');
    if (editSessionModal) {
      const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
      modalInstance.hide();
    }

      // const myModal = bootstrap.Modal.getInstance(document.getElementById('exampleModalDelete'));
      // myModal.hide();
     } 
}
