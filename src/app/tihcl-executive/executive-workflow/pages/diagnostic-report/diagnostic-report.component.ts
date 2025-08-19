 // diagnostic-report.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
// import { DiagnosticReportService } from './diagnostic-report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { observable } from 'rxjs';

@Component({
  selector: 'app-diagnostic-report',
  templateUrl: './diagnostic-report.component.html',
  styleUrls: ['./diagnostic-report.component.css']
})
export class DiagnosticReportComponent implements OnInit {
  diagnosticForm!: FormGroup;
  @Output() progressBarStatusUpdate:any = new EventEmitter();
  shareholderForm!: FormGroup;
  @Input() freeze:any
  showBuyerModal = false;
  showSupplierModal = false;
    buyerForm!: FormGroup;
  supplierForm!: FormGroup;
  currentTab = 'BASIC_DETAILS';
  reportId!: number;
  isLoading = false;
  saveSuccess = {
    basic: false,
    buyers: false,
    suppliers: false,
    receivables: false,
    payables: false,
    operational: false,
    stress: false,
    balancesheet: false,
    status: false
    // BASIC_DETAILS,
    // TOP_5_BUYERS,
    // RECEIVABLES_PAYABLES,
    // OPERATIONAL_STATUS,
    // REASONS_FOR_STRESS,
    // BALANCE_SHEET,
    // STATUS_UPDATE;
  };
  today: any=this._commonService.getDate()
loginsessionDetails:any
applicationData:any
  constructor(
    private fb: FormBuilder,
    private _commonService: CommonServiceService,
    private route: ActivatedRoute
  ) { 
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
          console.log(this.loginsessionDetails)
           const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
           this.applicationData=applicationData
            this.loadDiagnosticData();
  }

  ngOnInit(): void {
    this.generateFinancialYears() 
    this.initializeForm();
    this.initShareholderForm()
     this.intiPartanurshipForm()
    this.initBuyerForm();
    this.initSupplierForm();
    this.initReceivableForm()
    this.initPayableForm()
    this.initializebalanceSheetsForm()
    this.operationtableformsInit()
  }
getDtataByUrl(url: string) {
    this._commonService.getDataByUrl(url).subscribe({
      next: (dataList: any) => {
        //  this.assessmentForm.patchValue(dataList.data);
        
         
        // Handle the dataList as needed
      },
      error: (error: any) => {
        
      }
    });
  }
  initializeForm(): void {
    this.diagnosticForm = this.fb.group({
      basicDetails: this.fb.group({
        nameOfUnit: ['', Validators.required],
        constitution: ['', Validators.required],
        contactNo: ['', [Validators.required, Validators.pattern(/^[6789]\d{9}$/)]],
        gstNumber: ['', this.gstValidator()],
        productManufactured: ['', Validators.required],
        demandForTheProduct: ['', Validators.required],
        shareholdersNewDto: this.fb.array([]),
        partnershipDto: this.fb.array([]),
      }),
      topBuyers: this.fb.array([]),
      topSellers: this.fb.array([]),
      receivables: this.fb.array([]),
      payables: this.fb.array([]),
      operationalStatus: this.fb.group({
        skilledCount: [0, Validators.min(0)],
        unskilledCount: [0, Validators.min(0)],
        femaleCount: [0, Validators.min(0)],
        installedCapacity: [0, [Validators.min(0), Validators.max(100)]],
        utilizedCapacity: [0, [Validators.min(0), Validators.max(100)]],
        observation: [''],
        isWorking: [true],
        hasUnsecuredLoans: [false],
        requiredLoanAmount: [0, Validators.min(0)],
        loanSecurityType: [''],
        hasStatutoryDuePending: [false],
        statutoryDetails: [''],
        subsidyType:[''],
        subsidyAmountPending:[''],
        othersType:[''],
        orderBookPositions: this.fb.array([]),
        unsecuredLoans: this.fb.array([])
      }),
      reasonForStress: [''],
      balanceSheets: this.fb.array([]),
      observations: [''],
      approvalStatus: [''],
      urlForDiagnosticFile:['']
      
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
      financialYears:any=[]
    selectedFinancialYear: any = '';
    generateFinancialYears() {
      const currentYear = new Date().getFullYear();
      const fixedYear = 2016; // Fixed year for the first two entries 
      const range = 2; // Show 5 years before and after current year
    
      for (let i = 2016; i < currentYear; i++) {
        const year = i;
        this.financialYears.push(`${year}-${(year + 1)}`);
      }
      for (let i = 0; i <= range; i++) {
        const year = currentYear + i;
        this.financialYears.push(`${year}-${(year + 1)}`);
      }
      
      // Set default selection to current financial year
      this.selectedFinancialYear = this.getCurrentFinancialYear();
      // console.log(this.financialYears, 'financialYears',this.selectedFinancialYear );
    }
     getCurrentFinancialYear(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // January is 0
      
      // Adjust based on your financial year start (April in this example)
      return month >= 4 ? `${year}-${(year + 1)}` : `${year - 1}-${year}`;
    }
  initShareholderForm(): void {
    this.shareholderForm = this.fb.group({
      id:[''],
      nameOfTheShareholder: ['', Validators.required],
      position: ['', [Validators.required]],
      shareholdingPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }
  intiPartanurshipForm(): void {
     this.partnershipForm = this.fb.group({
      id:[''],
      nameOfThePartner: ['', Validators.required],
      position: ['', [Validators.required]],
      profitSharingPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });
   
  }
  // Tab navigation
  switchTab(tab: string): void {
    console.log( this.currentTab)
    this.currentTab = tab;
    console.log( this.currentTab)

  }
  getDataOfDiagnostic:any
  loadDiagnosticData(): void {
    this.isLoading = true;
    this.initializeForm()
    // this.diagnosticForm.reset()
    this._commonService.getById(APIS.tihclExecutive.getDiagnostic,this.applicationData.registrationUsageId? this.applicationData?.registrationUsageId:this.applicationData?.registrationId).subscribe(
      data => {
        console.log(data)
        this.patchFormValues(data?.data[0]);
        this.getDataOfDiagnostic=data?.data[0]

        this.isLoading = false;
      },
      error => {
        console.error('Error loading diagnostic data:', error);
        this.isLoading = false;
      }
    );
  }

  patchFormValues(data: any): void {
    // Basic Details
    this.basicDetails.patchValue({
      nameOfUnit: data?.nameOfUnit,
      constitution: data?.constitution,
      contactNo: data?.contactNo,
      gstNumber: data?.gstNumber,
      productManufactured: data?.productManufactured,
      demandForTheProduct: data?.demandForTheProduct
    });

    // shareholdersNewDto
    data?.shareholdersNewDto.forEach((shareholder:any) => {
      this.addShareholder(shareholder);
    });
     // shareholdersNewDto
    data?.partnershipDto.forEach((partnership:any) => {
      this.addPartnership(partnership);
    });

    // Top Buyers
    data?.topBuyers.forEach((buyer:any) => {
      this.addBuyer(buyer);
    });

    // Top Sellers
    data?.topSellers.forEach((seller:any) => {
      this.addSupplier(seller);
    });

    // Receivables
    data?.receivables.forEach((receivable:any) => {
      this.addReceivable(receivable);
    });

    // Payables
    data?.payables.forEach((payable:any) => {
      this.addPayable(payable);
    });

    // Operational Status
    if (data?.operationalStatus) {
      this.operationalStatus.patchValue({
        skilledCount: data?.operationalStatus.skilledCount,
        unskilledCount: data.operationalStatus.unskilledCount,
        femaleCount: data.operationalStatus.femaleCount,
        installedCapacity: data.operationalStatus.installedCapacity,
        utilizedCapacity: data.operationalStatus.utilizedCapacity,
        observation: data.operationalStatus.observation,
        isWorking: data.operationalStatus.isWorking? data.operationalStatus.isWorking : true,
        hasUnsecuredLoans: data.operationalStatus.hasUnsecuredLoans,
        requiredLoanAmount: data.operationalStatus.requiredLoanAmount,
        loanSecurityType: data.operationalStatus.loanSecurityType,
        hasStatutoryDuePending: data.operationalStatus.hasStatutoryDuePending,
        statutoryDetails: data.operationalStatus?.statutoryDetails,
        subsidyAmountPending:data.operationalStatus?.subsidyAmountPending,
         othersType:data.operationalStatus?.othersType,
        subsidyType:data.operationalStatus?.subsidyType,
      });

      // Order Book Positions
      data?.operationalStatus?.orderBookPositions?.forEach((position:any) => {
        this.addOrderBookPosition(position);
      });
       data?.operationalStatus?.unsecuredLoans?.forEach((position:any) => {
        this.addUnsecuredData(position);
      });
    }

    // Reason for Stress
    this.diagnosticForm.patchValue({
      reasonForStress: data.reasonForStress
    });

    // Balance Sheets
    data.balanceSheets.forEach((sheet:any) => {
      this.addBalanceSheet(sheet);
    });
    this.formateBalnceSheet(data.balanceSheets)

    // Status Update
    this.diagnosticForm.patchValue({
      observations: data.observations,
      approvalStatus: data.approvalStatus,
      urlForDiagnosticFile: data.urlForDiagnosticFile || null
    });
  }
  BalnceShetData:any=[]
formateBalnceSheet(data:any){
  this.BalnceShetData=[]
  this.BalnceShetData=data

}
  // Form getters for easier access
  get basicDetails(): FormGroup {
    return this.diagnosticForm.get('basicDetails') as FormGroup;
  }

  get shareholdersNewDto(): FormArray {
    return this.basicDetails.get('shareholdersNewDto') as FormArray;
  }
  get partnershipDto(): FormArray {
    return this.basicDetails.get('partnershipDto') as FormArray;
  }
  get buyers(): FormArray {
    return this.diagnosticForm.get('topBuyers') as FormArray;
  }

  get suppliers(): FormArray {
    return this.diagnosticForm.get('topSellers') as FormArray;
  }

  get receivables(): FormArray {
    return this.diagnosticForm.get('receivables') as FormArray;
  }

  get payables(): FormArray {
    return this.diagnosticForm.get('payables') as FormArray;
  }

  get operationalStatus(): FormGroup {
    return this.diagnosticForm.get('operationalStatus') as FormGroup;
  }

  get orderBookPositions(): FormArray {
    return this.operationalStatus.get('orderBookPositions') as FormArray;
  }

  get balanceSheets(): FormArray {
    return this.diagnosticForm.get('balanceSheets') as FormArray;
  }




  // Basic Details Ts changes--->starts

   isEditMode = false;
  editIndex: number | null = null;
  showShareholderModal = false;
onConstitutionChange(event:any) {
    console.log(event)
    if (event === 'Partnership') {
      (this.basicDetails.get('shareholdersNewDto') as FormArray).clear();
      (this.basicDetails.get('partnershipDto') as FormArray).clear();
      
    } else if( event === 'Limited company') {
     (this.basicDetails.get('shareholdersNewDto') as FormArray).clear();
     (this.basicDetails.get('partnershipDto') as FormArray).clear();
    }
}
  addShareholder(data?: any): void {
    const shareholderGroup = this.fb.group({
      id: [data?.id || 0],
      nameOfTheShareholder: [data?.nameOfTheShareholder || '', Validators.required],
      // mobileNo: [data?.mobileNo || '', [Validators.required, Validators.pattern(/^[6789]\d{9}$/)]],
      shareholdingPercentage: [data?.shareholdingPercentage || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      position: [data?.position || '', Validators.required],
    });

    this.shareholdersNewDto.push(shareholderGroup);
  }
   openShareholderModal(editIndex: number | null = null): void {
    this.isEditMode = editIndex !== null;
    this.editIndex = editIndex;
    
    if (this.isEditMode && editIndex !== null) {
      const shareholder = this.shareholdersNewDto.at(editIndex);
      this.shareholderForm.patchValue({
        id:shareholder.get('id')?.value,
        nameOfTheShareholder: shareholder.get('nameOfTheShareholder')?.value,
        shareholdingPercentage: shareholder.get('shareholdingPercentage')?.value,
        position: shareholder.get('position')?.value
      });
    } else {
      this.shareholderForm.reset();
    }
    
    this.showShareholderModal = true;
  }

saveShareholder(): void {
  console.log(this.shareholderForm.value,this.basicDetails.value)
    if (this.shareholderForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.shareholdersNewDto.at(this.editIndex).patchValue(this.shareholderForm.value);
    } else {
      this.shareholdersNewDto.push(this.fb.group(this.shareholderForm.value));
    }

    this.closeModal();
  }

  removeShareholder(index: number,id:any): void {
    this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deleteShareholding,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.shareholdersNewDto.removeAt(index);
  }


  // getTotalShares(): number {
  //   return this.shareholdersNewDto.controls.reduce((total, shareholder) => {
  //     const shares = parseFloat(shareholder.get('numOfShares')?.value) || 0;
  //     return total + shares;
  //   }, 0);
  // }
closeModal(): void {
    this.showShareholderModal = false;
    this.isEditMode = false;
    this.editIndex = null;
  }
// Partnership Form
  partnershipForm!: FormGroup;
  addPartnership(data?: any): void {
    const partnershipGroup = this.fb.group({
      id: [data?.id || 0],
      nameOfThePartner: [data?.nameOfThePartner || '', Validators.required],
      position: [data?.position || '', Validators.required],
      profitSharingPercentage: [data?.profitSharingPercentage || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
    }); 
    this.partnershipDto.push(partnershipGroup);
  }
  showPartnershipModal = false;
  isEditModePartnership = false;
  editIndexPartnership: number | null = null;
   openPartnershipModal(editIndexPartnership: number | null = null): void {
    this.isEditModePartnership = editIndexPartnership !== null;
    this.editIndexPartnership = editIndexPartnership;
    
    if (this.isEditModePartnership && editIndexPartnership !== null) {
      const shareholder = this.partnershipDto.at(editIndexPartnership);
      this.partnershipForm.patchValue({
        id: shareholder.get('id')?.value,
        nameOfThePartner: shareholder.get('nameOfThePartner')?.value,
        position: shareholder.get('position')?.value,
        profitSharingPercentage: shareholder.get('profitSharingPercentage')?.value
      
      });
    } else {
      this.partnershipForm.reset();
    }
    
    this.showPartnershipModal = true;
  }

savePartnership(): void {
  console.log(this.partnershipForm.value,this.basicDetails.value)
    if (this.partnershipForm.invalid) {
      return;
    }

    if (this.isEditModePartnership && this.editIndexPartnership !== null) {
      this.partnershipDto.at(this.editIndexPartnership).patchValue(this.partnershipForm.value);
    } else {
      this.partnershipDto.push(this.fb.group(this.partnershipForm.value));
    }

    this.closePartnershipModal();
  }
  closePartnershipModal(): void {
    this.showPartnershipModal = false;
    this.isEditModePartnership = false;
    this.editIndexPartnership = null;
  }

  removePartnerShip(index: number,id:any): void {
    // this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deleteShareholding,id).subscribe(
    //     (res:any)=>{
          
    //   },
    //   (error:any)=>{

    // })
    this.partnershipDto.removeAt(index);
  }

  saveBasicDetails(): void {
    console.log(this.basicDetails.value)
    if (this.basicDetails.valid) {
      // Save logic here
      let payload:any={...this.basicDetails.value,"currentScreenStatus": "BASIC_DETAILS",
          id:this.getDataOfDiagnostic?.id,
        "applicationNo": this.applicationData.applicationNo,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='TOP_5_BUYERS'
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
      this.saveSuccess.basic = true;
      setTimeout(() => this.saveSuccess.basic = false, 3000);
    }
  }
// basic details completed

// Buyer and supllier code--starts
  editType: any = null;
 initBuyerForm(): void {
    this.buyerForm = this.fb.group({
      id:[''],
      buyerName: ['', Validators.required],
      // purchasedQty: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      remarks: ['']
    });
  }

  initSupplierForm(): void {
    this.supplierForm = this.fb.group({
      id:[''],
      sellerName: ['', Validators.required],
      // suppliedQty: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(0)]],
      remarks: ['']
    });
  }

 openBuyerModal(editIndex: number | null = null): void {
    this.isEditMode = editIndex !== null;
    this.editIndex = editIndex;
    this.editType = 'buyer';
    
    if (this.isEditMode && editIndex !== null) {
      const buyer = this.buyers.at(editIndex);
      this.buyerForm.patchValue({
        id:buyer.get('id')?.value,
        buyerName: buyer.get('buyerName')?.value,
        // purchasedQty: buyer.get('purchasedQty')?.value,
        amount: buyer.get('amount')?.value,
        remarks: buyer.get('remarks')?.value
      });
    } else {
      this.buyerForm.reset();
    }
    
    this.showBuyerModal = true;
  }

  openSupplierModal(editIndex: number | null = null): void {
    this.isEditMode = editIndex !== null;
    this.editIndex = editIndex;
    this.editType = 'supplier';
    
    if (this.isEditMode && editIndex !== null) {
      const supplier = this.suppliers.at(editIndex);
      this.supplierForm.patchValue({
        id: supplier.get('id')?.value,
        sellerName: supplier.get('sellerName')?.value,
        // suppliedQty: supplier.get('suppliedQty')?.value,
        amount: supplier.get('amount')?.value,
        remarks: supplier.get('remarks')?.value
      });
    } else {
      this.supplierForm.reset();
    }
    
    this.showSupplierModal = true;
  }

  saveBuyer(): void {
    if (this.buyerForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.buyers.at(this.editIndex).patchValue(this.buyerForm.value);
    } else {
      this.buyers.push(this.fb.group(this.buyerForm.value));
    }

    this.closeModalBuyer();
    this.saveSuccess.buyers = true;
    setTimeout(() => this.saveSuccess.buyers = false, 3000);
  }

  saveSupplier(): void {
    if (this.supplierForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.suppliers.at(this.editIndex).patchValue(this.supplierForm.value);
    } else {
      this.suppliers.push(this.fb.group(this.supplierForm.value));
    }

    this.closeModalBuyer();
    this.saveSuccess.suppliers = true;
    setTimeout(() => this.saveSuccess.suppliers = false, 3000);
  }

  removeBuyer(index: number,id:any): void {
     this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deleteBuyer,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.buyers.removeAt(index);
  }

  removeSupplier(index: number,id:any): void {
     this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deleteseller,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.suppliers.removeAt(index);
  }

  closeModalBuyer(): void {
    this.showBuyerModal = false;
    this.showSupplierModal = false;
    this.isEditMode = false;
    this.editIndex = null;
    this.editType = null;
  }
  saveBuyersDetails(): void {
    console.log(this.diagnosticForm.value)
    if (this.basicDetails.valid) {
      // Save logic here
      let payload:any={topBuyers:this.diagnosticForm.value?.topBuyers,topSellers:this.diagnosticForm.value?.topSellers,"currentScreenStatus": "TOP_5_BUYERS",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='RECEIVABLES_PAYABLES'
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
      this.saveSuccess.basic = true;
      setTimeout(() => this.saveSuccess.basic = false, 3000);
    }
  }
  // end of buyers and suppliers

  // starts with receivable and payables
 showReceivableModal = false;
  showPayableModal = false;
  // isEditMode = false;
  // editIndex: number | null = null;
  // editType: 'receivable' | 'payable' | null = null;
 receivableForm!: FormGroup;
  payableForm!: FormGroup;
  initReceivableForm(): void {
    this.receivableForm = this.fb.group({
      id:[''],
      toBeReceivedFrom: ['', Validators.required],
      // receivableDate: ['', Validators.required],
      receivableAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  initPayableForm(): void {
    this.payableForm = this.fb.group({
      id:[''],
      toBePaidTo: ['', Validators.required],
      // payableDate: ['', Validators.required],
      payableAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }
   openReceivableModal(editIndex: number | null = null): void {
    this.isEditMode = editIndex !== null;
    this.editIndex = editIndex;
    this.editType = 'receivable';
    
    if (this.isEditMode && editIndex !== null) {
      const receivable = this.receivables.at(editIndex);
      this.receivableForm.patchValue({
        id: receivable.get('id')?.value,
        toBeReceivedFrom: receivable.get('toBeReceivedFrom')?.value,
        // receivableDate: receivable.get('receivableDate')?.value,
        receivableAmount: receivable.get('receivableAmount')?.value
      });
    } else {
      this.receivableForm.reset();
    }
    
    this.showReceivableModal = true;
  }
  openPayableModal(editIndex: number | null = null): void {
    this.isEditMode = editIndex !== null;
    this.editIndex = editIndex;
    this.editType = 'payable';
    
    if (this.isEditMode && editIndex !== null) {
      const payable = this.payables.at(editIndex);
      this.payableForm.patchValue({
         id: payable.get('id')?.value,
        toBePaidTo: payable.get('toBePaidTo')?.value,
        // payableDate: payable.get('payableDate')?.value,
        payableAmount: payable.get('payableAmount')?.value
      });
    } else {
      this.payableForm.reset();
    }
    
    this.showPayableModal = true;
  }

  saveReceivable(): void {
    if (this.receivableForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.receivables.at(this.editIndex).patchValue(this.receivableForm.value);
    } else {
      this.receivables.push(this.fb.group(this.receivableForm.value));
    }

    this.closeModalReceivalbale();
    this.saveSuccess.receivables = true;
    setTimeout(() => this.saveSuccess.receivables = false, 3000);
  }

  savePayable(): void {
    if (this.payableForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editIndex !== null) {
      this.payables.at(this.editIndex).patchValue(this.payableForm.value);
    } else {
      this.payables.push(this.fb.group(this.payableForm.value));
    }

    this.closeModalReceivalbale();
    this.saveSuccess.payables = true;
    setTimeout(() => this.saveSuccess.payables = false, 3000);
  }

  removeReceivable(index: number,id:any): void {
     this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deletereceivable,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.receivables.removeAt(index);
  }

  removePayable(index: number,id:any): void {
      this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deletepayable,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.payables.removeAt(index);
  }

  closeModalReceivalbale(): void {
    this.showReceivableModal = false;
    this.showPayableModal = false;
    this.isEditMode = false;
    this.editIndex = null;
    this.editType = null;
  }

  getTotalReceivables(): number {
    return this.receivables.controls.reduce((total, receivable) => {
      const amount = parseFloat(receivable.get('receivableAmount')?.value) || 0;
      return total + amount;
    }, 0);
  }

  getTotalPayables(): number {
    return this.payables.controls.reduce((total, payable) => {
      const amount = parseFloat(payable.get('payableAmount')?.value) || 0;
      return total + amount;
    }, 0);
  }

   formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Formats as dd/mm/yyyy
  }
   saveReceivaablesDetails(): void {
    console.log(this.diagnosticForm.value)
    if (this.basicDetails.valid) {
      // Save logic here
      let payload:any={receivables:this.diagnosticForm.value?.receivables,payables:this.diagnosticForm.value?.payables,"currentScreenStatus": "RECEIVABLES_PAYABLES",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='OPERATIONAL_STATUS'
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
      this.saveSuccess.basic = true;
      setTimeout(() => this.saveSuccess.basic = false, 3000);
    }
  }
  //end of receiuvables
  // Methods to add form array items

// starts operational status
orderBookForm!: FormGroup;
  unsecuredLoansForm!: FormGroup;
  isEditingOrderBook = false;
  isEditingUnsecuredLoan=false
  currentOrderBookIndex = -1;
  currentUnsecuredLoanIndex = -1;
changesdata(event?:any){
console.log(event)
if(!this.operationalStatus.get('isWorking')?.value){
  while (this.orderBookPositions.length !== 0) {
    this.orderBookPositions.removeAt(0);
  }
   while (this.unsecuredLoans.length !== 0) {
    this.unsecuredLoans.removeAt(0);
  }
  this.operationalStatus.patchValue({ 
        hasUnsecuredLoans: false,
        requiredLoanAmount: 0, 
        loanSecurityType: '',
        hasStatutoryDuePending: false,
        statutoryDetails: '',
        subsidyType:'',
        subsidyAmountPending:'',
        othersType:'',
        orderBookPositions: [],
        unsecuredLoans: []
      }
      )
  return
}
if(!this.operationalStatus.get('hasUnsecuredLoans')?.value){
     while (this.unsecuredLoans.length !== 0) {
    this.unsecuredLoans.removeAt(0);
  }
   this.operationalStatus.patchValue({ 
        unsecuredLoans: []
      }
      )
}
if(this.operationalStatus.get('loanSecurityType')?.value!='Pending Subsidy' && this.operationalStatus.get('loanSecurityType')?.value!='othersLoan'){
  this.operationalStatus.patchValue({ 
        subsidyType:'',
        subsidyAmountPending:'',
        othersType:''
      })
  }
  else if(this.operationalStatus.get('loanSecurityType')?.value=='Pending Subsidy'){
    this.operationalStatus.patchValue({ 
        othersType:''
      })
  }
    else if(this.operationalStatus.get('loanSecurityType')?.value=='Pending Subsidy'){
    this.operationalStatus.patchValue({ 
         subsidyType:'',
        subsidyAmountPending:'',
      })
  }
  if(!this.operationalStatus.get('hasStatutoryDuePending')?.value){
    this.operationalStatus.patchValue({ 
        statutoryDetails:''
      })
  }
       
}

operationtableformsInit(){
   this.orderBookForm = this.fb.group({
    //  "nameOfTheBuyer": "string",
    //     "remarks": "string"
      // dateOfOrder: ['', Validators.required],
      nameOfTheBuyer: ['', Validators.required],
      orderValue: ['', [Validators.required, Validators.min(0)]],
      remarks: ['']
    });

    // Unsecured Loans modal form
    this.unsecuredLoansForm = this.fb.group({
      "source": ['',Validators.required],
      "loanAmount": [0, [Validators.min(0)]],
      "sinceWhen": ['',Validators.required],
      "tenor":[''],
    });
}

  openOrderBookModal() {
    this.orderBookForm.reset();
    this.isEditingOrderBook = false;
    this.orderBookPositionsModal=true
    // $('#orderBookModal').modal('show');
  }

 
  get unsecuredLoans(): FormArray {
    return this.operationalStatus.get('unsecuredLoans') as FormArray;
  }

orderBookPositionsModal = false;
    unsecuredLoansModal = false;
 

  saveUnsecuredLoanDetails() {
    if (this.unsecuredLoansForm.invalid) return;

    this.operationalStatus.patchValue({
      hasUnsecuredLoans: true,
      source: this.unsecuredLoansForm.get('source')?.value,
      loanAmount: this.unsecuredLoansForm.get('loanAmount')?.value,
      sinceWhen: this.unsecuredLoansForm.get('sinceWhen')?.value,
      tenor: this.unsecuredLoansForm.get('tenor')?.value,
    });
    this.closeOperationalModals()
    this.unsecuredLoansModal=false

    // $('#unsecuredLoansModal').modal('hide');
  }
   editOrderBookPosition(index: number) {
    this.isEditingOrderBook = true;
    this.currentOrderBookIndex = index;
    const position = this.orderBookPositions.at(index);
    this.orderBookForm.patchValue(position.value);
   this.orderBookPositionsModal=true
  }

  saveOrderBookPosition() {
    if (this.orderBookForm.invalid) return;

    const positionData = this.orderBookForm.value;
    
    if (this.isEditingOrderBook) {
      this.orderBookPositions.at(this.currentOrderBookIndex).patchValue(positionData);
    } else {
      this.orderBookPositions.push(this.fb.group(positionData));
    }
    
    this.closeOperationalModals()
  }

  removeOrderBookPosition(index: number,id:any) {
     this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deleteorderBookPosition,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.orderBookPositions.removeAt(index);
  }

  getTotalOrderValue(): number {
    return this.orderBookPositions.controls.reduce((total:any, position:any) => {
      return total + (+position.get('orderValue').value || 0);
    }, 0);
  }

  openUnsecuredLoansModal() {
    this.unsecuredLoansForm.reset();
    this.isEditingUnsecuredLoan = false;
    this.unsecuredLoansModal=true
  }

  editUnsecuredLoan(index: number) {
    this.isEditingUnsecuredLoan = true;
    this.currentUnsecuredLoanIndex = index;
    const loan = this.unsecuredLoans.at(index);
    this.unsecuredLoansForm.patchValue(loan.value);
    this.unsecuredLoansModal=true
  }

  saveUnsecuredLoan() {
    if (this.unsecuredLoansForm.invalid) return;

    const loanData = this.unsecuredLoansForm.value;
    
    if (this.isEditingUnsecuredLoan) {
      this.unsecuredLoans.at(this.currentUnsecuredLoanIndex).patchValue(loanData);
    } else {
      this.unsecuredLoans.push(this.fb.group(loanData));
    }
    
    this.closeOperationalModals()
  }

  removeUnsecuredLoan(index: number,id:any) {
     this._commonService.deleteById(APIS.tihclExecutive.deleteDiagnostics.deleteunsecured,id).subscribe(
        (res:any)=>{
          
      },
      (error:any)=>{

    })
    this.unsecuredLoans.removeAt(index);
  }
closeOperationalModals(){
   this.unsecuredLoansModal=false
   this.orderBookPositionsModal=false
    this.isEditMode = false;
    this.editIndex = null;
    this.editType = null;
    this.isEditingOrderBook = false;
  this.currentOrderBookIndex = -1;
}
 
  saveOperationalStatus() {
    if (this.operationalStatus.invalid) return;
    
    // Save logic here
    console.log('Form data:', this.operationalStatus.value);
     let payload:any={operationalStatus:this.diagnosticForm.value?.operationalStatus,"currentScreenStatus": "OPERATIONAL_STATUS",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='REASONS_FOR_STRESS'
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
    this.saveSuccess.operational = true;
    setTimeout(() => this.saveSuccess.operational = false, 3000);
  }
// end operational

  // save saveStressReasone starts

saveStressReason(): void {
    console.log(this.diagnosticForm.value)
    if (this.basicDetails.valid) {
      // Save logic here
      let payload:any={reasonForStress:this.diagnosticForm.value?.reasonForStress,"currentScreenStatus": "REASONS_FOR_STRESS",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='BALANCE_SHEET'
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
      this.saveSuccess.basic = true;
      setTimeout(() => this.saveSuccess.basic = false, 3000);
    }
  }
  // end saveStressReason



  // balnce sheet start
  balanceSheetsForm!: FormGroup;
  editData: any;
  showbalanceSheetsModal = false;
    initializebalanceSheetsForm(): void {
    this.balanceSheetsForm = this.fb.group({
      reportDate: ['', Validators.required],
      financialYear: ['', Validators.required],
      totalReceipts: [0, [Validators.required, Validators.min(0)]],
       balanceSheetType: [0, [Validators.required]],
      turnoverAsPerBankStatement: [0, [Validators.min(0)]],
      netProfitOrLoss: [0],
      cashProfitOrLoss: [0],
      sundryCreditors: [0, [Validators.required, Validators.min(0)]],
      sundryDebtors: [0, [Validators.required, Validators.min(0)]],
      unsecuredLoans: [0, [Validators.required, Validators.min(0)]],
      netAddCapInfused: [0, [Validators.required, Validators.min(0)]],
      tol: [0, [Validators.required, Validators.min(0)]],
      tnw: [0, [Validators.required, Validators.min(0)]],
      tolTnwRatio: [0],
      currentAssets: [0, [Validators.required, Validators.min(0)]],
      currentLiabilities: [0, [Validators.required, Validators.min(0)]],
      currentRatio: [0]
    });
     // Calculate ratios when dependent fields change
    this.balanceSheetsForm.get('tol')?.valueChanges.subscribe(() => this.calculateRatios());
    this.balanceSheetsForm.get('tnw')?.valueChanges.subscribe(() => this.calculateRatios());
    this.balanceSheetsForm.get('currentAssets')?.valueChanges.subscribe(() => this.calculateRatios());
    this.balanceSheetsForm.get('currentLiabilities')?.valueChanges.subscribe(() => this.calculateRatios());
  }
  calculateRatios(): void {
    console.log(this.balanceSheetsForm.value)
    const tol = this.balanceSheetsForm.get('tol')?.value || 0;
    const tnw = this.balanceSheetsForm.get('tnw')?.value || 0;
    const currentAssets = this.balanceSheetsForm.get('currentAssets')?.value || 0;
    const currentLiabilities = this.balanceSheetsForm.get('currentLiabilities')?.value || 0;
    console.log(tol,tnw,currentAssets)
    // Calculate TOL/TNW Ratio
    if (tnw !== 0) {
      
      this.balanceSheetsForm.get('tolTnwRatio')?.patchValue((tol / tnw).toFixed(2));
    }

    // Calculate Current Ratio
    if (currentLiabilities !== 0) {
      this.balanceSheetsForm.get('currentRatio')?.patchValue((currentAssets / currentLiabilities).toFixed(2), { emitEvent: false });
    }
  }
filePath:any
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // this.rampChecklistForm.get('creditApprasialPath')?.setValue(file.name);
  
            let formData =new FormData()
            formData.set("file",event.target.files[0]);
            formData.set("directory",'/diagnosticReport/'+this.applicationData?.applicationNo);
            console.log(formData)
           this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
             next: (response) => {
                 this.filePath=response?.filePath
                 this.diagnosticForm.get('urlForDiagnosticFile')?.setValue(this.filePath);
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      // Here you would typically upload the file to your server
    }
  }
  onSubmit(): void {
    console.log(this.balanceSheets.value,this.balanceSheetsForm.value)

    if (this.balanceSheetsForm.valid) {
      this.addBalanceSheet(this.balanceSheetsForm.value)
      console.log(this.balanceSheets.value,this.balanceSheetsForm.value)
      // this.activeModal.close(this.balanceSheets.value);
     let payload:any={balanceSheets:this.balanceSheets.value,"currentScreenStatus": "BALANCE_SHEET",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='STATUS_UPDATE'
          
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
    this.closeModalBalancesheet()
    } else {
      this.balanceSheetsForm.markAllAsTouched();
    }
    
  }
    openBalancesheetModal(editIndex: number | null = null): void {
    this.isEditMode = editIndex !== null;
    this.editIndex = editIndex;
    this.editType = 'Balancesheet';
     this.balanceSheetsForm.reset();
    
    this.showbalanceSheetsModal = true;
  }
  closeModalBalancesheet(): void {
    this.showbalanceSheetsModal = false;
    this.isEditMode = false;
    this.editIndex = null;
    this.editType = null;
  }
  // end balance sheet
// save status update starts

saveStatusUpdate(): void {
    console.log(this.diagnosticForm.value)
    if (this.basicDetails.valid) {
      // Save logic here
      let payload:any={observations:this.diagnosticForm.value?.observations,approvalStatus:this.diagnosticForm.value?.approvalStatus,"currentScreenStatus": "STATUS_UPDATE",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,urlForDiagnosticFile:this.diagnosticForm.get('urlForDiagnosticFile')?.value || null,
        "applicationStatus": "UNIT_VISIT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='STATUS_UPDATE'
          this.loadDiagnosticData()
      },
      (error:any)=>{

    })
      this.saveSuccess.basic = true;
      setTimeout(() => this.saveSuccess.basic = false, 3000);
    }
  }
  // end status Update
  // removeShareholder(index: number): void {
  //   this.shareholdersNewDto.removeAt(index);
  // }

  addBuyer(data?: any): void {
    const buyerGroup = this.fb.group({
      id: [data?.id || 0],
      buyerName: [data?.buyerName || '', Validators.required],
      // purchasedQty: [data?.purchasedQty || 0, [Validators.required, Validators.min(0)]],
      amount: [data?.amount || 0, [Validators.required, Validators.min(0)]],
      remarks: [data?.remarks || '']
    });

    this.buyers.push(buyerGroup);
  }

 
  addSupplier(data?: any): void {
    const supplierGroup = this.fb.group({
      id: [data?.id || 0],
      sellerName: [data?.sellerName || '', Validators.required],
      // suppliedQty: [data?.suppliedQty || 0, [Validators.required, Validators.min(0)]],
      amount: [data?.amount || 0, [Validators.required, Validators.min(0)]],
      remarks: [data?.remarks || '']
    });

    this.suppliers.push(supplierGroup);
  }



  addReceivable(data?: any): void {
    const receivableGroup = this.fb.group({
      id: [data?.id || 0],
      toBeReceivedFrom: [data?.toBeReceivedFrom || '', Validators.required],
      // receivableDate: [data?.receivableDate || '', Validators.required],
      receivableAmount: [data?.receivableAmount || 0, [Validators.required, Validators.min(0)]]
    });

    this.receivables.push(receivableGroup);
  }


  addPayable(data?: any): void {
    const payableGroup = this.fb.group({
      id: [data?.id || 0],
      toBePaidTo: [data?.toBePaidTo || '', Validators.required],
      // payableDate: [data?.payableDate || '', Validators.required],
      payableAmount: [data?.payableAmount || 0, [Validators.required, Validators.min(0)]]
    });

    this.payables.push(payableGroup);
  }



  addOrderBookPosition(data?: any): void {
    const positionGroup = this.fb.group({
      id: [data?.id || 0],
      // dateOfOrder: [data?.dateOfOrder || '', Validators.required],
      nameOfTheBuyer: [data?.nameOfTheBuyer || '', Validators.required],
      orderValue: [data?.orderValue || 0, [Validators.required, Validators.min(0)]],
      remarks: [data?.remarks || '', Validators.required]
    });

    this.orderBookPositions.push(positionGroup);
  }
  addUnsecuredData(data?:any):void{
     const positionGroup = this.fb.group({
      id: [data?.id || 0],
      source: [data?.source || '', Validators.required],
      sinceWhen: [data?.sinceWhen || '', Validators.required],
      loanAmount: [data?.loanAmount || 0, [Validators.required, Validators.min(0)]],
      tenor: [data?.tenor || '', ]
    });
    this.unsecuredLoans.push(positionGroup);
  }

 

  addBalanceSheet(data?: any): void {
    const balanceSheetGroup = this.fb.group({
      // id: [data?.id || 0],
      reportDate: [data?.reportDate || '', Validators.required],
      financialYear: [data?.financialYear || '', Validators.required],
      balanceSheetType: [data?.balanceSheetType || '', Validators.required],
      totalReceipts: [data?.totalReceipts || 0, Validators.min(0)],
      turnoverAsPerBankStatement: [data?.turnoverAsPerBankStatement || 0, Validators.min(0)],
      netProfitOrLoss: [data?.netProfitOrLoss || 0],
      cashProfitOrLoss: [data?.cashProfitOrLoss || 0],
      sundryCreditors: [data?.sundryCreditors || 0, Validators.min(0)],
      sundryDebtors: [data?.sundryDebtors || 0, Validators.min(0)],
      unsecuredLoans: [data?.unsecuredLoans || 0, Validators.min(0)],
      netAddCapInfused: [data?.netAddCapInfused || 0, Validators.min(0)],
      tol: [data?.tol || 0, Validators.min(0)],
      tnw: [data?.tnw || 0, Validators.min(0)],
      tolTnwRatio: [data?.tolTnwRatio || 0],
      currentAssets: [data?.currentAssets || 0, Validators.min(0)],
      currentLiabilities: [data?.currentLiabilities || 0, Validators.min(0)],
      currentRatio: [data?.currentRatio || 0]
    });

    this.balanceSheets.push(balanceSheetGroup);
  }

  removeBalanceSheet(index: number): void {
    this.balanceSheets.removeAt(index);
  }
Approved(){

  let payload:any={...this.diagnosticForm.value,"currentScreenStatus": "STATUS_UPDATE",
        "applicationNo": this.applicationData.applicationNo, id:this.getDataOfDiagnostic?.id,
        "applicationStatus": "DIAGNOSTIC_REPORT"}

      this._commonService.add(APIS.tihclExecutive.saveDiagnostic,payload).subscribe(
        (res:any)=>{
          console.log(res)
          this.currentTab='STATUS_UPDATE'
          this.loadDiagnosticData()
           this.progressBarStatusUpdate.emit({"update":true})
      },
      (error:any)=>{

    })
}

}