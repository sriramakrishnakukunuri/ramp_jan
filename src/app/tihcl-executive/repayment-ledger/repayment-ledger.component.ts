import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIS } from '../../constants/constants';
import { CommonServiceService } from '@app/_services/common-service.service';

declare var bootstrap: any;

@Component({
  selector: 'app-repayment-ledger',
  templateUrl: './repayment-ledger.component.html',
  styleUrls: ['./repayment-ledger.component.css']
})
export class RepaymentLedgerComponent implements OnInit {
  
  // Existing properties
  enterpriseList: any[] = [];
  filteredEnterprise: any[] = [];
  repaymentLedgerList: any = [];
  loanApplicationNo: string = '';
  selectedApplicationData: any = null;
   today:any= this._commonService.getDate();
  // Form properties
  ledgerForm: FormGroup;
  isSubmitting: boolean = false;
  
  // Modal instance
  private modalInstance: any;
  private modalInstancePaymnets: any;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService
  ) {
    this.ledgerForm = this.createLedgerForm();
  }

  ngOnInit(): void {
    this.loadEnterpriseList();
    this.initializeModal();
    this.initializeModalPayments();
  }

  createLedgerForm(): FormGroup {
    return this.fb.group({
      // ledgerDataId: [0],
      transactionDate: ['', Validators.required],
      chargesNarration: ['', ],
      chargesAmount: [0, [Validators.required, Validators.min(0)]],
      interestNarration: ['', ],
      interestAmount: [0, [Validators.required, Validators.min(0)]],
      principalNarration: ['', ],
      principalAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  initializeModal(): void {
    const modalElement = document.getElementById('ledgerReceivablesModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      
      // Reset form when modal is hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
        this.isSubmitting = false;
      });
    }
  }
  initializeModalPayments(): void {
    const modalElement = document.getElementById('ledgerPayablesModal');
    if (modalElement) {
      this.modalInstancePaymnets = new bootstrap.Modal(modalElement);
      
      // Reset form when modal is hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
        this.isSubmitting = false;
      });
    }
  }
  loadEnterpriseList(): void {
    // Replace with your actual API call to load enterprise list
    this._commonService.getDataByUrl(APIS.sanctionedAmount.getNewAppStatus).subscribe({
      next: (response:any) => {
        this.enterpriseList = response?.data || [];
        this.filteredEnterprise = [...this.enterpriseList];
        this.loanApplicationNo=response?.data[0]?.applicationNo || '';
        this.selectedApplicationData = this.enterpriseList[0] || null;
        this.loadRepaymentData(this.loanApplicationNo);
      },
      error: (error:any) => {
        console.error('Error loading enterprise list:', error);
        this.toastrService.error('Failed to load applications');
      }
    });
  }

  onApplicationNoChange(applicationNo: string): void {
    this.loanApplicationNo = applicationNo;
    this.selectedApplicationData = this.enterpriseList.find(
      app => app.applicationNo === applicationNo
    );
    
    // Load repayment data for selected application
    this.loadRepaymentData(applicationNo);
  }

  loadRepaymentData(applicationNo: string): void {
    if (!applicationNo) return;
    
    this._commonService.getDataByUrl(`${APIS.tihclExecutive.getRepaymentData}${applicationNo}`).subscribe({
      next: (response:any) => {
        this.repaymentLedgerList = response || [];
      },
      error: (error:any) => {
        console.error('Error loading repayment data:', error);
        this.toastrService.error('Failed to load repayment data');
      }
    });
  }

  onSubmit(): void {
    if (this.ledgerForm.invalid) {
      this.ledgerForm.markAllAsTouched();
      this.toastrService.error("Please fill all required fields");
      return;
    }

    if (!this.loanApplicationNo) {
      this.toastrService.error("Please select an application first");
      return;
    }

    this.isSubmitting = true;
    
    const payload = {
      ...this.ledgerForm.value,
      // ledgerDataId: this.loanApplicationNo || 0,
      applicationNo: this.loanApplicationNo,
      registrationId: this.selectedApplicationData?.registrationId || this.selectedApplicationData?.registrationUsageId
    };

    this._commonService.add(APIS.tihclExecutive.saveLedgerReceivables, payload).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        this.toastrService.success("Receivable saved successfully");
        
        // Close modal
        this.modalInstance.hide();
        
        // Refresh the repayment data
        this.loadRepaymentData(this.loanApplicationNo);
        
        // Reset form
        this.resetForm();
      },
      error: (error:any) => {
        
        this.isSubmitting = false;
        this.toastrService.error(error?.error?.message || "Failed to save receivable");
        console.error('Error saving receivable:', error);
      }
    });
  }
 onSubmitPayables(): void {
    if (this.ledgerForm.invalid) {
      this.ledgerForm.markAllAsTouched();
      this.toastrService.error("Please fill all required fields");
      return;
    }

    if (!this.loanApplicationNo) {
      this.toastrService.error("Please select an application first");
      return;
    }

    this.isSubmitting = true;
    
    const payload = {
      ...this.ledgerForm.value,
      // ledgerDataId: this.loanApplicationNo || 0,
      applicationNo: this.loanApplicationNo,
      registrationId: this.selectedApplicationData?.registrationId || this.selectedApplicationData?.registrationUsageId
    };

    this._commonService.add(APIS.tihclExecutive.saveLedgerpayments, payload).subscribe({
      next: (response:any) => {
        this.isSubmitting = false;
        this.toastrService.success("payments saved successfully");
        
        // Close modal
        this.modalInstancePaymnets.hide();
        
        // Refresh the repayment data
        this.loadRepaymentData(this.loanApplicationNo);
        
        // Reset form
        this.resetForm();
      },
      error: (error:any) => {
        this.isSubmitting = false;
        this.toastrService.error(error?.error?.message || "Failed to save payments");
        console.error('Error saving payments:', error);
      }
    });
  }
  resetForm(): void {
    this.ledgerForm.reset();
    this.ledgerForm.patchValue({
      // ledgerDataId: 0,
      chargesAmount: 0,
      interestAmount: 0,
      principalAmount: 0,
      transactionDate: ''
    });
    this.ledgerForm.markAsUntouched();
  }

  // Getter for easy access to form controls
  get f() {
    return this.ledgerForm.controls;
  }

  // Method to open modal programmatically if needed
  openModal(): void {
    if (!this.loanApplicationNo) {
      this.toastrService.warning("Please select an application first");
      return;
    }
    this.modalInstance.show();
  }
}