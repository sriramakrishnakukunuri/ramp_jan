import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '@app/common_components/loader-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sanctioned-details',
  templateUrl: './sanctioned-details.component.html',
  styleUrls: ['./sanctioned-details.component.css']
})
export class SanctionedDetailsComponent implements OnInit {
@Input() freeze:any
  sanctionForm!: FormGroup ;
  showSecurityFields = false;
   today: any=this._commonService.getDate()
 @Output() progressBarStatusUpdate:any = new EventEmitter();
    applicationData:any
      constructor(private fb: FormBuilder, private toastrService: ToastrService,
            private _commonService: CommonServiceService,
            private loader: LoaderService,
            private router: Router,
            private sanitizer: DomSanitizer) {
                const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
              this.applicationData=applicationData
              this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
              
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
    
  ngOnInit() {
    this.initializeForm();
    this.getExistingData(APIS.tihclExecutive.getSanctionRid + (this.applicationData.registrationUsageId? this.applicationData?.registrationUsageId:this.applicationData?.registrationId))
    this.setupSecurityToggle(false);
  }

  initializeForm() {
    this.sanctionForm = this.fb.group({
      sanctionedDate: ['', Validators.required],
      sanctionedAmount: [0, [Validators.required, Validators.min(0)]],
      roi: [0, [Validators.required, Validators.min(0)]],
      tenor: [0, [Validators.required, Validators.min(1)]],
      moratoriumPeriod: [0, [Validators.required, Validators.min(0)]],
      dsraAmount: [0, Validators.min(0)],
      isSecurityProvided: [false],
      securityDescription: [''],
      productType: [''],
      securityType: [''],
      securityValue: [0],
      // termsOfSanction: [''],
      remarks: [''],
      sanctionLetterPath: ['',[Validators?.required]],
    });
  }
  getExistingData(url:any){
      this._commonService.getDataByUrl(url).subscribe({
       next: (dataList: any) => {
         if (dataList) {
           this.sanctionForm.patchValue({
        sanctionedDate: dataList?.sanctionedDate || '',
        sanctionedAmount: dataList?.sanctionedAmount || 0,
        roi: dataList?.roi || 0,
        tenor: dataList?.tenor || 0,
        moratoriumPeriod: dataList?.moratoriumPeriod || 0,
        dsraAmount: dataList?.dsraAmount || 0,
        isSecurityProvided: dataList?.isSecurityProvided || false,
        securityDescription: dataList?.securityDescription || '',
        securityType: dataList?.securityType || '',
        productType: dataList?.productType || '',
        securityValue: dataList?.securityValue || 0,
        // termsOfSanction: dataList?.termsOfSanction || '',
        remarks: dataList?.remarks || '',
        sanctionLetterPath: dataList?.sanctionLetterPath || ''
           });
           this.setupSecurityToggle(dataList?.isSecurityProvided);
         }
       },
       error: (error: any) => {
         this.toastrService.error(error.error.message);
       }
          });
  }

  setupSecurityToggle(event:any) {
    this.showSecurityFields = event;
        // Reset security fields when security is not provided
        if (!this.showSecurityFields) {
          this.sanctionForm.get('securityDescription')?.reset();
          this.sanctionForm.get('securityType')?.reset();
          this.sanctionForm.get('securityValue')?.reset();
        }
  }

  onSubmit(): void {
    console.log(this.sanctionForm.value)
    if (this.sanctionForm.valid) {
      this.loader.show()
      const formValue = this.sanctionForm.value;
      // Convert empty strings to null for optional fields
      const payload = {
        ...formValue,
        securityDescription: formValue.isSecurityProvided ? formValue.securityDescription : null,
        securityType: formValue.isSecurityProvided ? formValue.securityType : null,
        securityValue: formValue.isSecurityProvided ? formValue.securityValue : null,
        "applicationNo": this.applicationData?.applicationNo,
        "applicationStatus": "SANCTION_LETTER_UPLOAD"
      };
       this._commonService.add(APIS.tihclExecutive.saveSanction,payload).subscribe({
             next: (response) => {
              this.loader.hide()
              this.toastrService.success("Sanction Details Saved Successfully")
                this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
              this.loader.hide()
              this.toastrService.error(error?.error?.message || "Something went wrong while submitting the form")
               console.error('Error submitting form:', error);
             }
           });
      console.log('Form submitted:', payload);
      // Handle form submission
    } else {
      this.toastrService.error("Please fill all the required fields in the form")
      this.sanctionForm.markAllAsTouched();
    }
  }
filePath:any
  onFileChange(event: any): void {
     const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10 MB in bytes
        this.toastrService.error('Upload file less than 10 MB');
        
        return;
      }
     
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
        if (file) {
      // this.rampChecklistForm.get('creditApprasialPath')?.setValue(file.name);
  
            let formData =new FormData()
            formData.set("file",event.target.files[0]);
            formData.set("directory",'/sanctionDetails/'+this.applicationData?.applicationNo);
            console.log(formData)
           this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
             next: (response) => {
                 this.filePath=response?.filePath
                 this.sanctionForm.get('sanctionLetterPath')?.setValue(this.filePath);
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      // Here you would typically upload the file to your server
    }
    }
  }

  // const path = this.sanctionForm.get('sanctionLetterPath')?.value;

showCreditPreviewModal = false;

safePreviewUrl: any;

openCreditPreviewModal() {
  const path = this.sanctionForm.get('sanctionLetterPath')?.value;

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
    const url = this.sanctionForm.get('sanctionLetterPath')?.value;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

onSanctionLetterSelected(event: any): void {
 const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10 MB in bytes
        this.toastrService.error('Upload file less than 10 MB');
        
        return;
      }
     
    }
  }


}