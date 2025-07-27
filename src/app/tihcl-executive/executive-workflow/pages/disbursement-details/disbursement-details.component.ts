import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-disbursement-details',
  templateUrl: './disbursement-details.component.html',
  styleUrls: ['./disbursement-details.component.css']
})
export class DisbursementDetailsComponent implements OnInit {
  disbursementForm!: FormGroup;
  addDisbursementForm!: FormGroup;
   addBankDetailsForm!: FormGroup;
  disbursements: any[] = [];
  bankdetails: any[] = [];
  isEditMode: boolean = false;
  currentEditIndex: number = -1;
  @Input() freeze:any
  applicationData:any
   @Output() progressBarStatusUpdate:any = new EventEmitter();
   constructor(private fb: FormBuilder,private toastrService: ToastrService,
          private _commonService: CommonServiceService,) {
             const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
             this.applicationData=applicationData
             this.getSantionedData(APIS.tihclExecutive.getSanctionRid + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
             this.getExistingData(APIS.tihclExecutive.getDisbursementRid + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
    }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAddDisbursementForm();
    this.initializeaddBankDetailsForm();
  }
  getSantionedData(url: string) {
     this._commonService.getDataByUrl(url).subscribe({
       next: (dataList: any) => {
         if (dataList) {
           this.disbursementForm.patchValue({
            totalSanctionedAmount: dataList?.sanctionedAmount || 0,
           });
          }
       },
       error: (error: any) => {
         this.toastrService.error(error.error.message);
       }
          });
  }
    getExistingData(url:any){
      this._commonService.getDataByUrl(url).subscribe({
       next: (dataList: any) => {
         if (dataList) {
             // Patch disbursement form fields if data exists
             this.disbursementForm.patchValue({
              id: dataList?.id || null,
             totalSanctionedAmount: dataList?.totalSanctionedAmount || 0,
             totalDisbursedAmount: dataList?.totalDisbursedAmount || 0,
             dateDisbursement: dataList?.dateDisbursement || null,
             collectionDate: dataList?.collectionDate || null,
             processingFeeCollectedAmount: dataList?.processingFeeCollectedAmount || '',
             processingFeeReceivedDate: dataList?.processingFeeReceivedDate || null,
             processingFeeGSTPercent: dataList?.processingFeeGSTPercent || '',
             tgipassUpload: dataList?.tgipassUpload || '',
             rocFiling: dataList?.rocFiling || '',
             tgipassUploadPath: dataList?.tgipassUploadPath || null,
             rocFilingPath: dataList?.rocFilingPath || null,
             });

             // Patch disbursements array if present
             this.disbursements = Array.isArray(dataList?.disbursements) ? dataList.disbursements : [];

             // Patch bankdetails array if present
             this.bankdetails = Array.isArray(dataList?.disbursementBankDetails) ? dataList.disbursementBankDetails : [];
           }
       },
       error: (error: any) => {
         this.toastrService.error(error.error.message);
       }
          });
  }
  today: any=this._commonService.getDate()
  initializeForm(): void {
    this.disbursementForm = this.fb.group({
      id:[null],
      totalSanctionedAmount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      totalDisbursedAmount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      processingFeeReceivedDate: ['', Validators.required],
      processingFeeGSTPercent: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/), // allows decimals up to 2 places
        Validators.min(0),
        Validators.max(100)
      ]
      ],
      collectionDate: ['', Validators.required],
      processingFeeCollectedAmount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      tgipassUpload: ['', Validators.required],
      rocFiling: ['', Validators.required],
      tgipassUploadPath: [null],
      rocFilingPath: [null],
    });
  }

  initializeAddDisbursementForm(): void {
    this.addDisbursementForm = this.fb.group({
      id:[null],
      disbursementDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      details: ['', Validators.required]
    });
  }
   initializeaddBankDetailsForm(): void {
    this.addBankDetailsForm = this.fb.group({
      id:[null],
        bankName: ['', Validators.required],
        ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      acountName: ['', Validators.required],
      acountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
    });
  }

  get f() {
    return this.disbursementForm.controls;
  }

  get af() {
    return this.addDisbursementForm.controls;
  }
  get abf() {
    return this.addBankDetailsForm.controls;
  }
  // uploadedFile: any = '';
   selectedfiles:any=''
   tgipassUploadfilePath:any
   onFileSelectedtgipassUpload(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // this.rampChecklistForm.get('creditApprasialPath')?.setValue(file.name);
  
            let formData =new FormData()
            formData.set("file",event.target.files[0]);
            formData.set("directory",'/tgipassUpload/'+this.applicationData?.applicationNo);
            console.log(formData)
           this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
             next: (response) => {
                 this.tgipassUploadfilePath=response?.filePath
                 this.disbursementForm.get('tgipassUploadPath')?.setValue(this.tgipassUploadfilePath);
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      // Here you would typically upload the file to your server
    }
  }
    selectedfilesrocFilling:any=''
   rocFillingfilePath:any
   onFileSelectedrocFilling(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // this.rampChecklistForm.get('creditApprasialPath')?.setValue(file.name);
  
            let formData =new FormData()
            formData.set("file",event.target.files[0]);
            formData.set("directory",'/rocFilling/'+this.applicationData?.applicationNo);
            console.log(formData)
           this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
             next: (response) => {
                 this.tgipassUploadfilePath=response?.filePath
                 this.disbursementForm.get('rocFilingPath')?.setValue(this.tgipassUploadfilePath);
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      // Here you would typically upload the file to your server
    }
  }
  addDisbursement(): void {
    if (this.addDisbursementForm.invalid) {
      this.addDisbursementForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      // Update existing disbursement
      this.disbursements[this.currentEditIndex] = {
        id: null,
        disbursementDate: this.addDisbursementForm.value.disbursementDate,
        amount: this.addDisbursementForm.value.amount,
        details: this.addDisbursementForm.value.details
      };
      this.isEditMode = false;
      this.currentEditIndex = -1;
    } else {
      // Add new disbursement
      const newDisbursement = {
        id: null,
        disbursementDate: this.addDisbursementForm.value.disbursementDate,
        amount: this.addDisbursementForm.value.amount,
        details: this.addDisbursementForm.value.details
      };
      this.disbursements.push(newDisbursement);
    }

    // Reset form and update total disbursed amount
    this.addDisbursementForm.reset();
    this.updateTotalDisbursedAmount();
  }

  editCreditDetails(item: any, index: number): void {
    this.isEditMode = true;
    this.currentEditIndex = index;
    
    // Set form values with the item to be edited
    this.addDisbursementForm.patchValue({
      id:item?.id?item?.id:null,
      disbursementDate: item.disbursementDate,
      amount: item.amount,
      details: item.details
    });
    
    // Open modal (assuming you're using Bootstrap modal)
    const modal = document.getElementById('addDisbursement');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  deleteCreditDetail(item:any,index: number): void {
    if (confirm('Are you sure you want to delete this disbursement?')) {
      this.disbursements.splice(index, 1);
      
      // Update IDs to maintain sequence
      if(item?.id){
         this._commonService.deleteById(APIS.tihclExecutive.getdisbursementDelete,item?.id).subscribe({
             next: (response) => {
                // this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      }
      
      this.updateTotalDisbursedAmount();
    }
  }

  private updateTotalDisbursedAmount(): void {
    const totalDisbursed = this.disbursements.reduce((sum, item) => sum + Number(item.amount), 0);
    this.disbursementForm.patchValue({
      totalDisbursedAmount: totalDisbursed
    });
  }


   addBankDetails(): void {
    if (this.addBankDetailsForm.invalid) {
      this.addBankDetailsForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      // Update existing bank details
      this.bankdetails[this.currentEditIndex] = {
        ...this.bankdetails[this.currentEditIndex],
        bankDetails: {
          id: null,
          bankName: this.addBankDetailsForm.value.bankName,
          ifscCode: this.addBankDetailsForm.value.ifscCode,
          acountName: this.addBankDetailsForm.value.acountName,
          acountNumber: this.addBankDetailsForm.value.acountNumber
        }
      };
      this.isEditMode = false;
      this.currentEditIndex = -1;
    } else {
      // Add new bank details
      const newBankDetails = {
        id: null,
        bankName: this.addBankDetailsForm.value.bankName,
        ifscCode: this.addBankDetailsForm.value.ifscCode,
        acountName: this.addBankDetailsForm.value.acountName,
        acountNumber: this.addBankDetailsForm.value.acountNumber
      };
      // You can push to a separate array or attach to bankdetails as needed
       this.bankdetails.push(newBankDetails);
    }

    // Reset form
    this.addBankDetailsForm.reset();
    
  }

  editBankDetails(item: any, index: number): void {
    this.isEditMode = true;
    this.currentEditIndex = index;

    // Set form values with the item to be edited
    this.addBankDetailsForm.patchValue({
      id: item?.id ?? null,
      bankName: item.bankName,
      ifscCode: item.ifscCode,
      acountName: item.acountName,
      acountNumber: item.acountNumber
    });

    // Open modal (assuming you're using Bootstrap modal)
    const modal = document.getElementById('addBankDetails');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }


deleteBankDetails(item: any, index: number): void {
    // if (confirm('Are you sure you want to delete these bank details?')) {
    //   // If you are storing bank details in a separate array, remove from there.
    //   // If bank details are part of bankdetails, remove or clear from the corresponding disbursement.
    //   // Example if you have a bankDetailsList array:
    //   // this.bankDetailsList.splice(index, 1);

    //   // If bank details are attached to bankdetails:
    //   if (this.bankdetails[index] && this.bankdetails[index].bankDetails) {
    //     this.bankdetails[index].bankDetails = null;
    //   }

    //   // If you have an id and want to delete from backend
    //   // if (item?.id) {
    //   //   this._commonService.deleteById(APIS.tihclExecutive.getBankDetailsDelete, item.id).subscribe({
    //   //     next: (response) => {
    //   //       // Optionally emit progress or refresh UI
    //   //     },
    //   //     error: (error) => {
    //   //       console.error('Error deleting bank details:', error);
    //   //     }
    //   //   });
    //   // }
    // }
    this.bankdetails.splice(index, 1);

  }

  onSubmit(): void {
    if (this.disbursementForm.invalid) {
      this.disbursementForm.markAllAsTouched();
      return;
    }
    
    // Submit form logic here
    console.log('Form submitted:', {
      ...this.disbursementForm.value,
      disbursements: this.disbursements
    });
     const payload = {
        ...this.disbursementForm.value,
        "applicationNo": this.applicationData?.applicationNo,
         disbursements: this.disbursements?this.disbursements:[],
         disbursementBankDetails: this.bankdetails?this.bankdetails:[],
        "applicationStatus": "DISBURSEMENT_COMPLETED"
      };
    this._commonService.add(APIS.tihclExecutive.saveDisbursement,payload).subscribe({
             next: (response) => {
                this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
      });

  }
  finalSave(){
     if (this.disbursementForm.invalid) {
      this.disbursementForm.markAllAsTouched();
      return;
    }
     // Submit form logic here
    console.log('Form submitted:', {
      ...this.disbursementForm.value,
      disbursements: this.disbursements
    });
     const payload = {
        ...this.disbursementForm.value,
        "applicationNo": this.applicationData?.applicationNo,
         disbursements: this.disbursements?this.disbursements:[],
        "applicationStatus": "DISBURSEMENT_COMPLETED"
      };
    this._commonService.add(APIS.tihclExecutive.saveDisbursement,payload).subscribe({
             next: (response) => {
                this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
      });
  }
  onPrevious(): void {
    // Navigation logic for previous step
  }
}