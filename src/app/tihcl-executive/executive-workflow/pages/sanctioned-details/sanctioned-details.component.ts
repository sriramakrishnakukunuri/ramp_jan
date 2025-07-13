import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sanctioned-details',
  templateUrl: './sanctioned-details.component.html',
  styleUrls: ['./sanctioned-details.component.css']
})
export class SanctionedDetailsComponent implements OnInit {

  sanctionForm!: FormGroup ;
  showSecurityFields = false;
 @Output() progressBarStatusUpdate:any = new EventEmitter();
    applicationData:any
      constructor(private fb: FormBuilder, private toastrService: ToastrService,
            private _commonService: CommonServiceService,
            private router: Router,) {
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
      securityValue: [0],
      termsOfSanction: [''],
      remarks: [''],
      sanctionLetterPath: ['',[Validators?.required]],
    });
  }

  setupSecurityToggle(event:any) {
    this.showSecurityFields = event;
        // Reset security fields when security is not provided
        if (!this.showSecurityFields) {
          this.sanctionForm.get('securityDescription')?.reset();
          this.sanctionForm.get('securityValue')?.reset();
        }
  }

  onSubmit(): void {
    console.log(this.sanctionForm.value)
    if (this.sanctionForm.valid) {
      const formValue = this.sanctionForm.value;
      // Convert empty strings to null for optional fields
      const payload = {
        ...formValue,
        securityDescription: formValue.isSecurityProvided ? formValue.securityDescription : null,
        securityValue: formValue.isSecurityProvided ? formValue.securityValue : null,
        "applicationNo": this.applicationData?.applicationNo,
        "applicationStatus": "SANCTION_LETTER_UPLOAD"
      };
       this._commonService.add(APIS.tihclExecutive.saveSanction,payload).subscribe({
             next: (response) => {
                this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      console.log('Form submitted:', payload);
      // Handle form submission
    } else {
      this.sanctionForm.markAllAsTouched();
    }
  }
filePath:any
  onFileChange(event: any): void {
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

  goToPrevious(): void {
    // Implement navigation to previous step
  }
}