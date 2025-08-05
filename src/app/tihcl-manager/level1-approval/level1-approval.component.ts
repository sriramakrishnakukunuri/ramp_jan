import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-level1-approval',
  templateUrl: './level1-approval.component.html',
  styleUrls: ['./level1-approval.component.css']
})
export class Level1ApprovalComponent implements OnInit {
loginsessionDetails:any
tableList:any=[]
RejectForm!: FormGroup;
approveForm!: FormGroup;
  currentPage = 1;
  pageSize = 10;
  totalItems = 100;
  pagedData: any[] = [];
  @ViewChild('successModal') successModal!: ElementRef;
   @ViewChild('ModalReject') ModalReject!: ElementRef;
    @ViewChild('ModalReview') ModalReview!: ElementRef;
 constructor(
  private fb: FormBuilder,
     private toastrService: ToastrService,
     private _commonService: CommonServiceService,
     private router: Router,
   ) { 
     this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
   }
  ngOnInit(): void {
    this.rejectDetail()
    this.arooveDetail()
    this.getLevelOneData(1, 10);
  }
   rejectDetail(): void {
      this.RejectForm=this.fb.group({
        remarks: ['', Validators.required],
      });
    }
    arooveDetail(): void {
      this.approveForm=this.fb.group({
        processType: ['', Validators.required],
        product:['',Validators.required]
      });
    }
   onPageChange(event: {page: number, pageSize: number}): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
     this.getLevelOneData(this.currentPage,  this.pageSize);
  }
  searchType:any=''
  searchText:any=''
  filterTable(){
   this.getLevelOneData(1, 10);
  }
  activeTab = 'pendingApplications';
 getLevelOneData(pageNo:any,PageSize:any): any {
    this.tableList = '';
    if(this.searchType && this.searchText){
       this.activeTab='pendingNew'
      this._commonService.getDataByUrl(APIS.tihclManager.getLevelOneData+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize+'&'+this.searchType+'='+this.searchText).subscribe({
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
       this._commonService.getDataByUrl(APIS.tihclManager.getLevelOneData+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize).subscribe({
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
  approvalData:any={}
  ShowDataForApproval(item:any){
    this.approvalData=item
  }
  Remarks:any=''
  Approved(){
    // https://tihcl.com/tihcl/api/registrations/status/updation/TH647249?appStatus=MANAGER_APPROVAL_1&reasonForRejection=null
    this._commonService.updatedataByUrl(APIS.tihclManager.approveLevelOne+this.approvalData?.applicationNo+'?appStatus=MANAGER_APPROVAL_1&processType='+this.approveForm.value?.processType+'&product='+this.approveForm.value?.product).subscribe({
      next: (response) => {
           const modal = new bootstrap.Modal(this.successModal.nativeElement);
           modal.show(); 
           this.getLevelOneData(this.currentPage,  this.pageSize);
      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
  }
  Reject(){
    console.log(this.Remarks,this.RejectForm.value)
    // https://tihcl.com/tihcl/api/registrations/status/updation/TH647249?appStatus=REJECTED_MANAGER_APPROVAL_1&reasonForRejection=by%20some%20reason
     
    this._commonService.updatedataByUrl(APIS.tihclManager.approveLevelOne+this.approvalData?.applicationNo+'?appStatus=REJECTED_MANAGER_APPROVAL_1&reasonForRejection='+this.RejectForm.value?.remarks).subscribe({
      next: (response) => {
        this.RejectForm.reset()
        const modal = new bootstrap.Modal(this.ModalReject.nativeElement);
          modal.show(); 
     this.getLevelOneData(this.currentPage,  this.pageSize);
      },
      error: (error) => {
        this.RejectForm.reset()
        console.error('Error submitting form:', error);
      }
    });
  }
  review(){
    console.log(this.Remarks,this.RejectForm.value)
    // https://tihcl.com/tihcl/api/registrations/status/updation/TH647249?appStatus=REJECTED_MANAGER_APPROVAL_1&reasonForRejection=by%20some%20reason
     
    this._commonService.updatedataByUrl(APIS.tihclManager.approveLevelOne+this.approvalData?.applicationNo+'?appStatus=MANAGER_REVERIFY_1&reasonForRejection='+this.RejectForm.value?.remarks).subscribe({
      next: (response) => {
        this.RejectForm.reset()
        const modal = new bootstrap.Modal(this.ModalReview.nativeElement);
          modal.show(); 
     this.getLevelOneData(this.currentPage,  this.pageSize);
      },
      error: (error) => {
        this.RejectForm.reset()
        console.error('Error submitting form:', error);
      }
    });
  }
}
