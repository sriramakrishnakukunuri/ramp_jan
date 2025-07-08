import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
declare var $: any;
@Component({
  selector: 'app-loan-appilication-new',
  templateUrl: './loan-appilication-new.component.html',
  styleUrls: ['./loan-appilication-new.component.css']
})
export class LoanAppilicationNewComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal!: ElementRef;
   @ViewChild('addDelivery') addDelivery!: ElementRef;
  applicationForm: FormGroup;
  creditDetailsForm!: FormGroup;
  showApplicationMenu = false;
  operationStatus: boolean | null = null;
  existingStatus: boolean | null = null;
  investmentBorrower: boolean | null = null;
  currentStep = 1;
  today: any;
  enterPrenuerResponseData: any;
  constructor(private fb: FormBuilder, private toastrService: ToastrService,private authenticationService: AuthenticationService,
    private _commonService: CommonServiceService, private router: Router,) {
        
      
   const today = new Date();
  today.setDate(today.getDate() - 1);
  this.today = today.toISOString().split('T')[0];

    this.applicationForm = this.fb.group({
      // Step 1 - Registration
      enterpriseName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/),Validators.minLength(3)]],
      promoterName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+(.))*$/),Validators.minLength(3)]],
      constitution: ['', Validators.required],
      productionDate: ['', Validators.required],
       udyamRegNumber: ['', [Validators.required, this.udyamRegNumberValidator]],
      altContactNumber: ['', [Validators.pattern(/^[6789]\d{9}$/)]],
      state: ['', Validators.required],
      industrialPark: ['', Validators.required],
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      email: ['', [Validators.email]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      // Step 2 - Application
      enterpriseCategory: ['', ],
      natureOfActivity: ['', ],
      sector: ['', ],
      operationStatus: [false],
      operatingSatisfactorily: [''],
      operatingDifficulties: [''],
      issueDate: [''],
      reasonForNotOperating: [''],
      restartIntent: [false],
      restartSupport: [''],
      existingCredit: [false],
      creditFacilityDetails: this.fb.array([]),
      unitStatus: [''],
      requiredCreditLimit: [0,],
      investmentSubsidy: [false],
      totalAmountSanctioned: [0],
      amountReleased: [0],
      amountToBeReleased: [0],
      maintainingAccountBy: ['', ],
      helpMsg: [''],
      contactNumber: [''],
      
      // Step 3 - Status (display only, no form controls needed)
    });
    this.createCreditDetail()
    const enterpreneur = JSON.parse(sessionStorage.getItem('enterpreneur') || '{}');
      if(enterpreneur && Object.keys(enterpreneur).length > 0){
        this.enterPrenuerResponseData = enterpreneur;
        this.applicationForm.patchValue({
          enterpriseName: enterpreneur.enterpriseName || '',
          promoterName: enterpreneur.promoterName || '',
          constitution: enterpreneur.constitution || '',
          productionDate: enterpreneur.productionDate || '',
          udyamRegNumber: enterpreneur.udyamRegNumber || '',
          altContactNumber: enterpreneur.altContactNumber || '', 
          state: enterpreneur.state || '',
          industrialPark: enterpreneur.industrialPark || '',
          district: enterpreneur.district || '',
          mandal: enterpreneur.mandal || '',
          email: enterpreneur.email || '',
          address: enterpreneur.address || '',
          enterpriseCategory: enterpreneur.enterpriseCategory || '',
          natureOfActivity: enterpreneur.natureOfActivity || '',
          sector: enterpreneur.sector || '',
          operationStatus: enterpreneur.operationStatus || false,
          operatingSatisfactorily: enterpreneur.operatingSatisfactorily || '',
          operatingDifficulties: enterpreneur.operatingDifficulties || '',  
          issueDate: enterpreneur.issueDate || '',
          reasonForNotOperating: enterpreneur.reasonForNotOperating || '',
          restartIntent: enterpreneur.restartIntent || false,
          restartSupport: enterpreneur.restartSupport || '',
          existingCredit: enterpreneur.existingCredit || false,
          unitStatus: enterpreneur.unitStatus || '',
          contactNumber: enterpreneur.contactNumber || '',
          requiredCreditLimit: enterpreneur.requiredCreditLimit || 0,
          investmentSubsidy: enterpreneur.investmentSubsidy || false,
          totalAmountSanctioned: enterpreneur.totalAmountSanctioned || 0,
          amountReleased: enterpreneur.amountReleased || 0,
          amountToBeReleased: enterpreneur.amountToBeReleased || 0,
          maintainingAccountBy: enterpreneur.maintainingAccountBy || '',
          helpMsg: enterpreneur.helpMsg || ''
        });
        if(enterpreneur?.status=='Assessment Completed'){
          this.currentStep = 3; // Set to step 3 if status is 'Assessment Completed'
        }
        else{
          this.currentStep = 1
        }
         // Set to step 2 if enterpreneur data is  
      }
      else{
        this.currentStep = 1; // Default to step 1 if no enterpreneur data is available
      }
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

  ngOnInit(): void {
   
    this.getAllDistricts()
    this.addFormControlListeners();
  }
  ChangeDistrict(event:any){
    if(event=='others'){
      const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
      modal.show();  
    }
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
    this.applicationForm.get('mandal')?.reset();

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
  // GetMandalByDistrict(event: any) {
  //   this.applicationForm.get('mandal')?.reset();

  //   this.MandalList=[]
  //   this._commonService.getDataByUrl(APIS.tihclMasterList.getMandal + event).subscribe({
  //     next: (data: any) => {
  //       this.MandalList = data.data;
  //     },
  //     error: (err: any) => {
  //       this.MandalList = [];
  //     }
  //   })

  // }
  // createCreditDetail(): FormGroup {

  //   return this.fb.group({
  //     bankName: [''],
  //     natureOfLoan: [''],
  //     limitSanctioned: [''],
  //     outstandingAmount: [''],
  //     overdueAmount: [''],
  //     overdueSince: ['']
  //   });
  // }
  get fCredit() {
    return this.creditDetailsForm.controls;
  }
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
    const deliveryDetailsArray = this.applicationForm.get('creditFacilityDetails') as FormArray;
    // Push the new form group
    deliveryDetailsArray.push(this.fb.group(this.creditDetailsForm.value));

    this.creditDetailsForm.reset();
      const modal = new bootstrap.Modal(this.addDelivery.nativeElement);
      modal.hide(); 
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
      const deliveryDetailsArray = this.applicationForm.get('creditFacilityDetails') as FormArray;
      const index = deliveryDetailsArray.controls.findIndex(control => control.value === item);
      if (index !== -1) {
        deliveryDetailsArray.removeAt(index);
      }
       const modal = new bootstrap.Modal(this.addDelivery.nativeElement);
      modal.show(); 
  }

  deleteCreditDetail(index: number) {
    const deliveryDetailsArray = this.applicationForm.get('creditFacilityDetails') as FormArray;
    deliveryDetailsArray.removeAt(index);
  }

  get creditDetails(): FormArray {
    return this.applicationForm.get('creditFacilityDetails') as FormArray;
  }

  addCreditDetail(): void {
    this.createCreditDetail();
    const modal = new bootstrap.Modal(this.addDelivery.nativeElement);
    modal.show();
  }

  removeCreditDetail(index: number): void {
    this.creditDetails.removeAt(index);
  }

  operationalChange(value: string): void {
    this.operationStatus = value === 'YES';
    if (this.operationStatus) {
      this.applicationForm.get('operatingSatisfactorily')?.reset();
      this.applicationForm.get('operatingDifficulties')?.reset();
       this.applicationForm.get('issueDate')?.setValidators(null);
      this.applicationForm.get('reasonForNotOperating')?.setValidators(null);
      this.applicationForm.get('restartIntent')?.setValidators(null);
      this.applicationForm.get('restartSupport')?.setValidators(null);
      this.applicationForm.get('issueDate')?.reset();
      this.applicationForm.get('reasonForNotOperating')?.reset();
      this.applicationForm.get('restartIntent')?.patchValue(false);
      this.applicationForm.get('restartSupport')?.reset();
       this.applicationForm.get('operatingSatisfactorily')?.patchValue(false);
      this.applicationForm.get('operatingSatisfactorily')?.setValidators([Validators.required]);
      this.applicationForm.get('operatingDifficulties')?.setValidators([Validators.required]);
       this.applicationForm.updateValueAndValidity();
    } else {
      this.applicationForm.get('operatingSatisfactorily')?.patchValue(false);
      this.applicationForm.get('operatingSatisfactorily')?.setValidators(null);
      this.applicationForm.get('operatingDifficulties')?.setValidators(null);
      this.applicationForm.get('issueDate')?.setValidators([Validators.required]);
      this.applicationForm.get('reasonForNotOperating')?.setValidators([Validators.required]);
      this.applicationForm.get('restartIntent')?.setValidators([Validators.required]);
      this.applicationForm.get('restartSupport')?.setValidators([Validators.required]);
      this.applicationForm.get('issueDate')?.reset();
      this.applicationForm.get('reasonForNotOperating')?.reset();
      this.applicationForm.get('restartIntent')?.patchValue(false);
      this.applicationForm.get('restartSupport')?.reset();
      this.applicationForm.updateValueAndValidity();
    }
    this.applicationForm.get('operatingSatisfactorily')?.updateValueAndValidity()
    this.applicationForm.get('restartIntent')?.updateValueAndValidity()
    this.applicationForm.get('restartSupport')?.updateValueAndValidity()
    this.applicationForm.get('operatingDifficulties')?.updateValueAndValidity()
    this.applicationForm.get('issueDate')?.updateValueAndValidity()
    this.applicationForm.get('reasonForNotOperating')?.updateValueAndValidity()
  }
  operatingSatisfactorilyChange(value: string): void{
    // this.operatingSatisfactorily = value === 'YES';
    if(value=='YES'){
       this.applicationForm.get('operatingDifficulties')?.setValidators(null);
       this.applicationForm.get('operatingDifficulties')?.patchValue([]);
       this.applicationForm.get('operatingDifficulties')?.updateValueAndValidity();
    }
    else{
       this.applicationForm.get('operatingDifficulties')?.setValidators([Validators.required]);
       this.applicationForm.get('operatingDifficulties')?.patchValue([]);
       this.applicationForm.get('operatingDifficulties')?.updateValueAndValidity();
    }

  }

  existingChange(value: string): void {
    this.existingStatus = value === 'YES';
    if (!this.existingStatus) {
      // this.applicationForm.get('requiredCreditLimit')?.reset();
        this.applicationForm.get('requiredCreditLimit')?.setValidators([Validators.required]);
        this.applicationForm.get('unitStatus')?.setValidators(null);
    } else {
      // this.creditDetails.clear();
      this.creditDetailsForm.reset();
      this.applicationForm.get('requiredCreditLimit')?.setValidators(null);
      this.applicationForm.get('creditFacilityDetails')?.patchValue(this.fb.array([]));
      // this.applicationForm.get('unitStatus')?.reset();
       this.applicationForm.get('unitStatus')?.setValidators([Validators.required]);
    }
    this.applicationForm.get('creditFacilityDetails')?.updateValueAndValidity()
this.applicationForm.get('unitStatus')?.updateValueAndValidity()
this.applicationForm.get('requiredCreditLimit')?.updateValueAndValidity()

    this.applicationForm?.updateValueAndValidity();
  }

  investmentChange(value: string): void {
    this.investmentBorrower = value === 'YES';
    if (!this.investmentBorrower) {
      this.applicationForm.get('totalAmountSanctioned')?.reset();
      this.applicationForm.get('amountReleased')?.reset();
      this.applicationForm.get('amountToBeReleased')?.reset();
     this.applicationForm.get('totalAmountSanctioned')?.setValidators(null);
      this.applicationForm.get('amountReleased')?.setValidators(null);
      this.applicationForm.get('amountToBeReleased')?.setValidators(null);
    }
    else{
      this.applicationForm.get('totalAmountSanctioned')?.reset();
      this.applicationForm.get('amountReleased')?.reset();
      this.applicationForm.get('amountToBeReleased')?.reset();
    
         this.applicationForm.get('totalAmountSanctioned')?.setValidators([Validators.required]);
      this.applicationForm.get('amountReleased')?.setValidators([Validators.required]);
      this.applicationForm.get('amountToBeReleased')?.setValidators([Validators.required]);
    }
    this.applicationForm.get('totalAmountSanctioned')?.updateValueAndValidity()
this.applicationForm.get('amountReleased')?.updateValueAndValidity()
this.applicationForm.get('amountToBeReleased')?.updateValueAndValidity()

  }

  addFormControlListeners(): void {
    // Add any additional form control listeners if needed
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    if(this.currentStep==2){
  this.applicationForm.get('enterpriseCategory')?.setValidators([Validators.required]);
this.applicationForm.get('natureOfActivity')?.setValidators([Validators.required]);
this.applicationForm.get('sector')?.setValidators([Validators.required]);
this.applicationForm.get('operationStatus')?.setValidators([Validators.required]);
this.applicationForm.get('issueDate')?.setValidators([Validators.required]);
this.applicationForm.get('reasonForNotOperating')?.setValidators([Validators.required]);
this.applicationForm.get('restartIntent')?.setValidators([Validators.required]);
this.applicationForm.get('restartSupport')?.setValidators([Validators.required]);
this.applicationForm.get('existingCredit')?.setValidators([Validators.required]);
// this.applicationForm.get('unitStatus')?.setValidators([Validators.required]);
this.applicationForm.get('requiredCreditLimit')?.setValidators([Validators.required]);
this.applicationForm.get('investmentSubsidy')?.patchValue(false);
this.applicationForm.get('investmentSubsidy')?.setValidators([Validators.required]);
this.applicationForm.get('maintainingAccountBy')?.setValidators([Validators.required]);
this.applicationForm.get('helpMsg')?.setValidators(null);
this.applicationForm.get('enterpriseName')?.setValidators(null);
this.applicationForm.get('promoterName')?.setValidators(null);
this.applicationForm.get('constitution')?.setValidators(null);
this.applicationForm.get('productionDate')?.setValidators(null);
this.applicationForm.get('udyamRegNumber')?.setValidators(null);
this.applicationForm.get('altContactNumber')?.setValidators(null);
this.applicationForm.get('state')?.setValidators(null);
this.applicationForm.get('industrialPark')?.setValidators(null);
this.applicationForm.get('district')?.setValidators(null);
this.applicationForm.get('mandal')?.setValidators(null);
this.applicationForm.get('email')?.setValidators(null);
this.applicationForm.get('address')?.setValidators(null);
this.applicationForm.get('operatingDifficulties')?.setValidators(null);
      this.operationalChange('NO');
      this.existingChange('NO');
      this.investmentChange('NO');
this.applicationForm.get('enterpriseCategory')?.updateValueAndValidity()
this.applicationForm.get('natureOfActivity')?.updateValueAndValidity()
this.applicationForm.get('sector')?.updateValueAndValidity()
this.applicationForm.get('operationStatus')?.updateValueAndValidity()
this.applicationForm.get('issueDate')?.updateValueAndValidity()
this.applicationForm.get('reasonForNotOperating')?.updateValueAndValidity()
this.applicationForm.get('restartIntent')?.updateValueAndValidity()
this.applicationForm.get('restartSupport')?.updateValueAndValidity()
this.applicationForm.get('existingCredit')?.updateValueAndValidity()
// this.applicationForm.get('unitStatus')?.updateValueAndValidity()]);
this.applicationForm.get('requiredCreditLimit')?.updateValueAndValidity()
this.applicationForm.get('investmentSubsidy')?.patchValue(false);
this.applicationForm.get('investmentSubsidy')?.updateValueAndValidity()
this.applicationForm.get('maintainingAccountBy')?.updateValueAndValidity()
this.applicationForm.get('helpMsg')?.updateValueAndValidity()
this.applicationForm.get('enterpriseName')?.updateValueAndValidity()
this.applicationForm.get('promoterName')?.updateValueAndValidity()
this.applicationForm.get('constitution')?.updateValueAndValidity()
this.applicationForm.get('productionDate')?.updateValueAndValidity()
this.applicationForm.get('udyamRegNumber')?.updateValueAndValidity()
this.applicationForm.get('altContactNumber')?.updateValueAndValidity()
this.applicationForm.get('state')?.updateValueAndValidity()
this.applicationForm.get('industrialPark')?.updateValueAndValidity()
this.applicationForm.get('district')?.updateValueAndValidity()
this.applicationForm.get('mandal')?.updateValueAndValidity()
this.applicationForm.get('email')?.updateValueAndValidity()
this.applicationForm.get('address')?.updateValueAndValidity()
this.applicationForm.get('operatingDifficulties')?.updateValueAndValidity()
// Update validity for all controls
this.applicationForm.updateValueAndValidity();
console.log(this.applicationForm.value);
    }

  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
      if(this.currentStep==1){
      this.applicationForm.get('enterpriseName')?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/),Validators.minLength(3)]);
      this.applicationForm.get('promoterName')?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/), Validators.minLength(3)]);
      this.applicationForm.get('constitution')?.setValidators([Validators.required]);
      this.applicationForm.get('productionDate')?.setValidators([Validators.required]);
      this.applicationForm.get('udyamRegNumber')?.setValidators([Validators.required, this.udyamRegNumberValidator]);
      this.applicationForm.get('altContactNumber')?.setValidators([Validators.pattern(/^[6789]\d{9}$/)]);
      this.applicationForm.get('state')?.setValidators([Validators.required]);
      this.applicationForm.get('industrialPark')?.setValidators([Validators.required]);
      this.applicationForm.get('district')?.setValidators([Validators.required]);
      this.applicationForm.get('mandal')?.setValidators([Validators.required]);
      this.applicationForm.get('email')?.setValidators([Validators.email]);
      this.applicationForm.get('address')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.applicationForm.get('operatingDifficulties')?.setValidators([Validators.required]);
      
  this.applicationForm.get('enterpriseCategory')?.setValidators(null)
this.applicationForm.get('natureOfActivity')?.setValidators(null)
this.applicationForm.get('sector')?.setValidators(null)
this.applicationForm.get('operationStatus')?.setValidators(null)
this.applicationForm.get('operatingSatisfactorily')?.setValidators(null)
this.applicationForm.get('operatingDifficulties')?.setValidators(null)
this.applicationForm.get('issueDate')?.setValidators(null)
this.applicationForm.get('reasonForNotOperating')?.setValidators(null)
this.applicationForm.get('restartIntent')?.setValidators(null)
this.applicationForm.get('restartSupport')?.setValidators(null)
this.applicationForm.get('existingCredit')?.setValidators(null)
this.applicationForm.get('unitStatus')?.setValidators(null)
this.applicationForm.get('requiredCreditLimit')?.setValidators(null)
this.applicationForm.get('investmentSubsidy')?.setValidators(null)
this.applicationForm.get('totalAmountSanctioned')?.setValidators(null)
this.applicationForm.get('amountReleased')?.setValidators(null)
this.applicationForm.get('amountToBeReleased')?.setValidators(null)
this.applicationForm.get('maintainingAccountBy')?.setValidators(null)
this.applicationForm.get('helpMsg')?.setValidators(null)
this.applicationForm.updateValueAndValidity();
this.applicationForm.get('enterpriseCategory')?.updateValueAndValidity()
this.applicationForm.get('natureOfActivity')?.updateValueAndValidity()
this.applicationForm.get('sector')?.updateValueAndValidity()
this.applicationForm.get('operationStatus')?.updateValueAndValidity()
this.applicationForm.get('issueDate')?.updateValueAndValidity()
this.applicationForm.get('reasonForNotOperating')?.updateValueAndValidity()
this.applicationForm.get('restartIntent')?.updateValueAndValidity()
this.applicationForm.get('restartSupport')?.updateValueAndValidity()
this.applicationForm.get('existingCredit')?.updateValueAndValidity()
// this.applicationForm.get('unitStatus')?.updateValueAndValidity()]);
this.applicationForm.get('requiredCreditLimit')?.updateValueAndValidity()
this.applicationForm.get('investmentSubsidy')?.patchValue(false);
this.applicationForm.get('investmentSubsidy')?.updateValueAndValidity()
this.applicationForm.get('maintainingAccountBy')?.updateValueAndValidity()
this.applicationForm.get('helpMsg')?.updateValueAndValidity()
this.applicationForm.get('enterpriseName')?.updateValueAndValidity()
this.applicationForm.get('promoterName')?.updateValueAndValidity()
this.applicationForm.get('constitution')?.updateValueAndValidity()
this.applicationForm.get('productionDate')?.updateValueAndValidity()
this.applicationForm.get('udyamRegNumber')?.updateValueAndValidity()
this.applicationForm.get('altContactNumber')?.updateValueAndValidity()
this.applicationForm.get('state')?.updateValueAndValidity()
this.applicationForm.get('industrialPark')?.updateValueAndValidity()
this.applicationForm.get('district')?.updateValueAndValidity()
this.applicationForm.get('mandal')?.updateValueAndValidity()
this.applicationForm.get('email')?.updateValueAndValidity()
this.applicationForm.get('address')?.updateValueAndValidity()
this.applicationForm.get('operatingDifficulties')?.updateValueAndValidity()
      
      }
  }

  submitForm(): void {
    const creditFacilityDetails: any = this.applicationForm.get('creditFacilityDetails')?.value? this.applicationForm.get('creditFacilityDetails')?.value : [];
    this._commonService.add(APIS.tihclEnterprenuer.submitLoanApplication, {...this.applicationForm.value,creditFacilityDetails:creditFacilityDetails,status: "Assessment Completed"}).subscribe({
      next: (response) => {
        if(response.status === 200) {
           this.enterPrenuerResponseData = response.data;
           sessionStorage.setItem('enterpreneur', JSON.stringify(this.enterPrenuerResponseData));
          this.applicationForm.reset();
          this.toastrService.success('Application Form submitted successfully');
        } else {
          this.toastrService.error('Application Form submission failed');
        }
        this.nextStep(); // Move to status step after submission
      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
    console.log(this.applicationForm.value);
    if (this.applicationForm.valid) {
      console.log('Form submitted:', this.applicationForm.value);
      this.nextStep(); // Move to status step after submission
    } else {
      this.markFormGroupTouched(this.applicationForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  logout(): void {
    this.authenticationService.logout();
    // Implement logout logic
  }

   checkValidate(value: string): void {
    if (value === 'yes') {
      const modal = bootstrap.Modal.getInstance(this.exampleModal.nativeElement);
      modal.hide();      
      this.router.navigate(['/login']);
    } else {
      const modal = bootstrap.Modal.getInstance(this.exampleModal.nativeElement);
      modal.hide();
    }
  }
  ChangeAmount(amountRelease:any,total:any){
    if(amountRelease && total){

      this.applicationForm.get('amountToBeReleased')?.patchValue(Number(total)-Number(amountRelease))
    }
    else if(total){
         this.applicationForm.get('amountToBeReleased')?.patchValue(total)
    }
    else{
      this.applicationForm.get('amountToBeReleased')?.patchValue(total)
    }
  }
  
}