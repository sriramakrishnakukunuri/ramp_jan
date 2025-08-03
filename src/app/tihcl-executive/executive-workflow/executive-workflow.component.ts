import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-executive-workflow',
  templateUrl: './executive-workflow.component.html',
  styleUrls: ['./executive-workflow.component.css']
})
export class ExecutiveWorkflowComponent implements OnInit {

 constructor(private toastrService: ToastrService,
      private _commonService: CommonServiceService,
      private router: Router,) { 
        this.getAplicationData()
         
      }
statusList: any = [
        'APPLICATION_SUBMITTED', 'PRELIMINARY_ASSESSMENT', 'MANAGER_APPROVAL_1', 'UNIT_VISIT', 'DIAGNOSTIC_REPORT', 'MANAGER_APPROVAL_2', 'DIC_CONSENT_APPROVAL', 'CREDIT_APPRAISAL', 'PRIMARY_LENDER_NOC', 'SANCTION_LETTER_UPLOAD', 'MANAGER_APPROVAL_3', 'SANCTION_LETTER_UPLOAD', 'DISBURSEMENT_PARTIAL', 'DISBURSEMENT_COMPLETED', 'LOAN_REPAYMENT_REGULAR', 'LOAN_REPAYMENT_DUE', 'LOAN_REPAYMENT_COMPLETED', 'REJECTED_MANAGER_APPROVAL_1', 'REJECTED_MANAGER_APPROVAL_2', 'REJECTED_MANAGER_APPROVAL_3'
      ];

currentStep:any = 1;
  ngOnInit(): void {
    
    this.stepperChanges()
     
  }
  // ngOnChanges() {
  //   this.getAplicationData()
  // }
  apllicationDataByGet:any={}
  getAplicationData(){
    console.log('getAplicationData called');
    const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
      this._commonService.getDataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId)).subscribe({
      next: (dataList: any) => {

        this.apllicationDataByGet= dataList?.data;
        console.log('Application Data:', this.apllicationDataByGet);
       
         
        // Handle the dataList as needed
      },
      error: (error: any) => {
        // this.toastrService.error(error?.error?.message);
      }
    });
  }
  apllictaionDataGlobal:any
  UserDetails:any
  freezeValue:any=0
  stepperChanges(){
    this.UserDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
     const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
     this.apllictaionDataGlobal=applicationData
     
     console.log('Application Data:', applicationData,  this.apllicationDataByGet);
     if(!applicationData || Object.keys(applicationData).length === 0) {

     }
     else if(applicationData.status === 'APPLICATION_SUBMITTED' || applicationData.applicationStatus === 'APPLICATION_SUBMITTED' ) {
        this.getDtataByUrl(APIS.tihclExecutive.registerData + applicationData?.registrationUsageId?applicationData?.registrationUsageId:applicationData?.registrationId);
        this._commonService.setCurrentStep(1);
        this.freezeValue=1
        // sessionStorage.setItem('ApplicationData', JSON.stringify(applicationData));
     }else if(applicationData.status === 'PRELIMINARY_ASSESSMENT' || applicationData.applicationStatus === 'PRELIMINARY_ASSESSMENT'){
     this._commonService.setCurrentStep(2)
      this.currentStep=2
       this.freezeValue=2
     }
      else if(applicationData.status === 'MANAGER_REVERIFY_1' || applicationData.applicationStatus === 'MANAGER_REVERIFY_1'){
     this._commonService.setCurrentStep(1)
      this.currentStep=1
       this.freezeValue=1
     }
     else if(applicationData.status === 'REJECTED_MANAGER_APPROVAL_1' || applicationData.applicationStatus === 'REJECTED_MANAGER_APPROVAL_1'){
     this._commonService.setCurrentStep(2)
      this.currentStep=2
       this.freezeValue=2
     }
     else if(applicationData.status === 'MANAGER_APPROVAL_1' || applicationData.applicationStatus === 'MANAGER_APPROVAL_1'){
     this._commonService.setCurrentStep(3)
      this.currentStep=3
       this.freezeValue=3
     }
      else if(applicationData.status === 'UNIT_VISIT' || applicationData.applicationStatus === 'UNIT_VISIT'){
     this._commonService.setCurrentStep(4)
      this.currentStep=4
       this.freezeValue=4
     }
      else if(applicationData.status === 'DIAGNOSTIC_REPORT' || applicationData.applicationStatus === 'DIAGNOSTIC_REPORT'){
     this._commonService.setCurrentStep(5)
      this.currentStep=5
      this.freezeValue=5
     }
      else if(applicationData.status === 'MANAGER_APPROVAL_2' || applicationData.applicationStatus === 'MANAGER_APPROVAL_2'){
     this._commonService.setCurrentStep(6)
      this.currentStep=6
      this.freezeValue=6
     }
     else if(applicationData.status === 'REJECTED_MANAGER_APPROVAL_2' || applicationData.applicationStatus === 'REJECTED_MANAGER_APPROVAL_2'){
     this._commonService.setCurrentStep(5)
      this.currentStep=5
      this.freezeValue=5
     }
      else if(applicationData.status === 'DIC_APPROVAL' || applicationData.applicationStatus === 'DIC_APPROVAL'){
     this._commonService.setCurrentStep(6)
      this.currentStep=6
      this.freezeValue=6
     }
      else if(applicationData.status === 'DIC_CONSENT_APPROVAL' || applicationData.applicationStatus === 'DIC_CONSENT_APPROVAL'){
     this._commonService.setCurrentStep(7)
      this.currentStep=7
      this.freezeValue=7
     }
      else if(applicationData.status === 'CREDIT_APPRAISAL' || applicationData.applicationStatus === 'CREDIT_APPRAISAL'){
     this._commonService.setCurrentStep(8)
      this.currentStep=8
      this.freezeValue=8
     }
      else if(applicationData.status === 'PRIMARY_LENDER_NOC' || applicationData.applicationStatus === 'PRIMARY_LENDER_NOC'){
     this._commonService.setCurrentStep(9)
      this.currentStep=9
      this.freezeValue=9
     }
     else if(applicationData.status === 'SANCTION_LETTER_UPLOAD' || applicationData.applicationStatus === 'SANCTION_LETTER_UPLOAD'){
     this._commonService.setCurrentStep(10)
      this.currentStep=10
      this.freezeValue=10
     }
      else if(applicationData.status === 'MANAGER_APPROVAL_3' || applicationData.applicationStatus === 'MANAGER_APPROVAL_3'){
     this._commonService.setCurrentStep(11)
      this.currentStep=11
      this.freezeValue=11
     }
      else if(applicationData.status === 'REJECTED_MANAGER_APPROVAL_3' || applicationData.applicationStatus === 'REJECTED_MANAGER_APPROVAL_3'){
    this._commonService.setCurrentStep(10)
      this.currentStep=10
      this.freezeValue=10
     }
       else if(applicationData.status === 'DISBURSEMENT_PARTIAL' || applicationData.applicationStatus === 'DISBURSEMENT_PARTIAL'){
     this._commonService.setCurrentStep(11)
      this.currentStep=11
      this.freezeValue=11
     }
       else if(applicationData.status === 'DISBURSEMENT_COMPLETED' || applicationData.applicationStatus === 'DISBURSEMENT_COMPLETED'){
      this._commonService.setCurrentStep(11)
        this.currentStep=11
        this.freezeValue=11
     }
     this.currentStep = this._commonService.getCurrentStep();
     this.freezeValue=this._commonService.getCurrentStep();
    console.log(this.freezeValue)
  }
   
 
  getDtataByUrl(url: string) {
    this._commonService.getDataByUrl(url).subscribe({
      next: (dataList: any) => {
        this.apllicationDataByGet= dataList?.data;
        console.log('Application Data143:', this.apllicationDataByGet,dataList);
        sessionStorage.setItem('ApplicationData', JSON.stringify(dataList?.data));
        console.log(dataList?.data,dataList?.data.applicationStatus,dataList?.data.applicationStatus === 'PRELIMINARY_ASSESSMENT')
        if(dataList?.data.applicationStatus === 'PRELIMINARY_ASSESSMENT' || dataList?.data.status === 'PRELIMINARY_ASSESSMENT'){
          this.currentStep=2
          this._commonService.setCurrentStep(2)
          this.freezeValue=2
           
        }
        this.stepperChanges()
        return dataList?.data
         
        // Handle the dataList as needed
      },
      error: (error: any) => {
        // this.toastrService.error(error?.error?.message);
      }
    });
  }
progressBarStatusUpdate(event:any) {
  console.log(event)
    if(event.update === true) {  
       const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}'); 
       this.apllictaionDataGlobal=applicationData
      //  console.log(applicationData,applicationData?.registrationUsageId?applicationData?.registrationUsageId:applicationData?.registrationId)
      this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
      // this.getDtataByUrl(APIS.tihclExecutive.registerData + applicationData.registrationUsageId)
    }
  }
PreviousStep() {
  if (this.currentStep > 1) {
    this.currentStep--;
    // this.freezeValue = this.currentStep;
    this._commonService.setCurrentStep(this.currentStep);
  }
}

NextStep() {
  if (this.currentStep < this.statusList.length) {
    this.currentStep++;
    // this.freezeValue = this.currentStep;
    this._commonService.setCurrentStep(this.currentStep);
  }
}
}


