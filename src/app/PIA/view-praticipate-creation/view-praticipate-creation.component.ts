import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;

@Component({
  selector: 'app-view-praticipate-creation',
  templateUrl: './view-praticipate-creation.component.html',
  styleUrls: ['./view-praticipate-creation.component.css']
})
export class ViewParticipateCreationComponent implements OnInit {

  localStorageData:any
  sessionDetailsList:any
  agencyList: any = [];
  constructor(
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {    
    this.getProgramDetails()
    this.getAgenciesList()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      
    }, 500);
  }
  tableList:any
  getProgramDetails(): any {
    //const programDetails = localStorage.getItem('programDetails');
    //console.log(programDetails)
    //this.localStorageData = programDetails ? JSON.parse(programDetails) : [];
    this.tableList = ''
    this._commonService.getDataByUrl(APIS.participantdata.getParticipantList).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data
        this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    })
  }

  initializeDataTable() {
    this.dataTable = new DataTable('#view-table-participate', {              
      // scrollX: true,
      // scrollCollapse: true,    
      // responsive: true,    
      // paging: true,
      // searching: true,
      // ordering: true,
      scrollY: "415px",     
      scrollX:        true,
      scrollCollapse: true,
      autoWidth:         true,  
      paging:         false,  
      info: false,   
      searching: false,  
      destroy: true, // Ensure reinitialization doesn't cause issues
      });
  }

  dataTable: any;
  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      this.initializeDataTable();
    }, 0);
  }

  sessionDetails(dataList: any): any {    
    this.sessionDetailsList = dataList.programSessionList
  }

  deleteRow(item:any,i:number){
    //  this.submitedData.pop(i)
     this.tableList.splice(i, 1)
      console.log( this.tableList)
      // this.submitedData.push(this.ParticipantDataForm.value)
      // sessionStorage.setItem('ParticipantData', this.submitedData)
       //sessionStorage.setItem('ParticipantData', JSON.stringify(this.submitedData)); 
       //this.getData()
  }
  editRow(item:any,i:any){
    //this.tableList.patchValue({...item})
  }
  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }
}
