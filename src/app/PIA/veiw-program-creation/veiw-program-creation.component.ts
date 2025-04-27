import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
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
    console.log(this.loginsessionDetails);
    if(this.loginsessionDetails.userRole == 'ADMIN') {
      this.getAgenciesList()
    }
    else{
      this.getProgramDetails();
    }
    
  }

  ngAfterViewInit() {
    this.initializeDataTable(this.loginsessionDetails.agencyId);
  }
  GetProgramsByAgency(event:any){
    this.agencyByAdmin=event;
    this._commonService.getDataByUrl(APIS.programCreation.getProgramsListByAgency+event).subscribe({
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
    this._commonService.getDataByUrl(APIS.programCreation.getProgramsListByAgency+this.loginsessionDetails.agencyId).subscribe({
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
    this.sessionDetailsList = dataList.programSessionList;
  }

  editProgram(dataList: any): any {
    this.router.navigateByUrl('/program-creation-edit/' + dataList.programId);
  }

  editSession(dataList: any): any {
    this.router.navigateByUrl('/program-sessions-edit/' + dataList.programId);
  }

  initializeDataTable(agency:any) { 
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
        fetch(APIS.programCreation.getProgramsListByAgency+agency+`?page=${page}&size=${size}`)
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
      { 
          title: 'Actions',
          data: 'programLocationName',
          render: function(data:any, type:any, row:any) {
              // if (this.loginsessionDetails?.userRole == 'AGENCY_MANAGER' || this.loginsessionDetails?.userRole == 'AGENCY_EXECUTOR') {
                  return `<button type="button" class="btn btn-default btn-sm text-lime-green" title="Sessions" data-bs-toggle="modal" data-bs-target="#viewModal" onclick="sessionDetails(${row.programId})" title="View">
                              <span class="bi bi-eye"></span>
                          </button>`;
              // }
              // return '';
          },
          orderable: false,
          className: 'text-center'
      }
  ],
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
  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      this.GetProgramsByAgency(res.data[0].agencyId);
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }
}
