import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  disbursements: any[] = [];
  isEditMode: boolean = false;
  currentEditIndex: number = -1;

  applicationData:any
   @Output() progressBarStatusUpdate:any = new EventEmitter();
   constructor(private fb: FormBuilder,private toastrService: ToastrService,
          private _commonService: CommonServiceService,) {
             const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
             this.applicationData=applicationData
    }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAddDisbursementForm();
  }

  initializeForm(): void {
    this.disbursementForm = this.fb.group({
      sanctionedAmt: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      disbursmentAmt: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      dateDisbursement: [null],
      bankName: ['', Validators.required],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      acountName: ['', Validators.required],
      acountNumber: ['', [Validators.required, Validators.pattern(/^\d{9,18}$/)]],
      collectionDate: ['', Validators.required],
      feeAmount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      tsiPass: ['', Validators.required],
      rocFilling: ['', Validators.required]
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

  get f() {
    return this.disbursementForm.controls;
  }

  get af() {
    return this.addDisbursementForm.controls;
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
      disbursmentAmt: totalDisbursed
    });
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