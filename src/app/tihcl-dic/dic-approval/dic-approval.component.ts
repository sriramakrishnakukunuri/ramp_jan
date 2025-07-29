 import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
 import { Router } from '@angular/router';
 import { CommonServiceService } from '@app/_services/common-service.service';
 import { APIS, UploadPath } from '@app/constants/constants';
 import { ToastrService } from 'ngx-toastr';
 import DataTable from 'datatables.net-dt';
 import 'datatables.net-buttons-dt';
 import 'datatables.net-responsive-dt';
 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 declare var bootstrap: any;
 declare var $: any;

@Component({
  selector: 'app-dic-approval',
  templateUrl: './dic-approval.component.html',
  styleUrls: ['./dic-approval.component.css']
})
export class DicApprovalComponent implements OnInit {

 loginsessionDetails:any
 tableList:any=[]
 RejectForm!: FormGroup;
 uploadForm!: FormGroup;
   currentPage = 1;
   pageSize = 10;
   totalItems = 100;
   pagedData: any[] = [];
   @ViewChild('successModal') successModal!: ElementRef;
    @ViewChild('ModalReject') ModalReject!: ElementRef;
  constructor(
   private fb: FormBuilder,
      private toastrService: ToastrService,
      private _commonService: CommonServiceService,
      private router: Router,
    ) { 
      this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
      console.log(this.loginsessionDetails)
    }
   ngOnInit(): void {
     this.rejectDetail()
     this.uploadDetail()
     this.getLevelOneData(1, 10);
   }
    rejectDetail(): void {
       this.RejectForm=this.fb.group({
         remarks: ['', Validators.required],
        
       });
     }
      uploadDetail(): void {
       this.uploadForm=this.fb.group({
         file: ['', Validators.required],
        directory:['dic/']

       });
     }
    onPageChange(event: {page: number, pageSize: number}): void {
     this.currentPage = event.page;
     this.pageSize = event.pageSize;
      this.getLevelOneData(this.currentPage,  this.pageSize);
   }
  getLevelOneData(pageNo:any,PageSize:any): any {
     this.tableList = '';
     this._commonService.getDataByUrl(APIS.tihclDIC.getLevelDICData+'&district='+this.loginsessionDetails?.district+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize).subscribe({
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
   approvalData:any={}
   ShowDataForApproval(item:any){
     this.approvalData=item
   }
   Remarks:any=''
   selectedfiles:any
    onFilesSelected(event: any) {
      console.log(event.target.files)
     this.selectedfiles = event.target.files[0];
    //  this.selectUploadedFiles = event.target.files[0];
    //  if (this.selectUploadedFiles) {
    //    this.globaldisable = true;
    //  }
    //  else {
    //    this.globaldisable = false;
    //  }
    //  let totalSize = 0;
    //  this.multipleFiles = [];
    
    //  for (var i = 0; i < this.selectedfiles.length; i++) {
    //    this.fileName = this.selectedfiles[i].name;
    //    this.fileSize = this.selectedfiles[i].size;
    //    this.fileType = this.selectedfiles[i].type;
    //    totalSize += this.fileSize;
 
    //   //  if (totalSize > 25 * 1024 * 1024) { // 25MB in bytes
    //   //    this.fileErrorMsg = 'Total file size exceeds 25MB';
    //   //    //this.toastrService.error('Total file size exceeds 25MB', 'File Upload Error');
    //   //    return;
    //   //  }
 
    //    this.multipleFiles.push(this.selectedfiles[i]);
    //  }
   }
   Approved(){
      console.log(this.uploadForm.value)
      let formData =new FormData()
      formData.set("file",this.selectedfiles);
      formData.set("directory",this.uploadForm.value?.directory+this.approvalData?.applicationNo);
      console.log(formData)
     this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
       next: (response) => {
            console.log(response)
           this.updateRegistration(response)
       },
       error: (error) => {
         console.error('Error submitting form:', error);
       }
     });
   }
   updateRegistration(data?:any){
    this._commonService.updatedata(APIS.tihclDIC.updateRgistrationwithDic+this.approvalData?.applicationNo+'?dicNocFilePath='+(data?.filePath)+'&appStatus=DIC_APPROVAL',{}).subscribe({
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
 }