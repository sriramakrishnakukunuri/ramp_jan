import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS, UploadPath } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '@app/common_components/loader-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-primary-noc',
  templateUrl: './primary-noc.component.html',
  styleUrls: ['./primary-noc.component.css']
})
export class PrimaryNocComponent implements OnInit {
@Input() freeze:any
  applicationData:any
  constructor(private fb: FormBuilder, private toastrService: ToastrService,
    private loader: LoaderService,
        private _commonService: CommonServiceService,
        private router: Router,
        private sanitizer: DomSanitizer) {
           const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
          this.applicationData=applicationData
          this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
  
        }
    @Output() progressBarStatusUpdate:any = new EventEmitter();

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




  
   selectedfiles:any=''
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10 MB in bytes
        this.toastrService.error('Upload file less than 10 MB');
        this.selectedfiles = '';
        return;
      }
      this.selectedfiles = file;
      console.log(this.selectedfiles);
    }
  }
  FinalSubmit(){
   if(this.selectedfiles){
    this.loader.show()
     let formData =new FormData()
      formData.set("file",this.selectedfiles);
      formData.set("directory",'/primaryLender/'+this.applicationData?.applicationNo);
      console.log(formData)
     this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
       next: (response) => {
        this.loader.hide()
         this.toastrService.success("File Uploaded Successfully")
            console.log(response)
           this.updateRegistration(response)
       },
       error: (error) => {
        this.loader.hide()
         this.toastrService.error("File Upload Failed, Please try again")
         console.error('Error submitting form:', error);
       }
     });
   }

  }
    updateRegistration(data?:any){
      this._commonService.updatedata(APIS.tihclDIC.updateRgistrationwithprimaryLenderNoc+this.applicationData?.applicationNo+'?primaryLenderNocFilePath='+(data?.filePath)+'&appStatus=PRIMARY_LENDER_NOC',{}).subscribe({
         next: (response) => {
            this.progressBarStatusUpdate.emit({"update":true})
         },
         error: (error) => {
           console.error('Error submitting form:', error);
         }
       });
     }

     
     showCreditPreviewModal = false;
safePreviewUrl: any;

openCreditPreviewModal() {
  const path = this.managrData?.primaryLenderNocFilePath;
  if (path) {
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
  const url = this.managrData?.primaryLenderNocFilePath || '';
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}
