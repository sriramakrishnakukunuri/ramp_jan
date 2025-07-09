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
         sessionStorage.getItem('ApplicationData');
      }
statusList: any = [
        'APPLICATION_SUBMITTED', 'PRELIMINARY_ASSESSMENT', 'MANAGER_APPROVAL_1', 'UNIT_VISIT', 'DIAGNOSTIC_REPORT', 'MANAGER_APPROVAL_2', 'DIC_NOC', 'CREDIT_APPRAISAL', 'PRIMARY_LENDER_NOC', 'SANCTION_LETTER_UPLOAD', 'MANAGER_APPROVAL_3', 'LOAN_SANCTIONED', 'DISBURSEMENT_PARTIAL', 'DISBURSEMENT_COMPLETED', 'LOAN_REPAYMENT_REGULAR', 'LOAN_REPAYMENT_DUE', 'LOAN_REPAYMENT_COMPLETED', 'REJECTED_MANAGER_APPROVAL_1', 'REJECTED_MANAGER_APPROVAL_2', 'REJECTED_MANAGER_APPROVAL_3'
      ];

currentStep:any = 1;
  ngOnInit(): void {
      const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
     console.log('Application Data:', applicationData);
     if(!applicationData || Object.keys(applicationData).length === 0) {

     }
     else if(applicationData.status === 'APPLICATION_SUBMITTED' || applicationData.applicationStatus === 'APPLICATION_SUBMITTED' ) {
        this.getDtataByUrl(APIS.tihclExecutive.registerData + applicationData.registrationUsageId);
        this._commonService.setCurrentStep(1);
        // sessionStorage.setItem('ApplicationData', JSON.stringify(applicationData));
     }else if(applicationData.status === 'PRELIMINARY_ASSESSMENT' || applicationData.applicationStatus === 'PRELIMINARY_ASSESSMENT'){
     this._commonService.setCurrentStep(2)
      this.currentStep=2
     }
     else if(applicationData.status === 'REJECTED_MANAGER_APPROVAL_1' || applicationData.applicationStatus === 'REJECTED_MANAGER_APPROVAL_1'){
     this._commonService.setCurrentStep(2)
      this.currentStep=2
     }
     else if(applicationData.status === 'MANAGER_APPROVAL_1' || applicationData.applicationStatus === 'MANAGER_APPROVAL_1'){
     this._commonService.setCurrentStep(3)
      this.currentStep=3
     }
     
     this.currentStep = this._commonService.getCurrentStep();
     
  }
  getDtataByUrl(url: string) {
    this._commonService.getDataByUrl(url).subscribe({
      next: (dataList: any) => {
        sessionStorage.setItem('ApplicationData', JSON.stringify(dataList?.data));
        console.log(dataList?.data,dataList?.data.applicationStatus,dataList?.data.applicationStatus === 'PRELIMINARY_ASSESSMENT')
        if(dataList?.data.applicationStatus === 'PRELIMINARY_ASSESSMENT' || dataList?.data.status === 'PRELIMINARY_ASSESSMENT'){
          this.currentStep=2
          this._commonService.setCurrentStep(2)
          
        }
        return dataList?.data
         
        // Handle the dataList as needed
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }
progressBarStatusUpdate(event:any) {
  console.log(event)
    if(event.update === true) {  
       const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');   
      this.getDtataByUrl(APIS.tihclExecutive.registerData + applicationData.registrationUsageId)
      
    }
  }

}


