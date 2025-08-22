import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-preliminar-assessment',
  templateUrl: './preliminar-assessment.component.html',
  styleUrls: ['./preliminar-assessment.component.css']
})
export class PreliminarAssessmentComponent implements OnInit {
  // Main form group
  assessmentForm!: FormGroup;
    updateFormFields!: FormGroup;
  creditDetailsForm!: FormGroup;
  @Output() progressBarStatusUpdate:any = new EventEmitter();
   @ViewChild('addDelivery') addDelivery!: ElementRef;
   @ViewChild('UpdateLoanModal') UpdateLoanModal!: ElementRef;
   @ViewChild('approvedModal') approvedModal!: ElementRef;
   @Input() freeze:any
  // Loans table data
  loansData: any[] = [
    {
      bankName: 'ICICI Bank',
      limitSanctioned: 200000,
      outstandingAmount: 100000,
      overdueAmount: 50000,
      overdueDate: '2025-05-09'
    }
  ];

  // Stress score options
 stressScoreOptions:any = [
  {
    id: 1,
    issue: "Delay in project implementation",
    Probable_Cause: "Wrong assessment. Lack of involvement. Delay in supply of machineries. Lack of control.",
    impact: "Cost over run / Time over run / diversion of funds earmarked for WC / termloan margins / Lack of WC funds for operation",
    options: [
      { value: 1, label: "Mild delay(2)" },
      { value: 2, label: "Moderate Delay(5)" },
      { value: 3, label: "Abnormal Delay(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 2,
    issue: "Production below projected level of capacity utilization",
    Probable_Cause: "Absence of expert operators. Lack of raw materials. Improper factory setup. Power/labour problems. Lack of demand.",
    impact: "Lack of required WC funds to meet the operations / Low cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
    options: [
      { value: 1, label: "Temporarily(2)" },
      { value: 2, label: "Frequently(6)" },
      { value: 3, label: "Permanently(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 3,
    issue: "Gradual decrease of sales",
    Probable_Cause: "Diversion of fund. Nonrealization of Book Debts. Lack of concentration on Marketing. Production bottleneck. Mismanagement. Poor quality. Increased competition.",
    impact: "Low cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
    options: [
      { value: 1, label: "Fair Chance to increase(4)" },
      { value: 2, label: "Moderate Chance to increase(6)" },
      { value: 3, label: "Bleak Chance(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 4,
    issue: "Delay in payment of statutory dues",
    Probable_Cause: "Casual in nature. Lack of sufficient cash-flow / cash flow mismatches.",
    impact: "Haulting production",
    options: [
      { value: 1, label: "Temporary cash flow mismatches(4)" },
      { value: 2, label: "Cash Flow mismatches coupled with diversion of funds(6)" },
      { value: 3, label: "Mis-utilization of cash flows and major diversions(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 5,
    issue: "Diversion of working capital for capital expenses",
    Probable_Cause: "May be for urgent settlement. Inadequate internal accrual. Lack of planning. May be a deliberate act.",
    impact: "Low capacity utilization / decline in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
    options: [
      { value: 1, label: "Diversion with definite source of resources to rebuild working capital in a specific timeline(5)" },
      { value: 2, label: "Diversion without identified source to rebuild the working capital(8)" },
      { value: 3, label: "Permanent diversion(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 6,
    issue: "Abnormal increase in creditors",
    Probable_Cause: "Suppliers trying to dump the product. Lack of production planning. Inadequate cash flow. Diversion of funds. Overtrading. Non realisation of Trade receivables within the contacted credit period. Decline in demand",
    impact: "Low capacity utilization / decline in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
    options: [
      { value: 1, label: "Temporary phenomena due to unforeseen Internal(2)" },
      { value: 2, label: "External factors, with definite timeline for correction(6)" },
      { value: 3, label: "Issues related to production, marketing, temporary diversion of funds, which require considerable time to correct (10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 7,
    issue: "SMA 2 / NPA Status of the Account",
    Probable_Cause: "Stress, Incipient sickness or sickness of the Unit.",
    impact: "Sealing of the unit / Initiate recovery procedure / Winding of the unit",
    options: [
      { value: 1, label: "SMA 1/2/3 (2)" },
      { value: 2, label: "NPA(10)" },
      { value: 3, label: "Not Viable (1)" },
      { value: 4, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 8,
    issue: "Unjustified rapid expansion without proper financial tie-up",
    Probable_Cause: "To have better market share. Improper planning.",
    impact: "Diversion of funds / Low capacity utilization / decline in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
    options: [
      { value: 1, label: "Non-significant(2)" },
      { value: 2, label: "Significant(6)" },
      { value: 3, label: "Serious(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 9,
    issue: "Leverage Position",
    Probable_Cause: "",
    impact: "Long term liquidity issues / Low capacity utilization / decline in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
     options: [
      { value: 1, label: "Non-significant(2)" },
      { value: 2, label: "Significant(6)" },
      { value: 3, label: "Serious(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  },
  {
    id: 10,
    issue: "Liquidity Position",
    Probable_Cause: "",
    impact: "Short term liquidity issues/ Low capacity utilization / decline in cashflow- unable to operate / Unable to meet overheads / cashflow mismatch / unable to make repayments to Banks/FIs / Account is out of order.",
   options: [
      { value: 1, label: "Non-significant(2)" },
      { value: 2, label: "Significant(6)" },
      { value: 3, label: "Serious(10)" },
      { value: 4, label: "Not Viable (1)" },
      { value: 5, label: "Not Applicable (0 && This question should be removed from the calculation of score)" }
    ]
  }
];
 createCreditDetail(item?: any): void {
    this.creditDetailsForm=this.fb.group({
      bankName: ['', Validators.required],
      natureOfLoan: ['', Validators.required],
      limitSanctioned: ['', Validators.required],
      outstandingAmount: [false],
      overdueAmount: ['', ],
      overdueDate: [null]
    });
  }
 
 submitCreditDetails(){   
  
    const deliveryDetailsArray = this.assessmentForm.get('creditFacilityDetails') as FormArray;
    // Push the new form group
    deliveryDetailsArray.push(this.fb.group(this.creditDetailsForm.value));

    this.creditDetailsForm.reset();
      const modal = new bootstrap.Modal(this.addDelivery.nativeElement);
      modal.hide(); 
  }
  addCreditDetail(): void {
    this.createCreditDetail();
    const modal = new bootstrap.Modal(this.addDelivery.nativeElement);
    modal.show();
  }
  editCreditDetails(item: any) {
    this.creditDetailsForm = this.fb.group({
      bankName: [item.bankName, Validators.required],
      natureOfLoan: [item.natureOfLoan, Validators.required],
      limitSanctioned: [item.limitSanctioned, Validators.required],
      outstandingAmount: [item.outstandingAmount],
      overdueAmount: [item.overdueAmount],
      overdueDate: [item.overdueDate]
    });
      const deliveryDetailsArray = this.assessmentForm.get('creditFacilityDetails') as FormArray;
      const index = deliveryDetailsArray.controls.findIndex(control => control.value === item);
      if (index !== -1) {
        deliveryDetailsArray.removeAt(index);
      }
       const modal = new bootstrap.Modal(this.addDelivery.nativeElement);
       modal.show(); 
  }

  deleteCreditDetail(index: number) {
    const deliveryDetailsArray = this.assessmentForm.get('creditFacilityDetails') as FormArray;
    deliveryDetailsArray.removeAt(index);
  }

  get creditDetails(): FormArray {
    return this.assessmentForm.get('creditFacilityDetails') as FormArray;
  }
  // Total stress score
  totalScore = 0;
applicationData:any
loginsessionDetails:any
  constructor(private fb: FormBuilder,private toastrService: ToastrService,
        private _commonService: CommonServiceService,) {
           this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
          console.log(this.loginsessionDetails)
           const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
           this.applicationData=applicationData
           this.initializeForm();
           this.createCreditDetail()
           this.getAllDistricts()
         console.log(applicationData)
          this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId?applicationData.registrationUsageId:applicationData.registrationId));
   
  }
  getApplicationData:any
  getDtataByUrl(url: string) {
    this._commonService.getDataByUrl(url).subscribe({
      next: (dataList: any) => {
       
         this.assessmentForm.patchValue(dataList.data);
         this.getApplicationData=dataList.data
         console.log(dataList?.data)

          const deliveryDetailsArray = this.assessmentForm.get('creditFacilityDetails') as FormArray;
          // Push the new form group
          if( dataList?.data?.creditFacilityDetails?.length){
              dataList?.data?.creditFacilityDetails.map((item:any)=>{
             deliveryDetailsArray.push(this.fb.group(item))
          })
          }
          if (dataList?.data && Array.isArray(dataList?.data.stressScore)) {
            this.totalScore=dataList?.data?.riskCategoryScore
            dataList.data?.stressScore.forEach((item: any) => {
          // Find the question by issue
          const question = this.stressScoreOptions.find((q: any) => q.issue === item.issue);
          if (question) {
            // Find the option label that starts with the riskCategorisation
            const option = question.options.find((opt: any) =>
              opt.label.startsWith(item.riskCategorisation)
            );
            if (option) {
              // Patch the form control with the full label
              this.assessmentForm.get(`stressScore_${question.id}`)?.patchValue(option.label);
            }
          }
        });
      }
        
        
         this.loansData = dataList.data.creditFacilityDetails || [];
         
        // Handle the dataList as needed
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }
  today:any
  ngOnInit(): void {
    const today = new Date();
  today.setDate(today.getDate() - 1);
  this.today = today.toISOString().split('T')[0];
  }
   udyamRegNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
      const value = control.value;
      if (!value) {
        return null; // Let required validator handle empty case
      }
      
      // Regular expression for UDYAM registration format
      const udyamRegex = /^(UDYAM|udyam)-[a-zA-Z]{2}-\d{2}-\d{7}$/;
      
      if (!udyamRegex.test(value)) {
        return { 'invalidUdyamFormat': true };
      }
      return null;
    }
     allDistricts:any
  getAllDistricts(){
    this.allDistricts = []
    this._commonService.getDataByUrl(APIS.tihclMasterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    })
  }
  MandalList:any
  GetMandalByDistrict(event: any) {
    this.updateFormFields.get('mandal')?.reset();

      const districId=this.allDistricts.filter((item:any)=>{
        console.log(item)
        if(event==item.districtName){
          return item
        }
      })
      console.log(districId)
    this.MandalList=[]
    if(districId.length){
        this._commonService.getDataByUrl(APIS.tihclMasterList.getMandal + districId[0]?.districtId).subscribe({
      next: (data: any) => {
        this.MandalList = data.data;
      },
      error: (err: any) => {
        this.MandalList = [];
      }
    })
    }
  

  }
  initializeForm() {
    this.updateFormFields = this.fb.group({

        enterpriseName: ['', [Validators.required,Validators.minLength(3)]],
       udyamRegNumber: ['', [Validators.required, this.udyamRegNumberValidator]],
      enterpriseCategory: ['', Validators.required],
      natureOfActivity: ['', Validators.required],
      
      // Factory location
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      existingCredit:[''],
      address: ['Sr.No. 528, Elikatta Industrial Area, Shadnagar, Telangana 509410',],
    } );
    this.assessmentForm = this.fb.group({
      // Basic information
      enterpriseName: ['', [Validators.required]],
      udyamRegNumber: ['', Validators.required],
      enterpriseCategory: ['', Validators.required],
      natureOfActivity: ['', Validators.required],
      
      // Factory location
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      address: [''],
      creditFacilityDetails: this.fb.array([]),
      // Credit facilities
      existingCredit: ['', Validators.required],
      
      // Additional details
      isGSTNumberExist: [false],
      gstNumber: ['',this.gstValidator()],
      sourceOfApplication: ['', Validators.required],
      // sector: ['', Validators.required],
      typeOfProduct: ['', [Validators.required, ]],
      productUsage: ['', [Validators.required, ]],
      
      // Problems and solutions
      problemsFaced: ['',[Validators.required, ]],
      expectedSolution: ['',[Validators.required, ]],
      
      // Stress scores (dynamically added)
      
      // Observations and status
      observations: ['',[Validators.required, ]],
      statusUpdate: [''],
    });
    for (let i = 1; i <= 10; i++) {
     this.assessmentForm.removeControl(`stressScore_${i}`);
   }
    // Initialize stress score controls
    this.stressScoreOptions.forEach((question:any) => {
      this.assessmentForm.addControl(`stressScore_${question.id}`, this.fb.control('', Validators.required));
    });
  }
    private gstValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const gstin = control.value.toUpperCase().trim();
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

      // Format validation
      if (!gstRegex.test(gstin)) {
        return { invalidFormat: true };
      }

      // // Checksum validation
      // if (!this.validateChecksum(gstin)) {
      //   return { invalidChecksum: true };
      // }

      return null;
    };
   }
  // Add a new loan to the table
  addLoan() {
    if (this.assessmentForm.get('loanForm')?.valid) {
      const loanData = this.assessmentForm.get('loanForm')?.value;
      this.loansData.push(loanData);
      
      // Reset the loan form
      this.assessmentForm.get('loanForm')?.reset();
    }
  }

  // Calculate total stress score
  calculateScore() {
    this.totalScore = 0;
    let count=0
    this.stressScoreOptions.forEach((question:any) => {
      const control = this.assessmentForm.get(`stressScore_${question.id}`);
      if (control?.value ) { // Skip "Not Applicable" options
        const selectedOption = question.options.find((opt:any) => opt.label === control.value);
        if (selectedOption) {
         
          // Extract score from label (e.g., "Mild delay(2)" -> 2)
          const scoreMatch = selectedOption.label.match(/\((\d+)\)/);

          console.log(scoreMatch)
          if (scoreMatch) {
             count++
            this.totalScore += parseInt(scoreMatch[1], 10);
          }
        }
      }

    });
    // this.totalScore= this.totalScore/count
    console.log(count,Math.round((this.totalScore / count) * 10),'sk')
    // Calculate percentage (max possible score is 100 if all questions scored 10)
    // this.totalScore = Math.min(Math.round((this.totalScore / count) * 100), 100);
    this.totalScore=Math.round((this.totalScore / count) * 10)
      console.log( this.totalScore,'djjd')
  }
   calculateScore1() {
    this.totalScore = 0;
    let count=0
    this.stressScoreOptions.forEach((question:any) => {
      const control = this.assessmentForm.get(`stressScore_${question.id}`);
      if (control?.value ) { // Skip "Not Applicable" options
        const selectedOption = question.options.find((opt:any) => opt.label === control.value);
        if (selectedOption) {
         
          // Extract score from label (e.g., "Mild delay(2)" -> 2)
          const scoreMatch = selectedOption.label.match(/\((\d+)\)/);

          console.log(scoreMatch)
          if (scoreMatch) {
             count++
            this.totalScore += parseInt(scoreMatch[1], 10);
          }
        }
      }

    });
    // this.totalScore= this.totalScore/count
    console.log(count,Math.round((this.totalScore / count) * 10),'sk')
    // Calculate percentage (max possible score is 100 if all questions scored 10)
    // this.totalScore = Math.min(Math.round((this.totalScore / count) * 100), 100);
    this.totalScore=Math.round((this.totalScore / count) * 10)
    return this.totalScore
    // Calculate percentage (max possible score is 100 if all questions scored 10)
    // this.totalScore = Math.min(Math.round((this.totalScore / 100) * 100), 100);
  }
 generateRiskResponse() {
  const riskResponse:any = [];
  
  this.stressScoreOptions.forEach((question: any) => {
    const control = this.assessmentForm.get(`stressScore_${question.id}`);
    if (control?.value) {
      const selectedOption = question.options.find((opt: any) => opt.label === control.value);
      if (selectedOption) {
        // Remove the score part from the label (e.g., "Mild delay(2)" -> "Mild delay")
        const labelWithoutScore = selectedOption.label.replace(/\(\d+\)/, '').trim();
        
        riskResponse.push({
          issue: question.issue,
          riskCategorisation: labelWithoutScore
        });
      }
    }
  });

  return riskResponse;
}
onSubmit() {
   if (this.assessmentForm.valid) {
       const modal = new bootstrap.Modal(this.approvedModal.nativeElement, {
        backdrop: false // Disable default backdrop
      });
      modal.show();
   }
   else{
       this.markFormGroupTouched(this.assessmentForm);
   }
}
  // Submit the form
  Approved() {
  
    console.log(this.assessmentForm?.value,this.applicationData)
     if (this.assessmentForm.valid) {
        const riskAssessment = this.generateRiskResponse();
    const totalScore=this.calculateScore1()
  console.log(riskAssessment)
  

// Remove all stressScore controls from the form
      for (let i = 1; i <= 10; i++) {
        this.assessmentForm.removeControl(`stressScore_${i}`);
}

  // If you want to remove a control named 'stressScore' from the form, use:
    
     const creditFacilityDetails: any = this.assessmentForm.get('creditFacilityDetails')?.value? this.assessmentForm.get('creditFacilityDetails')?.value : [];
    this.calculateScore();
      // Calculate final score
     
      
      // Prepare data for submission
      const formData = {
        ...this.assessmentForm.value,
        riskCategoryScore:totalScore,
        riskCategories:riskAssessment,
        applicationStatus: "PRELIMINARY_ASSESSMENT",
        executive:this.loginsessionDetails?.firstName+this.loginsessionDetails?.lastName
        

      };
      this.assessmentForm.removeControl('stressScore');
     this._commonService.add(APIS.tihclExecutive.submitPrimilinary+ this.applicationData?.applicationNo, formData).subscribe({
      next: (response) => {
        console.log()
         this.progressBarStatusUpdate.emit({"update":true})

      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      // Reset form if needed
      // this.assessmentForm.reset();
    } else {
      // Mark all fields as touched to show validation messages
      this.markFormGroupTouched(this.assessmentForm);
    }
  }

   onUpdate() {
  
  
    console.log(this.assessmentForm?.value,this.applicationData)
     if (this.assessmentForm.valid) {
        const riskAssessment = this.generateRiskResponse();
    const totalScore=this.calculateScore1()
  console.log(riskAssessment)
  

// Remove all stressScore controls from the form
      for (let i = 1; i <= 10; i++) {
        this.assessmentForm.removeControl(`stressScore_${i}`);
}

  // If you want to remove a control named 'stressScore' from the form, use:
    
     const creditFacilityDetails: any = this.assessmentForm.get('creditFacilityDetails')?.value? this.assessmentForm.get('creditFacilityDetails')?.value : [];
    this.calculateScore();
      // Calculate final score
     
      
      // Prepare data for submission
      const formData = {
        ...this.assessmentForm.value,
        riskCategoryScore:totalScore,
        riskCategories:riskAssessment,
        applicationStatus: Object.keys(this.getApplicationData).length ?this.getApplicationData?.applicationStatus:"PRELIMINARY_ASSESSMENT",
        executive:this.loginsessionDetails?.firstName+this.loginsessionDetails?.lastName
        

      };
      this.assessmentForm.removeControl('stressScore');
     this._commonService.add(APIS.tihclExecutive.submitPrimilinary+ this.applicationData?.applicationNo, formData).subscribe({
      next: (response) => {
        console.log()
         this.progressBarStatusUpdate.emit({"update":true})

      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      // Reset form if needed
      // this.assessmentForm.reset();
    } else {
      // Mark all fields as touched to show validation messages
      this.markFormGroupTouched(this.assessmentForm);
    }
  }
  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

updateby:any
openEachModal(item:any){
  this.updateby = item;
   Object.keys(this.updateFormFields.controls).forEach(key => {
      const control = this.updateFormFields.get(key);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
   if(item === 'factoryLocation'){
    this.updateFormFields.get('district')?.setValidators(Validators.required)
     this.updateFormFields.get('mandal')?.setValidators(Validators.required)
      this.updateFormFields.get('mandal')?.setValidators(Validators.required)
    this.GetMandalByDistrict(this.assessmentForm.get('district')?.value);
      const modal = new bootstrap.Modal(this.UpdateLoanModal.nativeElement, {
      backdrop: false // Disable default backdrop
    });
    modal.show()
     this.updateFormFields.patchValue({
      district: this.assessmentForm.get('district')?.value,
      mandal: this.assessmentForm.get('mandal')?.value,
      address: this.assessmentForm.get('address')?.value
    });
   }
   else if(item === 'existingCredit'){
    this.updateFormFields.get('existingCredit')?.setValidators(Validators.required)
    this.updateFormFields.get('existingCredit')?.patchValue(this.assessmentForm.get('existingCredit')?.value || false);
      const modal = new bootstrap.Modal(this.UpdateLoanModal.nativeElement, {
     backdrop: false // Disable default backdrop
    });
      modal.show()
   }
  else{
    if(item=='udyamRegNumber'){
       this.updateFormFields.get('udyamRegNumber')?.setValidators([Validators.required, this.udyamRegNumberValidator])
    }
    else if(item=='enterpriseName'){
       this.updateFormFields.get(item)?.setValidators([Validators.required,Validators.minLength(3)])
    }
    else{
       this.updateFormFields.get(item)?.setValidators([Validators.required])
    }
    
     
    const modal = new bootstrap.Modal(this.UpdateLoanModal.nativeElement, {
  backdrop: false // Disable default backdrop
});
modal.show()
  }

   this.updateFormFields.patchValue({
    [item]: this.assessmentForm.get(item)?.value
  });
   Object.keys(this.updateFormFields.controls).forEach(key => {
      const control = this.updateFormFields.get(key);
      control?.updateValueAndValidity();
    });

}

  updateForm(){
    this.assessmentForm.patchValue({
      [this.updateby]: this.updateFormFields.get(this.updateby)?.value
    });
    if(this.updateby === 'factoryLocation'){
       this.assessmentForm.patchValue({
      district: this.updateFormFields.get('district')?.value,
      mandal: this.updateFormFields.get('mandal')?.value,
      address: this.updateFormFields.get('address')?.value
    });
    }
       const editSessionModal = document.getElementById('UpdateLoanModal');
    if (editSessionModal) {
      const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
      modalInstance.hide();
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
    if(this.updateby=='existingCredit' && !this.assessmentForm.get('existingCredit')?.value){
       this.assessmentForm.get('creditFacilityDetails')?.patchValue(this.fb.array([]));
    }
  }
  confirmationdata:any=[]
  confirmation(val:any){
    this.confirmationdata.push(val)
  }
}
