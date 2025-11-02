import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-applications',
  templateUrl: './view-applications.component.html',
  styleUrls: ['./view-applications.component.css']
})
export class ViewApplicationsComponent implements OnInit {
loginsessionDetails:any
  constructor(private _commonService: CommonServiceService,  
    private toastrService: ToastrService,
  private router: Router
  ) {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
    console.log(this.loginsessionDetails)
   }
  //  APPLICATIONS_RECEIVED, APPLICATIONS_UNDER_PROCESS, APPLICATIONS_WITH_DIC, APPLICATIONS_SANCTIONED, APPLICATIONS_NOT_CONSIDERED
activeTab:any='APPLICATIONS_RECEIVED';
districtName:any='district'
  ngOnInit(): void {
    if(this.loginsessionDetails.userRole=='DIC' || this.loginsessionDetails.userRole=='EXECUTIVE_MANAGER'){
      this.districtName=this.loginsessionDetails.district
    }
    else{
      this.districtName='district'
       this.getAllDistricts()
    }
     this.onTabChange('APPLICATIONS_RECEIVED')
     this.getData()
  }
 currentPage = 1;
  pageSize = 10;
  totalItems = 100;
  pagedData: any[] = [];
   onTabChange(activeTab:any){
    this.activeTab = activeTab;
    if(activeTab=='APPLICATIONS_RECEIVED' ) { 
      console.log(activeTab); 
      this.pageSize=10
      this.getDataReceived(1,10)
    
    }
    if(activeTab=='APPLICATIONS_UNDER_PROCESS') {
      console.log(activeTab)
      this.pageSize=10
      this.getDataReceived(1,10)
    
    }
    else if(activeTab=='APPLICATIONS_WITH_DIC') {
      console.log(activeTab)
      this.getDataReceived(1,10)
    }
    else if(activeTab=='APPLICATIONS_SANCTIONED') { 
   this.getDataReceived(1,10)
    }
    else if(activeTab=='APPLICATIONS_NOT_CONSIDERED') { 
   this.getDataReceived(1,10)
    }
  }
    allDistricts:any
    getAllDistricts(){
      this.allDistricts = []
      this._commonService.getDataByUrl(APIS.tihclMasterList.getDistricts).subscribe({
        next: (data: any) => {
          this.allDistricts = data.data;
        },
        error: (err: any) => {
          this.allDistricts = [];
        }
      })
    }
  dropdownDistrictList(event:any){
     this.districtName = event.target.value
     console.log(this.districtName)
     this.onTabChange(this.activeTab);
     this.getData()
  }

  // data to pass to sanctioned amount
  onRowClick(item: any) {
    console.log(item,"item")
  this._commonService.setSelectedRegistrationId(item.registrationId);
  this.router.navigate(['/sanctioned-amount']);
}

   PrigramSummaryData:any={}
  getData() {
    this.PrigramSummaryData ={}
    this._commonService.getById(APIS.tihclCOI.getNumericData, (this.districtName?this.districtName:'district')).subscribe({
      next: (res: any) => {          
        // this.PrigramSummaryData = res?.data   
      // console.log( this.PrigramSummaryData)
      this.PrigramSummaryData = res
      },
      error: (err) => {
        this.toastrService.error('Data Not Available', "Summary Data Error!");
        new Error(err);
      },
    });
    // console.log(this.ParticipantAttentance)
  }
   onPageChange(event: {page: number, pageSize: number}): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
     this.getDataReceived(this.currentPage,  this.pageSize);
  }
  tableListReceived:any=[]
 getDataReceived(pageNo:any,PageSize:any): any {

    this.tableListReceived = [];
    if(this.districtName=='district'){
      this._commonService.getDataByUrl(APIS.tihclCOI.getApplicaionData+'&status='+this.activeTab+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize).subscribe({
      next: (dataList: any) => {
        this.tableListReceived = dataList.data;
        this.totalItems=dataList?.totalElements
        // this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.totalItems=0
        this.toastrService.error(error.error.message);
      }
    });
    }
    else{
      this._commonService.getDataByUrl(APIS.tihclCOI.getApplicaionData+'&status='+this.activeTab+'&district='+this.districtName+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize).subscribe({
      next: (dataList: any) => {
        this.tableListReceived = dataList.data;
        this.totalItems=dataList?.totalElements
        // this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.totalItems=0
        this.toastrService.error(error.error.message);
      }
    });
    }
    
  }
}
