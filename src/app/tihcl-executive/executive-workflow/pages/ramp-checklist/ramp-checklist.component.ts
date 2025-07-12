 import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ramp-checklist',
  templateUrl: './ramp-checklist.component.html',
  styleUrls: ['./ramp-checklist.component.css']
})
export class RampChecklistComponent implements OnInit {

  rampChecklistForm!: FormGroup;
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
    this.initializeForm();
    // If you're getting data from API, call it here and patch the values
    this.getRampChecklistData();
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
  initializeForm(): void {
    this.rampChecklistForm = this.fb.group({
      // Section 1: Sourcing of Applications
      isBorrowerIdentified: [false],
      isStress: [false],
      isStressDueToWillfulReasons: [false],
      
      // Section 2: KYC and Due Diligence
      isBriefProfile: [false],
      isBriefHistoryAccount: [false],
      isKycDocumentVerified: [false],
      isProperAndEffective: [false],
      
      // Section 3: Required Documents
      isLoanApplicationDocs: [false],
      isExistingBankingArrangements: [false],
      isNocCertificate: [false],
      isPresentRequest: [false],
      
      // Section 4: Processing
      isAnalyzeAndIdentify: [false],
      isTechnicalFeasibility: [false],
      isAnalysisOfCreditBureauReports: [false],
      isDemandForProductAndMarketPotential: [false],
      isOrderBookPosition: [false],
      isListOfTopBuyersAndSuppliers: [false],
      isExistingMarketingArrangements: [false],
      isAnalysisOfFinancials: [false],
      isEstablishingFinancialViability: [false],
      isAvailabilityOfSecurity: [false],
      isCapacityAndResources: [false],
      isPendingStatutoryDues: [false],
      
      // Section 5: Unit Visit
      isCapacityUtilization: [false],
      isProcessingTheProposal:[false],
      isAchievementOfBreakevenProductionLevels: [false],
      isAvailabilityOfSkilledManpower: [false],
      isSupplyChainMechanism: [false],
      isAvailabilityOfRequiredInfrastructure: [false],
      isPollutionControlPermissions: [false],
      
      // Section 6: Risk Management
      isVariousRiskElements: [false],
      isProposalClearedFromRiskAngle: [false],
      
      // File Upload
      creditApprasialPath: ['',[Validators?.required]]
    });
  }

  getRampChecklistData(): void {
    // Simulate API call response
    const response = {
      isBorrowerIdentified: true,
      isStress: true,
      isBriefProfile: true,
      isBriefHistoryAccount: true,
      isKycDocumentVerified: true,
      isProperAndEffective: true,
      isLoanApplicationDocs: true,
      isExistingBankingArrangements: true,
      isNocCertificate: true,
      isPresentRequest: true,
      isAnalyzeAndIdentify: true,
      isTechnicalFeasibility: true,
      isAnalysisOfCreditBureauReports: true,
      isDemandForProductAndMarketPotential: true,
      isOrderBookPosition: true,
      isListOfTopBuyersAndSuppliers: true,
      isExistingMarketingArrangements: true,
      isAnalysisOfFinancials: true,
      isEstablishingFinancialViability: true,
      isAvailabilityOfSecurity: true,
      isCapacityAndResources: true,
      isPendingStatutoryDues: true,
      isCapacityUtilization: true,
      isAchievementOfBreakevenProductionLevels: true,
      isAvailabilityOfSkilledManpower: true,
      isSupplyChainMechanism: true,
      isAvailabilityOfRequiredInfrastructure: true,
      isPollutionControlPermissions: true,
      isVariousRiskElements: true,
      isProposalClearedFromRiskAngle: true,
      creditApprasialPath: ""
    };

    this.rampChecklistForm.patchValue(response);
  }
filePath:any
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // this.rampChecklistForm.get('creditApprasialPath')?.setValue(file.name);
  
            let formData =new FormData()
            formData.set("file",event.target.files[0]);
            formData.set("directory",'/CreditAppraisal/'+this.applicationData?.applicationNo);
            console.log(formData)
           this._commonService.add(APIS.tihcl_uploads.globalUpload,formData).subscribe({
             next: (response) => {
                 this.filePath=response?.filePath
                 this.rampChecklistForm.get('creditApprasialPath')?.setValue(this.filePath);
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      // Here you would typically upload the file to your server
    }
  }

  onSubmit(): void {
    console.log(this.filePath)
    if (this.rampChecklistForm.valid) {
      const formData = {...this.rampChecklistForm.value,"applicationNo": this.applicationData?.applicationNo,"applicationStatus": "CREDIT_APPRAISAL"}
      // Call your API service to submit the form data
      console.log('Form submitted:', formData);
       this._commonService.add(APIS.tihclExecutive.saveRampCheckList,formData).subscribe({
             next: (response) => {
                this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
    }
  }
}
