import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS,UploadPath } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-di-concern-letter',
  templateUrl: './di-concern-letter.component.html',
  styleUrls: ['./di-concern-letter.component.css']
})
export class DiConcernLetterComponent implements OnInit {

  assessmentForm!: FormGroup;
applicationData:any
@Input() freeze:any
currentStep:any
 @Output() progressBarStatusUpdate:any = new EventEmitter();
  constructor(private fb: FormBuilder,private toastrService: ToastrService,
     private sanitizer: DomSanitizer,
      private _commonService: CommonServiceService,private http: HttpClient) { 
         this.currentStep = this._commonService.getCurrentStep();
    const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
    this.applicationData=applicationData
    this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
  }

  ngOnInit(): void {
  }
  managrData:any
   getDtataByUrl(url: string) {
      this._commonService.getDataByUrl(url).subscribe({
        next: (dataList: any) => {
         this.managrData=dataList?.data
        },
        error: (error: any) => {
          this.toastrService.error(error.error.message);
        }
      });
    }
    ngOnChanges(){
      console.log("freeze value in dic consent",this.freeze)
      this.currentStep = this._commonService.getCurrentStep();
    const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
    this.applicationData=applicationData
    this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
    }
    DownloadDic(){
      // dicNocFilePath
      console.log(this.managrData?.dicNocFilePath)
      // let  s3BaseUrl = 'https://tihcl.s3.us-east-1.amazonaws.com';
      // this._commonService.downloadFile(s3BaseUrl,this.managrData?.dicNocFilePath)
      let linkUrl =   this.managrData?.dicNocFilePath
        const link = document.createElement("a");
        link.setAttribute("download", linkUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("href", linkUrl);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
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
    this.ApprovedData()
   }
   showCreditPreviewModal = false;

safePreviewUrl: any;
   openCreditPreviewModal() {
  const path = this.managrData?.dicNocFilePath;
  if (path) {
    // only create SafeResourceUrl once
    this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  this.showCreditPreviewModal = true;
}
closeCreditPreviewModal() {
  this.showCreditPreviewModal = false;
}
isImageFile(filePath: string): boolean {
  return /\.(jpg|jpeg|png|gif)$/i.test(filePath || '');
}

 getSafePreviewUrl(): SafeResourceUrl {
    const url = this.managrData?.dicNocFilePath
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

   ApprovedData(){
        //  console.log(this.uploadForm.value)
         let formData =new FormData()
         formData.set("file",this.selectedfiles);
         formData.set("directory","dic/"+this.applicationData?.applicationNo);
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
       this._commonService.updatedata(APIS.tihclDIC.updateRgistrationwithDic+this.applicationData?.applicationNo+'?dicNocFilePath='+(data?.filePath)+'&appStatus=DIC_APPROVAL',{}).subscribe({
          next: (response) => {
                 this.progressBarStatusUpdate.emit({"update":true})
                  this.getDtataByUrl(APIS.tihclExecutive.registerData + (this.applicationData.registrationUsageId? this.applicationData?.registrationUsageId:this.applicationData?.registrationId))
              //  this.getLevelOneData(this.currentPage,  this.pageSize);
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
    Approved(){
        // https://tihcl.com/tihcl/api/registrations/status/updation/TH647249?appStatus=MANAGER_APPROVAL_1&reasonForRejection=null
        this._commonService.updatedataByUrl(APIS.tihclManager.approveLevelOne+this.applicationData?.applicationNo+'?appStatus=DIC_CONSENT_APPROVAL&reasonForRejection=null').subscribe({
          next: (response) => {
            this.progressBarStatusUpdate.emit({"update":true})
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
}
