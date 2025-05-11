import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { API_BASE_URL, APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;

@Component({
  selector: 'app-view-program-agencies',
  templateUrl: './view-program-agencies.component.html',
  styleUrls: ['./view-program-agencies.component.css']
})
export class ViewProgramAgenciesComponent implements OnInit ,AfterViewInit{
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
      this.getAgenciesList() 
    }
  
    ngAfterViewInit() {
      this.initializeDataTable(-1);
    }
    GetProgramsByAgency(event:any){
      this.agencyByAdmin=event;
      this.selectedAgencyId = event;
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
  
    sessionDetails(dataList: any): any {
      console.log(dataList)
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
      this.dataTable = new DataTable('#view-program', {
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
              console.log(data,meta,type, row)
                return meta.settings?._iDisplayStart+meta.row  + 1;
            },
            className: 'dt-center'
        },
      { 
        data: 'agencyName',
        title: 'Agency Name'
    },
        { 
            data: 'activityName',
            title: 'Type Of Activity'
        },
        { 
            data: 'subActivityName',
            title: 'Sub Activity'
        },
        { 
            data: 'programType',
            title: 'Type Of Program'
        },
        { 
            data: 'programTitle',
            title: 'Title Of Program'
        },
        { 
            data: 'startDate',
            title: 'Start Date'
        },
        { 
          data: 'endDate',
          title: 'End Date'
      },
        { 
            data: 'startTime',
            title: 'In Time',
            className: 'text-center'
        },
        { 
            data: 'endTime',
            title: 'Out Time',
            className: 'text-center'
        },
        { 
            data: 'spocName',
            title: 'SPOC Name'
        },
        { 
            data: 'spocContactNo',
            title: 'SPOC Contact No.'
        },
        { 
            data: 'programLocationName',
            title: 'Program Location'
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
      $('#view-program').on('click', '.edit-btn', (event:any) => {
        const rowData = self.dataTable.row($(event.currentTarget).parents('tr')).data();
        self.sessionDetails(rowData); // Call your method with proper data
      });
    }
      });
    }
  
    reinitializeDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
      setTimeout(() => {
        this.initializeDataTable( this.agencyByAdmin);
       
      }, 0);
    }
    agencyByAdmin:any=-1
    selectedAgencyId:any=-1
    getAgenciesList() {
      this.agencyList = [];
      this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
        this.agencyList = res.data;
        this.selectedAgencyId =-1
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
      
  }
