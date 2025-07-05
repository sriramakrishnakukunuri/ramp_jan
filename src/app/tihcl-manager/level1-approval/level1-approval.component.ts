import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-level1-approval',
  templateUrl: './level1-approval.component.html',
  styleUrls: ['./level1-approval.component.css']
})
export class Level1ApprovalComponent implements OnInit {
loginsessionDetails:any
tableList:any=[]
 constructor(
     private toastrService: ToastrService,
     private _commonService: CommonServiceService,
     private router: Router,
   ) { 
     this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
   }
  ngOnInit(): void {
    this.getLevelOneData(0, 10);
  }
 getLevelOneData(pageNo:any,PageSize:any): any {
    this.tableList = '';
    this._commonService.getDataByUrl(APIS.tihclManager.getLevelOneData+'&pageNo=' + pageNo + '&pageSize=' + PageSize).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data;
        // this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }
  
}
