import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-pending-application-executive',
  templateUrl: './pending-application-executive.component.html',
  styleUrls: ['./pending-application-executive.component.css']
})
export class PendingApplicationExecutiveComponent implements OnInit {
 currentPage = 1;
  pageSize = 10;
  totalItems = 100;
  pagedData: any[] = [];
loginsessionDetails:any
tableList:any=[]
searchType:any=''
searchText:any=''
 constructor(
     private toastrService: ToastrService,
     private _commonService: CommonServiceService,
     private router: Router,
   ) { 
     this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
   }
   activeTab = 'pendingApplications'; // Default active tab
  ngOnInit(): void {
    this.currentPage=1
    this.pageSize=10
    
    this.getNewApplications(1, 10);
  }
  onPageChange(event: {page: number, pageSize: number}): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
     this.getNewApplications(this.currentPage,  this.pageSize);
  }
 getNewApplications(pageNo:any,PageSize:any): any {
    this.tableList = '';
    if(this.searchType && this.searchText){
      this.activeTab='pendingNew'
      this._commonService.getDataByUrl(APIS.tihclExecutive.getPendingApplications+'?userId='+this.loginsessionDetails?.userId+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize+'&'+this.searchType+'='+this.searchText).subscribe({
        next: (dataList: any) => {
          this.tableList = dataList.data;
          this.totalItems=dataList?.totalElements
        },
        error: (error: any) => {
          this.toastrService.error(error.error.message);
        }
      });
    }
    else{
      this.activeTab='pendingApplications'
       this._commonService.getDataByUrl(APIS.tihclExecutive.getPendingApplications+'?userId='+this.loginsessionDetails?.userId+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data;
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
  filterTable(){
      this.getNewApplications(1, 10);
  }
   selectApplication(item: any) { // Set the current step to 1
    sessionStorage.setItem('ApplicationData', JSON.stringify(item));
    this.router.navigate(['/executive-workflow']);
  }
}

