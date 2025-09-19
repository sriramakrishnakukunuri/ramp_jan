import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '@app/common_components/loader-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ramp-checklist',
  templateUrl: './ramp-checklist.component.html',
  styleUrls: ['./ramp-checklist.component.css']
})
export class RampChecklistComponent implements OnInit {
  @Input() freeze:any
  rampChecklistForm!: FormGroup;
  applicationData:any
  constructor(private fb: FormBuilder, private toastrService: ToastrService,
    private loader: LoaderService,
    private sanitizer: DomSanitizer,
        private _commonService: CommonServiceService,
        private router: Router,) {
           const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
          this.applicationData=applicationData
          this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
          this.getRampCheckListData()
        }
    @Output() progressBarStatusUpdate:any = new EventEmitter();
  ngOnInit(): void {
    this.initializeForm();
    // If you're getting data from API, call it here and patch the values
    
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
    RampChecklistData:any
    getRampCheckListData(){
      this._commonService.getDataByUrl(APIS.tihclExecutive.getRampCheckList+(this.applicationData.registrationUsageId? this.applicationData?.registrationUsageId:this.applicationData?.registrationId)).subscribe({
              next: (dataList: any) => {
                if(!dataList && Object.keys(dataList).length === 0){
                  this.getRampChecklistData();
                  return
                }
              this.RampChecklistData=dataList
              this.rampChecklistForm.patchValue(dataList);
              },
              error: (error: any) => {
                 this.getRampChecklistData();
                this.toastrService.error(error.error.message);
              }
            });
    }
  initializeForm(): void {
    this.rampChecklistForm = this.fb.group({
      // Section 1: Sourcing of Applications
      isBorrowerIdentified: [true],
      isStress: [true],
      isStressDueToWillfulReasons: [true],
      
      // Section 2: KYC and Due Diligence
      isBriefProfile: [true],
      isBriefHistoryAccount: [true],
      isKycDocumentVerified: [true],
      isProperAndEffective: [true],
      
      // Section 3: Required Documents
      isLoanApplicationDocs: [true],
      isExistingBankingArrangements: [true],
      isNocCertificate: [true],
      isPresentRequest: [true],
      
      // Section 4: Processing
      isAnalyzeAndIdentify: [false],
      isTechnicalFeasibility: [true],
      isAnalysisOfCreditBureauReports: [true],
      isDemandForProductAndMarketPotential: [true],
      isOrderBookPosition: [true],
      isListOfTopBuyersAndSuppliers: [true],
      isExistingMarketingArrangements: [true],
      isAnalysisOfFinancials: [true],
      isEstablishingFinancialViability: [true],
      isAvailabilityOfSecurity: [true],
      isCapacityAndResources: [true],
      isPendingStatutoryDues: [true],
      
      // Section 5: Unit Visit
      isCapacityUtilization: [true],
      isProcessingTheProposal:[true],
      isAchievementOfBreakevenProductionLevels: [true],
      isAvailabilityOfSkilledManpower: [true],
      isSupplyChainMechanism: [true],
      isAvailabilityOfRequiredInfrastructure: [true],
      isPollutionControlPermissions: [true],
      
      // Section 6: Risk Management
      isVariousRiskElements: [true],
      isProposalClearedFromRiskAngle: [true],
      
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
      isAnalyzeAndIdentify: false,
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
       if (file.size > 10 * 1024 * 1024) { // 10 MB in bytes
        this.toastrService.error('Upload file less than 10 MB');
        return;
      }
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
      this.loader.show()
      const formData = {...this.rampChecklistForm.value,"applicationNo": this.applicationData?.applicationNo,"applicationStatus": "CREDIT_APPRAISAL"}
      // Call your API service to submit the form data
      console.log('Form submitted:', formData);
       this._commonService.add(APIS.tihclExecutive.saveRampCheckList,formData).subscribe({
             next: (response) => {
              this.loader.hide()
              this.toastrService.success("Ramp Checklist Data Saved Successfully")
                this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
              this.toastrService.error(error?.error?.message || "Something went wrong while submitting the form") 
              this.loader.hide()
               console.error('Error submitting form:', error);
             }
           });
    }else{
      this.toastrService.error("Please fill all the required fields in the form")
    }
  }
  showCreditPreviewModal = false;

safePreviewUrl: any;

openCreditPreviewModal() {
  const path = this.rampChecklistForm.get('creditApprasialPath')?.value;

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
    const url = this.rampChecklistForm.get('creditApprasialPath')?.value;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
