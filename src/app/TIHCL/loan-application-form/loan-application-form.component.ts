import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var bootstrap: any;
declare var $: any;
@Component({
  selector: 'app-loan-application-form',
  templateUrl: './loan-application-form.component.html',
  styleUrls: ['./loan-application-form.component.css']
})
export class LoanApplicationFormComponent implements OnInit {

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  constructor(private toastrService: ToastrService, private router: Router) { }

  ngOnInit(): void {
    var currentStep = 1;
    var updateProgressBar = function() {
      var progressPercentage = ((currentStep - 1) / 2) * 100;
      $(".progress-bar").css("width", progressPercentage + "%");
    }

    $(document).ready(function() {
      $('#multi-step-form').find('.step').slice(1).hide();
  
      $(".next-step").click(function() {
      if (currentStep < 3) {
          $(".step-" + currentStep).addClass("animate__animated animate__fadeIn");
          currentStep++;
          setTimeout(function() {
          $(".step").removeClass("animate__animated animate__fadeIn").hide();
          $(".step-" + currentStep).show().addClass("animate__animated animate__fadeIn");
          updateProgressBar();
          }, 500);
      }
      });

      $(".prev-step").click(function() {
      if (currentStep > 1) {
          $(".step-" + currentStep).addClass("animate__animated animate__fadeIn");
          currentStep--;
          setTimeout(function() {
          $(".step").removeClass("animate__animated animate__fadeIn").hide();
          $(".step-" + currentStep).show().addClass("animate__animated animate__fadeIn");
          updateProgressBar();
          }, 500);
      }
      });

      updateProgressBar = function() {
      var progressPercentage = ((currentStep - 1) / 2) * 100;
      $(".progress-bar").css("width", progressPercentage + "%");
      }
  });
 
  }

  submitForm(){
    this.toastrService.success('Application Form submitted successfully!');
  }

  logout() {
    this.router.navigate(['/login']);
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

  validateEnterpriseCategory(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'Medium' || selectedValue === 'Large') {
      const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
      modal.show();      
    }
  }

  validateNatureOfActivity(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'Services' || selectedValue === 'Trading') {
      const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
      modal.show();
    }
  }

  showApplicationMenu:boolean = false;
  showApplicationStatus(value: string): void {
    if (value === 'yes') {
      this.showApplicationMenu = true;
    } else {
      this.showApplicationMenu = false;
    }
  }

  currentApplicationStatus: string = 'APPLICATION_SUBMITTED';

  readonly STATUS_ORDER: string[] = [
    'APPLICATION_SUBMITTED',
    'PRELIMINARY_ASSESSMENT',
    'PENDING_MANAGER_APPROVAL_1',
    'MANAGER_APPROVAL_1',
    'MANAGER_REVERIFY_1',
    'REJECTED_MANAGER_APPROVAL_1',
    'UNIT_VISIT',
    'DIAGNOSTIC_REPORT',
    'PENDING_MANAGER_APPROVAL_2',
    'MANAGER_APPROVAL_2',
    'MANAGER_REVERIFY_2',
    'REJECTED_MANAGER_APPROVAL_2',
    'PENDING_DIC_CONSENT_APPROVAL',
    'DIC_CONSENT_APPROVAL',
    'DIC_REJECT',
    'CREDIT_APPRAISAL',
    'PRIMARY_LENDER_NOC',
    'SANCTION_LETTER_UPLOAD',
    'LOAN_SANCTIONED',
    'PENDING_MANAGER_APPROVAL_3',
    'MANAGER_APPROVAL_3',
    'MANAGER_REVERIFY_3',
    'REJECTED_MANAGER_APPROVAL_3',
    'DISBURSEMENT_PENDING',
    'DISBURSEMENT_PARTIAL',
    'DISBURSEMENT_COMPLETED',
    'LOAN_REPAYMENT_REGULAR',
    'LOAN_REPAYMENT_DUE',
    'LOAN_REPAYMENT_COMPLETED',
    'DIC_APPROVAL',
  ];

  readonly APPLICATION_STATUS_LABELS: Record<string, string> = {
    APPLICATION_SUBMITTED: 'Application Submitted',
    PRELIMINARY_ASSESSMENT: 'Preliminary Assessment',
    PENDING_MANAGER_APPROVAL_1: 'Pending Manager Approval',
    MANAGER_APPROVAL_1: 'Manager Approved (Level 1)',
    MANAGER_REVERIFY_1: 'Manager Re-verification (Level 1)',
    REJECTED_MANAGER_APPROVAL_1: 'Rejected by Manager (Level 1)',
    UNIT_VISIT: 'Unit Visit',
    DIAGNOSTIC_REPORT: 'Diagnostic Report',
    PENDING_MANAGER_APPROVAL_2: 'Pending Manager Approval (Level 2)',
    MANAGER_APPROVAL_2: 'Manager Approved (Level 2)',
    MANAGER_REVERIFY_2: 'Manager Re-verification (Level 2)',
    REJECTED_MANAGER_APPROVAL_2: 'Rejected by Manager (Level 2)',
    PENDING_DIC_CONSENT_APPROVAL: 'Pending DIC Consent',
    DIC_CONSENT_APPROVAL: 'DIC Consent Approved',
    DIC_REJECT: 'DIC Rejected',
    CREDIT_APPRAISAL: 'Credit Appraisal',
    PRIMARY_LENDER_NOC: 'Primary Lender NOC',
    SANCTION_LETTER_UPLOAD: 'Sanction Letter Upload',
    LOAN_SANCTIONED: 'Loan Sanctioned',
    PENDING_MANAGER_APPROVAL_3: 'Pending Manager Approval (Level 3)',
    MANAGER_APPROVAL_3: 'Manager Approved (Level 3)',
    MANAGER_REVERIFY_3: 'Manager Re-verification (Level 3)',
    REJECTED_MANAGER_APPROVAL_3: 'Rejected by Manager (Level 3)',
    DISBURSEMENT_PENDING: 'Disbursement Pending',
    DISBURSEMENT_PARTIAL: 'Partial Disbursement',
    DISBURSEMENT_COMPLETED: 'Disbursement Completed',
    LOAN_REPAYMENT_REGULAR: 'Loan Repayment - Regular',
    LOAN_REPAYMENT_DUE: 'Loan Repayment Due',
    LOAN_REPAYMENT_COMPLETED: 'Loan Repayment Completed',
    DIC_APPROVAL: 'DIC Approval',
  };

  readonly STATUS_STAGES: { label: string; statuses: string[] }[] = [
    { label: 'Application Submitted', statuses: ['APPLICATION_SUBMITTED'] },
    { label: 'Preliminary Assessment', statuses: ['PRELIMINARY_ASSESSMENT'] },
    { label: 'Manager Approval (Level 1)', statuses: ['PENDING_MANAGER_APPROVAL_1', 'MANAGER_APPROVAL_1', 'MANAGER_REVERIFY_1', 'REJECTED_MANAGER_APPROVAL_1'] },
    { label: 'Unit Visit', statuses: ['UNIT_VISIT'] },
    { label: 'Diagnostic Report', statuses: ['DIAGNOSTIC_REPORT'] },
    { label: 'Manager Approval (Level 2)', statuses: ['PENDING_MANAGER_APPROVAL_2', 'MANAGER_APPROVAL_2', 'MANAGER_REVERIFY_2', 'REJECTED_MANAGER_APPROVAL_2'] },
    { label: 'DIC Consent', statuses: ['PENDING_DIC_CONSENT_APPROVAL', 'DIC_CONSENT_APPROVAL', 'DIC_REJECT'] },
    { label: 'Credit Appraisal', statuses: ['CREDIT_APPRAISAL'] },
    { label: 'Primary Lender NOC', statuses: ['PRIMARY_LENDER_NOC'] },
    { label: 'Sanction Letter Upload', statuses: ['SANCTION_LETTER_UPLOAD'] },
    { label: 'Loan Sanctioned', statuses: ['LOAN_SANCTIONED'] },
    { label: 'Manager Approval (Level 3)', statuses: ['PENDING_MANAGER_APPROVAL_3', 'MANAGER_APPROVAL_3', 'MANAGER_REVERIFY_3', 'REJECTED_MANAGER_APPROVAL_3'] },
    { label: 'Disbursement', statuses: ['DISBURSEMENT_PENDING', 'DISBURSEMENT_PARTIAL', 'DISBURSEMENT_COMPLETED'] },
    { label: 'Loan Repayment', statuses: ['LOAN_REPAYMENT_REGULAR', 'LOAN_REPAYMENT_DUE', 'LOAN_REPAYMENT_COMPLETED'] },
    { label: 'DIC Approval', statuses: ['DIC_APPROVAL'] },
  ];

  get currentStatusLabel(): string {
    return this.APPLICATION_STATUS_LABELS[this.currentApplicationStatus] || this.currentApplicationStatus;
  }

  getStageClass(stage: { label: string; statuses: string[] }): string {
    const currentIdx = this.STATUS_ORDER.indexOf(this.currentApplicationStatus);
    const stageIndices = stage.statuses.map(s => this.STATUS_ORDER.indexOf(s));
    const maxStageIdx = Math.max(...stageIndices);
    const minStageIdx = Math.min(...stageIndices);
    if (currentIdx > maxStageIdx) return 'step done';
    if (currentIdx >= minStageIdx && currentIdx <= maxStageIdx) return 'step editing';
    return 'step';
  }

  investmentBorrower: boolean = false;
  investmentChange(event: any): void {
    const selectedValue = event;
    if (selectedValue === 'YES') {
      this.investmentBorrower = true;
    } else {
      this.investmentBorrower = false;
    }
  }

  operationalStatus: any;
  operationalChange(event: any): void {
    const selectedValue = event;
    if (selectedValue === 'YES') {
      this.operationalStatus = true;
    } else {
      this.operationalStatus = false;
    }
  }

  existingStatus: any;
  existingChange(event: any): void {
    const selectedValue = event;
    if (selectedValue === 'YES') {
      this.existingStatus = true;
    } else {
      this.existingStatus = false;
    }
  }

}
