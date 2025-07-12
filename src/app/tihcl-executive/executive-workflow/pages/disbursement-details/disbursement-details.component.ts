import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-disbursement-details',
  templateUrl: './disbursement-details.component.html',
  styleUrls: ['./disbursement-details.component.css']
})
export class DisbursementDetailsComponent implements OnInit {
  disbursementForm!: FormGroup;
  addDisbursementForm!: FormGroup;
  disbursements: any[] = [
    { id: 1, date: '13-05-2025', amount: 200000, details: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.' }
  ];

  constructor(
    private fb: FormBuilder,
    // private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAddDisbursementForm();
  }

  initializeForm(): void {
    this.disbursementForm = this.fb.group({
      sanctionedAmt: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      disbursmentAmt: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      dateDisbursement: ['', Validators.required],
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
      date: ['', Validators.required],
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

  // openAddDisbursementModal(content: any): void {
  //   this.addDisbursementForm.reset();
  //   this.modalService.open(content, { ariaLabelledBy: 'addDisbursementLabel' });
  // }

  addDisbursement(): void {
    if (this.addDisbursementForm.invalid) {
      this.addDisbursementForm.markAllAsTouched();
      return;
    }

    const newDisbursement = {
      id: this.disbursements.length + 1,
      date: this.addDisbursementForm.value.date,
      amount: this.addDisbursementForm.value.amount,
      details: this.addDisbursementForm.value.details
    };

    this.disbursements.push(newDisbursement);
    // this.modalService.dismissAll();
    
    // Update total disbursed amount
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
    console.log(this.disbursementForm.value);
  }

  onPrevious(): void {
    // Navigation logic for previous step
  }
}