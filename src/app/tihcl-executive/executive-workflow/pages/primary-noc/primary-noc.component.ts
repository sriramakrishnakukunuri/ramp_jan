 import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS, UploadPath } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-primary-noc',
  templateUrl: './primary-noc.component.html',
  styleUrls: ['./primary-noc.component.css']
})
export class PrimaryNocComponent implements OnInit {
@Input() freeze:any
  applicationData:any
  constructor(private fb: FormBuilder, private toastrService: ToastrService,
        private _commonService: CommonServiceService,
        private router: Router,) {
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

    this.selectedfiles = event.target.files[0];
      console.log(this.selectedfiles)
    
  }
  FinalSubmit(){
   if(this.selectedfiles){
     let formData =new FormData()
      formData.set("file",this.selectedfiles);
      formData.set("directory",'/primaryLender/'+this.applicationData?.applicationNo);
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
}
