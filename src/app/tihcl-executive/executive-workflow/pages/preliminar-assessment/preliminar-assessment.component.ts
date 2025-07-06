import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  // Loans table data
  loansData: any[] = [
    {
      bankName: 'ICICI Bank',
      limitSanctioned: 200000,
      outstandingAmount: 100000,
      overdueAmount: 50000,
      overdueSince: '2025-05-09'
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
      { value: 1, label: "Temporarily(2)" },
      { value: 2, label: "Frequently(6)" },
      { value: 3, label: "Permanently(10)" },
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
      { value: 1, label: "Occasionally(3)" },
      { value: 2, label: "Frequently(7)" },
      { value: 3, label: "Chronic(10)" },
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
      { value: 1, label: "Minor diversion(3)" },
      { value: 2, label: "Significant diversion(7)" },
      { value: 3, label: "Severe diversion(10)" },
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
      { value: 1, label: "Slight increase(3)" },
      { value: 2, label: "Moderate increase(6)" },
      { value: 3, label: "Severe increase(10)" },
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
      { value: 1, label: "SMA 2(5)" },
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
      { value: 1, label: "Minor expansion issues(3)" },
      { value: 2, label: "Significant expansion issues(7)" },
      { value: 3, label: "Severe expansion issues(10)" },
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
      { value: 1, label: "Moderate leverage(4)" },
      { value: 2, label: "High leverage(7)" },
      { value: 3, label: "Extreme leverage(10)" },
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
      { value: 1, label: "Tight liquidity(4)" },
      { value: 2, label: "Severe liquidity crunch(7)" },
      { value: 3, label: "Critical liquidity(10)" },
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
      overdueSince: [, Validators.required]
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
      overdueSince: [item.overdueSince, Validators.required]
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
  constructor(private fb: FormBuilder,private toastrService: ToastrService,
        private _commonService: CommonServiceService,) {
           this.initializeForm();
           this.createCreditDetail()
           this.getAllDistricts()
          const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
          this.applicationData=applicationData
          this.getDtataByUrl(APIS.tihclExecutive.registerData + applicationData.registrationUsageId);
   
  }

  getDtataByUrl(url: string) {
    this._commonService.getDataByUrl(url).subscribe({
      next: (dataList: any) => {
         this.assessmentForm.patchValue(dataList.data);
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
        enterpriseName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/),Validators.minLength(3)]],
       udyamRegNumber: ['', [Validators.required, this.udyamRegNumberValidator]],
      enterpriseCategory: ['Micro', Validators.required],
      natureOfActivity: ['Manufacturing', Validators.required],
      
      // Factory location
      district: ['Ranga Reddy', Validators.required],
      mandal: ['Shadnagar', Validators.required],
      existingCredit:[''],
      address: ['Sr.No. 528, Elikatta Industrial Area, Shadnagar, Telangana 509410', Validators.required],
    } );
    this.assessmentForm = this.fb.group({
      // Basic information
      enterpriseName: ['ABC Pvt Ltd', Validators.required],
      udyamRegNumber: ['URN00918288', Validators.required],
      enterpriseCategory: ['Micro', Validators.required],
      natureOfActivity: ['Manufacturing', Validators.required],
      
      // Factory location
      district: ['Ranga Reddy', Validators.required],
      mandal: ['Shadnagar', Validators.required],
      address: ['Sr.No. 528, Elikatta Industrial Area, Shadnagar, Telangana 509410', Validators.required],
      creditFacilityDetails: this.fb.array([]),
      // Credit facilities
      existingCredit: ['', Validators.required],
      
      // Additional details
      gstNumber: ['', Validators.required],
      typeOfProduct: ['', Validators.required],
      productUsage: ['', Validators.required],
      
      // Problems and solutions
      problemsFaced: [''],
      expectedSolution: [''],
      
      // Stress scores (dynamically added)
      
      // Observations and status
      observations: [''],
      statusUpdate: ['', Validators.required],
    });

    // Initialize stress score controls
    this.stressScoreOptions.forEach((question:any) => {
      this.assessmentForm.addControl(`stressScore_${question.id}`, this.fb.control('', Validators.required));
    });
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
    this.stressScoreOptions.forEach((question:any) => {
      const control = this.assessmentForm.get(`stressScore_${question.id}`);
      if (control?.value ) { // Skip "Not Applicable" options
        const selectedOption = question.options.find((opt:any) => opt.label === control.value);
        if (selectedOption) {
          // Extract score from label (e.g., "Mild delay(2)" -> 2)
          const scoreMatch = selectedOption.label.match(/\((\d+)\)/);
          console.log(scoreMatch)
          if (scoreMatch) {
            this.totalScore += parseInt(scoreMatch[1], 10);
          }
        }
      }
    });
    // Calculate percentage (max possible score is 100 if all questions scored 10)
    // this.totalScore = Math.min(Math.round((this.totalScore / 100) * 100), 100);
  }
   calculateScore1() {
    this.totalScore = 0;
    this.stressScoreOptions.forEach((question:any) => {
      const control = this.assessmentForm.get(`stressScore_${question.id}`);
      if (control?.value ) { // Skip "Not Applicable" options
        const selectedOption = question.options.find((opt:any) => opt.label === control.value);
        if (selectedOption) {
          // Extract score from label (e.g., "Mild delay(2)" -> 2)
          const scoreMatch = selectedOption.label.match(/\((\d+)\)/);
          console.log(scoreMatch)
          if (scoreMatch) {
            this.totalScore += parseInt(scoreMatch[1], 10);
          }
        }
      }
    });
    
    console.log(this.totalScore)
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
  // Submit the form
  onSubmit() {
  
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
    console.log(this.assessmentForm?.value)
     if (this.assessmentForm.valid) {
      // Calculate final score
     
      
      // Prepare data for submission
      const formData = {
        ...this.assessmentForm.value,
        riskCategoryScore:totalScore,
        riskCategories:riskAssessment,
        applicationStatus: "PRELIMINARY_ASSESSMENT"
        

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

   if(item === 'factoryLocation'){
    
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
    this.updateFormFields.get('existingCredit')?.patchValue(this.assessmentForm.get('existingCredit')?.value || false);
      const modal = new bootstrap.Modal(this.UpdateLoanModal.nativeElement, {
     backdrop: false // Disable default backdrop
    });
modal.show()
   }
  else{
    const modal = new bootstrap.Modal(this.UpdateLoanModal.nativeElement, {
  backdrop: false // Disable default backdrop
});
modal.show()
  }
   this.updateFormFields.patchValue({
    [item]: this.assessmentForm.get(item)?.value
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
