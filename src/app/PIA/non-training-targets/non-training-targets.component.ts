import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
declare var bootstrap: any;
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { MonthlyRangeComponent } from '../monthly-range/monthly-range.component';

@Component({
  selector: 'app-non-training-targets',
  templateUrl: './non-training-targets.component.html',
  styleUrls: ['./non-training-targets.component.css']
})
export class NonTrainingTargetsComponent implements OnInit {
  financialForm!: FormGroup;
  paymentForm!: FormGroup;
   isSubmitted = false;
  loginsessionDetails: any;
  selectedAgencyId: any;
  @ViewChild(MonthlyRangeComponent) monthlyRange!: MonthlyRangeComponent;
 constructor(private fb: FormBuilder, private toastrService: ToastrService,
      private _commonService: CommonServiceService,
      private router: Router,) {
   this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
     this.selectedAgencyId = this.loginsessionDetails.agencyId;
    this.financialForm = this.createForm();
        this.contingencyForm = this.createFormContingency();
        this.paymentForm = this.createFormPayment();

  }

  ngOnInit(): void {
     this.getBudgetHeadList()
    
  }
   budgetHeadList: any;
    getBudgetHeadList() {
        this._commonService.getDataByUrl(APIS.nontrainingtargets.getBudgetHeadList+this.selectedAgencyId).subscribe((res: any) => {
          this.budgetHeadList = res;
          this.onActivityChange(this.budgetHeadList[0]?.activityId)
        
        }, (error) => {
          // this.toastrService.error(error.message);
        });
      }
      selectedActivity:any
      SubActivityList:any=[]
      onActivityChange(event: any) {
        this.selectedActivity=event
         this._commonService.getDataByUrl(APIS.nontrainingtargets.getSubActivityList+event).subscribe((res: any) => {
          this.SubActivityList = res;
          this.selectedBudgetHead= this.SubActivityList[0]?.subActivityId
          this.onBudgetHeadChange(this.SubActivityList[0]?.subActivityId)
        this.getPreliminaryDataById()
        }, (error) => {
          // this.toastrService.error(error.message);
        });
      }
  selectedBudgetHead: string = '1';
  physicalTargetAchievement: any = '';
  physicalTarget: any = 0;
  financialTarget: any = 0;
  financialTargetAchievement: any = 0;
  onBudgetHeadChange(event: any) {
    this.selectedBudgetHead = event;
    console.log('Selected Budget Head:', this.selectedBudgetHead);
    this.getDeatilOfTargets()
  }
 TargetDetails: any;
    getDeatilOfTargets() {
        this.TargetDetails=[]
        this._commonService.getDataByUrl(APIS.nontrainingtargets.getNonTrainingtargets+this.selectedBudgetHead).subscribe((res: any) => {
          this.TargetDetails = res.data;
          this.physicalTarget = this.TargetDetails?.physicalTarget || 0;
          this.financialTarget = this.TargetDetails?.financialTarget || 0;
          this.physicalTargetAchievement = this.TargetDetails?.physicalTargetAchievement || 0;
          this.financialTargetAchievement = this.TargetDetails?.financialTargetAchievement || 0;
          console.log('TargetDetails:', this.TargetDetails);
          if(this.selectedBudgetHead=='68' || this.selectedBudgetHead=='69' || this.selectedBudgetHead=='71'){
            this.getPreliminaryDataById()

          }
          else if(this.selectedBudgetHead=='72'){
            this.getResourceList()
            this.getContingencyDataById()
            this.getPaymentsDataById()
          }
          else{
            this.getResourceList()
            this.getContingencyDataById()
            this.getPaymentsDataById()
            this.getPreliminaryDataById()
          }

          
        }, (error) => {
          // this.toastrService.error(error.message);
        });
      }
      getPreliminaryDataById(){
        https://metaverseedu.in/workflow/non-training/all/expenditures?nonTrainingActivityId=1
         this._commonService.getDataByUrl(APIS.nontrainingtargets.getNonTrainingtargetsAleapPriliminaryById+this.selectedBudgetHead).subscribe((res: any) => {
            this.getPreliminaryData=res.data;
            this.financialTargetAchievement=0
            this.getPreliminaryData?.map((item:any)=>{
              this.financialTargetAchievement+=Number(item?.expenditureAmount)
            })
        
        }, (error) => {
          // this.toastrService.error(error.message);
        });
      }
      resourceList:any=[]
      getResourceList(){
        this.resourceList=[]
          this._commonService.getDataByUrl(APIS.nontrainingtargets.getResourceList+this.selectedBudgetHead).subscribe((res: any) => {
              this.resourceList=res.data;
             
          
          }, (error) => {
            // this.toastrService.error(error.message);
          });
      }
       getContingencyDataById(){
         this._commonService.getDataByUrl(APIS.nontrainingtargets.getNonTrainingtargetsAleapContingencyId+this.selectedBudgetHead).subscribe((res: any) => {
            this.getContingencyData=res.data;
        
        }, (error) => {
          // this.toastrService.error(error.message);
        });
      }
      getPaymentsData:any=[]
       getPaymentsDataById(){
        this.getPaymentsData=[]
         this._commonService.getDataByUrl(APIS.nontrainingtargets.getNonTrainingtargetsAleapPaymentsId+this.selectedBudgetHead).subscribe((res: any) => {
            this.getPaymentsData=res.data;
            this.financialTargetAchievement=0
              this.getPaymentsData?.map((item:any)=>{
              this.financialTargetAchievement+=Number(item?.amount)
            })
        }, (error) => {
          // this.toastrService.error(error.message);
        });
      }
      viewPaymentData:any=[]
      getViewData(data:any){
        
        this.viewPaymentData=data
        //  this._commonService.getDataByUrl(APIS.nontrainingtargets.getNonTrainingtargetsAleapPaymentsId+id).subscribe((res: any) => {
        //     this.viewPaymentData=res.data;
        
        // }, (error) => {
        //   // this.toastrService.error(error.message);
        // });
      }
      // final submission
      onFinalSubmit(){
        let payload={
          "nonTrainingAchievementId": this.TargetDetails?.nonTrainingAchievementId,
          "nonTrainingActivityId": Number(this.selectedBudgetHead),
          "physicalTarget": Number(this.physicalTarget),
          "physicalTargetAchievement": this.physicalTargetAchievement,
          "financialTarget": Number(this.financialTarget),
          "financialTargetAchievement": Number(this.financialTargetAchievement)
          }
        this._commonService.update(APIS.nontrainingtargets.updateTarets,payload,this.TargetDetails?.nonTrainingAchievementId).subscribe((res: any) => {
            this.toastrService.success('Final Submission Done Successfully','Non Training Progress Data Success!');
            this.getDeatilOfTargets()
        
        }, (error) => {
          this.toastrService.error(error.message,"Non Training Progress Data Error!");
        });
      }
       createForm(): FormGroup {
    return this.fb.group({
      agencyId: [0, ],
      nonTrainingSubActivityId: [0, ],
      nonTrainingActivityId: [0, ],
      paymentDate: ['', Validators.required],
      expenditureAmount: [0, [Validators.required, Validators.min(0)]],
      billNo: ['', Validators.required],
      billDate: ['', Validators.required],
      payeeName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      modeOfPayment: ['', Validators.required],
      transactionId: [''],
      purpose: ['', Validators.required],
      uploadBillUrl: ['']
    });
  }

   modeOfPayment(val:any){
      if(val=='CASH'){
        this.financialForm.get('bank')?.setValidators(null);
        this.financialForm.get('transactionId')?.setValidators(null);
        this.financialForm.get('ifscCode')?.setValidators(null);
        this.financialForm.get('bank')?.patchValue('');
        this.financialForm.get('transactionId')?.patchValue('');
        this.financialForm.get('ifscCode')?.patchValue('');
        this.financialForm.get('bank')?.clearValidators();
        this.financialForm.get('transactionId')?.clearValidators();
        this.financialForm.get('ifscCode')?.clearValidators();
        this.financialForm.get('bank')?.disable();
        this.financialForm.get('transactionId')?.disable();
        this.financialForm.get('ifscCode')?.disable();
      
        this.financialForm.get('bank')?.updateValueAndValidity();
        this.financialForm.get('transactionId')?.updateValueAndValidity();
        this.financialForm.get('ifscCode')?.updateValueAndValidity();
        
      }
      else if(val=='BANK_TRANSFER'){
        this.financialForm.get('bank')?.setValidators([Validators.required]);
        this.financialForm.get('transactionId')?.setValidators(null);
        this.financialForm.get('ifscCode')?.setValidators([Validators.required,Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]);
        this.financialForm.get('bank')?.enable();
        this.financialForm.get('transactionId')?.disable();
        this.financialForm.get('ifscCode')?.enable();
        this.financialForm.get('bank')?.patchValue('');
        this.financialForm.get('transactionId')?.patchValue('');
        this.financialForm.get('ifscCode')?.patchValue('');
        this.financialForm.get('bank')?.updateValueAndValidity();
        this.financialForm.get('transactionId')?.updateValueAndValidity();
        this.financialForm.get('ifscCode')?.updateValueAndValidity();
       
      }
      else if(val=='UPI'){
        this.financialForm.get('bank')?.setValidators(null);
        this.financialForm.get('transactionId')?.setValidators([Validators.required,Validators.pattern(/^[^\s].*/)]);
        this.financialForm.get('ifscCode')?.setValidators(null);
        this.financialForm.get('bank')?.disable();
        this.financialForm.get('transactionId')?.enable();
        this.financialForm.get('ifscCode')?.disable();
        this.financialForm.get('bank')?.patchValue('');
        this.financialForm.get('transactionId')?.patchValue('');
        this.financialForm.get('ifscCode')?.patchValue('');
         
        this.financialForm.get('bank')?.updateValueAndValidity();
        this.financialForm.get('transactionId')?.updateValueAndValidity();
        this.financialForm.get('ifscCode')?.updateValueAndValidity();
       
      }
       else if(val=='CHEQUE'){
        this.financialForm.get('bank')?.setValidators(null);
        this.financialForm.get('transactionId')?.setValidators(null);
        this.financialForm.get('ifscCode')?.setValidators(null);
        this.financialForm.get('bank')?.enable();
        this.financialForm.get('transactionId')?.enable();
        this.financialForm.get('ifscCode')?.enable();
        this.financialForm.get('bank')?.patchValue('');
        this.financialForm.get('transactionId')?.patchValue('');
        this.financialForm.get('ifscCode')?.patchValue('');
        
        this.financialForm.get('bank')?.updateValueAndValidity();
        this.financialForm.get('transactionId')?.updateValueAndValidity();
      
        this.financialForm.get('ifscCode')?.updateValueAndValidity();
      }
    }

  

  get f() {
    return this.financialForm.controls;
  }
  convertToISOFormat(date: string): string {   
  if(date) {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Convert to yyyy-MM-dd format
  }
  else{
    return '';
  }
 
}
  iseditMode = false;
  preliminaryID:any
    // Add this property to track existing files
  existingFileName: string = '';

openModel(mode: string, item?: any): void {
  if (mode === 'add') {
    this.financialForm.reset();
    this.iseditMode = false;
    this.resetForm();
    this.existingFileName = ''; // Clear the existing filename
  }
  if (mode === 'edit') {
    this.preliminaryID = item?.id;
    this.iseditMode = true;
    this.modeOfPaymentIt(item?.modeOfPayment);

    // Create a copy of the form values WITHOUT the file input
    const formValues = {...item};
    
    // Convert dates to ISO format for the date inputs
    if (formValues.paymentDate) formValues.paymentDate = this.convertToISOFormat(formValues.paymentDate);
    if (formValues.billDate) formValues.billDate = this.convertToISOFormat(formValues.billDate);
    
    // Remove the file property to avoid the error
    delete formValues.uploadBillUrl;
    
    // Set form values without the file
    this.financialForm.patchValue(formValues);
    
    // Store the filename separately
    this.existingFileName = item?.uploadBillUrl || '';
  }
  const modal1 = new bootstrap.Modal(document.getElementById('addSurvey'));
  modal1.show();
}

getPreliminaryData:any=[]
  onSubmit(): void {
     this.isSubmitted = true;
      if (this.financialForm.valid) {
     if(this.iseditMode){
        this.f['agencyId'].setValue(Number(this.selectedAgencyId));
         this.f['nonTrainingSubActivityId'].setValue(Number(this.selectedBudgetHead));
         this.f['nonTrainingActivityId'].setValue(Number(this.selectedActivity));

        const formData = {...this.financialForm.value, nonTrainingSubActivityId: Number(this.selectedBudgetHead), id: this.preliminaryID};
        
        // If no new file was selected but we have an existing file, use the existing filename
        if (!this.uploadedFiles && this.existingFileName) {
          formData.uploadBillUrl = this.existingFileName;
        }

         this._commonService.update(
        APIS.nontrainingtargets.updateNonTrainingtargetsAleapPriliminary,
        formData,
        this.preliminaryID
      ).subscribe({
        next: (res: any) => {
          this.toastrService.success('Data Updated successfully', 'Non Training Progress Data Success!');
          this.getPreliminaryDataById();
          this.resetForm();
          this.isSubmitted = false;
          const modalElement = document.getElementById('addSurvey');
          const modal1 = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;
          if (modal1) {
            modal1.hide();
          }
          this.existingFileName = ''; // Reset the filename after successful update
        },
        error: (error) => {
          this.resetForm();
          this.isSubmitted = false;
          const modal1 = bootstrap.Modal.getInstance(document.getElementById('addSurvey'));
          modal1.hide();
          this.toastrService.error(error.message, "Non Training Progress Data Error!");
        }
      });
      
      this.getDeatilOfTargets()
     }
     else{
       console.log('Form Submitted:', this.financialForm.value);
       this.f['agencyId'].setValue(Number(this.selectedAgencyId));
         this.f['nonTrainingSubActivityId'].setValue(Number(this.selectedBudgetHead));
         this.f['nonTrainingActivityId'].setValue(Number(this.selectedActivity));
          const formData = new FormData();
           formData.append("dto", JSON.stringify({...this.financialForm.value}));
 
           if (this.financialForm.value.uploadBillUrl) {
             formData.append("file", this.uploadedFiles);
             }
         this._commonService.add(APIS.nontrainingtargets.saveNonTrainingtargetsCodeIT,formData).subscribe((res: any) => {
           this.toastrService.success('Data saved successfully','Non Training Progress Data Success!');
           this.getPreliminaryData.push(res.data)
           this.getPreliminaryDataById()
           this.resetForm();
           this.isSubmitted = false;
           const modal1 = bootstrap.Modal.getInstance(document.getElementById('addSurvey'));
           modal1.hide();
          
         
         }, (error) => {
           this.resetForm();
           this.isSubmitted = false;
           const modal1 = bootstrap.Modal.getInstance(document.getElementById('addSurvey'));
           modal1.hide();
           this.toastrService.error(error.message);
         });
         this.getDeatilOfTargets()
     }
    
     }
 
   }
  deletePreliminaryID:any
  deletePreliminary(id:any):void{
    this.deletePreliminaryID=id
     const previewModal = document.getElementById('exampleModalDelete');
    if (previewModal) {
      const modalInstance = new bootstrap.Modal(previewModal);
      modalInstance.show();
    }
  }
  ConfirmdeleteExpenditure(item:any){
      this._commonService
      .deleteId(APIS.nontrainingtargets.deleteNonTrainingtargetsAleapPriliminary,item).subscribe({
        next: (data: any) => {
          if(data?.status==400){
            this.toastrService.error(data?.message, "Non Training Progress Data Error!");
            this.closeModalDelete();

            this.deletePreliminaryID =''
          }
          else{
            // this.getBulkExpenditure()
            this.closeModalDelete();
            this.deletePreliminaryID =''
           this.getPreliminaryDataById()

          this.toastrService.success( 'Record Deleted Successfully', "Non Training Progress Data Success!");
          }
          
        },
        error: (err) => {
          this.closeModalDelete();
          this.deletePreliminaryID =''
          this.toastrService.error(err.message, "Non Training Progress Error!");
          new Error(err);
        },
      });

    }
     closeModalDelete(): void {
      const editSessionModal = document.getElementById('exampleModalDelete');
      if (editSessionModal) {
        const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
        modalInstance.hide();
      }
      this.getDeatilOfTargets()
    } 
    uploadedFiles:any
  onFileSelected(event: any): void {
    const file = event.target.files[0];
if (file) {
      this.uploadedFiles = file;
      // Handle file upload logic here
      // You might want to upload the file and then set the URL
      this.financialForm.patchValue({
        uploadBillUrl: file.name // This would be the uploaded file URL
      });
    }
  }
 onFileSelectedPayment(event: any): void {
    this.uploadedFiles = null;
    const file = event.target.files[0];
    if (file) {
       this.uploadedFiles = file;
      // Handle file upload logic here
      // You might want to upload the file and then set the URL
      this.paymentForm.patchValue({
        uploadBillUrl: file.name // This would be the uploaded file URL
      });
    }
  }
  resetForm(): void {
     const modalElement = document.getElementById('addSurvey');
          const modal1 = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;
          if (modal1) {
            modal1.hide();
          }
    this.isSubmitted = false;
  }

  // Contingency fund
   designations = [
    { value: 'CEO', label: 'CEO' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Designer', label: 'Designer' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Analyst', label: 'Analyst' }
  ];
   contingencyForm!: FormGroup;
     createFormContingency(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      designation: ['', Validators.required],
      relevantExperience: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      educationalQualification: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      monthlySal: [0, [Validators.required, Validators.min(0)]],
      bankName: ['', Validators.required],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      accountNo: ['', [Validators.required]]
    });
  }

   modeOfPaymentIt(val:any){
        if(val=='CASH'){
          this.financialForm.get('bankName')?.setValidators(null);
          this.financialForm.get('accountNumber')?.setValidators(null);
          this.financialForm.get('transactionId')?.setValidators(null);
          this.financialForm.get('ifscCode')?.setValidators(null);
          this.financialForm.get('bankName')?.patchValue('');
          this.financialForm.get('accountNumber')?.patchValue('');
          this.financialForm.get('transactionId')?.patchValue('');
          this.financialForm.get('ifscCode')?.patchValue('');
          this.financialForm.get('bankName')?.clearValidators();
          this.financialForm.get('accountNumber')?.clearValidators();
          this.financialForm.get('transactionId')?.clearValidators();
          this.financialForm.get('ifscCode')?.clearValidators();
          this.financialForm.get('bankName')?.disable();
          this.financialForm.get('accountNumber')?.disable();
          this.financialForm.get('transactionId')?.disable();
          this.financialForm.get('ifscCode')?.disable();
        
          this.financialForm.get('bankName')?.updateValueAndValidity();
          this.financialForm.get('accountNumber')?.updateValueAndValidity();
          this.financialForm.get('transactionId')?.updateValueAndValidity();
          this.financialForm.get('ifscCode')?.updateValueAndValidity();
          
        }
        else if(val=='BANK_TRANSFER'){
          this.financialForm.get('bankName')?.setValidators([Validators.required]);
          this.financialForm.get('accountNumber')?.setValidators([Validators.required]);
          this.financialForm.get('transactionId')?.setValidators(null);
          this.financialForm.get('ifscCode')?.setValidators([Validators.required,Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]);
          this.financialForm.get('bankName')?.enable();
          this.financialForm.get('accountNumber')?.enable();
          this.financialForm.get('transactionId')?.disable();
          this.financialForm.get('ifscCode')?.enable();
          this.financialForm.get('bankName')?.patchValue('');
          this.financialForm.get('accountNumber')?.patchValue('');
          this.financialForm.get('transactionId')?.patchValue('');
          this.financialForm.get('ifscCode')?.patchValue('');
          this.financialForm.get('bankName')?.updateValueAndValidity();
          this.financialForm.get('accountNumber')?.updateValueAndValidity();
          this.financialForm.get('transactionId')?.updateValueAndValidity();
          this.financialForm.get('ifscCode')?.updateValueAndValidity();
         
        }
        else if(val=='UPI'){
          this.financialForm.get('bankName')?.setValidators(null);
          this.financialForm.get('accountNumber')?.setValidators(null);
          this.financialForm.get('transactionId')?.setValidators([Validators.required,Validators.pattern(/^[^\s].*/)]);
          this.financialForm.get('ifscCode')?.setValidators(null);
          this.financialForm.get('bankName')?.disable();
          this.financialForm.get('accountNumber')?.disable();
          this.financialForm.get('transactionId')?.enable();
          this.financialForm.get('ifscCode')?.disable();
          this.financialForm.get('bankName')?.patchValue('');
          this.financialForm.get('accountNumber')?.patchValue('');
          this.financialForm.get('transactionId')?.patchValue('');
          this.financialForm.get('ifscCode')?.patchValue('');
           
          this.financialForm.get('bankName')?.updateValueAndValidity();
          this.financialForm.get('accountNumber')?.updateValueAndValidity();
          this.financialForm.get('transactionId')?.updateValueAndValidity();
          this.financialForm.get('ifscCode')?.updateValueAndValidity();
         
        }
         else if(val=='CHEQUE'){
          this.financialForm.get('bankName')?.setValidators(null);
          this.financialForm.get('accountNumber')?.setValidators(null);
          this.financialForm.get('transactionId')?.setValidators(null);
          this.financialForm.get('ifscCode')?.setValidators(Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/));
          this.financialForm.get('bankName')?.enable();
          this.financialForm.get('accountNumber')?.enable();
          this.financialForm.get('transactionId')?.enable();
          this.financialForm.get('ifscCode')?.enable();
          this.financialForm.get('bankName')?.patchValue('');
          this.financialForm.get('accountNumber')?.patchValue('');
          this.financialForm.get('transactionId')?.patchValue('');
          this.financialForm.get('ifscCode')?.patchValue('');
          
          this.financialForm.get('bankName')?.updateValueAndValidity();
          this.financialForm.get('accountNumber')?.updateValueAndValidity();
          this.financialForm.get('transactionId')?.updateValueAndValidity();
        
          this.financialForm.get('ifscCode')?.updateValueAndValidity();
        }
      }

  get fContingency() {
    return this.contingencyForm.controls;
  }


  resetFormContingency(): void {
     const modalElement = document.getElementById('addContingency');
          const modal1 = modalElement ? bootstrap.Modal.getInstance(modalElement) : null;
          if (modal1) {
            modal1.hide();
          }
    this.isSubmitted = false;
  }

  // Helper method to format currency input
  formatCurrency(event: any, field: string): void {
    const value = event.target.value.replace(/[^\d]/g, '');
    this.contingencyForm.patchValue({
      [field]: value ? parseInt(value) : 0
    });
  }
   iseditModeContingency = false;
  ContingencyID:any
  openModelContingency(mode: string,item?: any): void {
    if (mode === 'add') {
      this.iseditModeContingency = false;
      this.resetFormContingency();
      this.contingencyForm.reset();
    }
    if (mode === 'edit') {
      this.ContingencyID=item?.resourceId
      this.iseditModeContingency = true;
      this.contingencyForm.patchValue({
        name: item?.name || '',
        designation: item?.designation || '',
        relevantExperience: item?.relevantExperience || 0,
        educationalQualification: item?.educationalQualification || '',
        dateOfJoining: item?.dateOfJoining ? this.convertToISOFormat(item.dateOfJoining) : '',
        monthlySal: item?.monthlySal || 0,
        bankName: item?.bankName || '',
        ifscCode: item?.ifscCode || '',
        accountNo: item?.accountNo || ''
      });
    }
    const modal1 = new bootstrap.Modal(document.getElementById('addContingency'));
    modal1.show();
  }
  getContingencyData:any=[]
   onSubmitContingency(): void {
      this.isSubmitted = true;
       if (this.contingencyForm.valid) {
      if(this.iseditModeContingency){
         
          this._commonService.update(APIS.nontrainingtargets.updateNonTrainingtargetsAleapContingency,{...this.contingencyForm.value,"expenditures":[],nonTrainingActivityId:Number(this.selectedActivity),nonTrainingSubActivityId:Number(this.selectedBudgetHead),dateOfJoining:this.contingencyForm?.value?.dateOfJoining?moment(this.contingencyForm?.value?.dateOfJoining).format('DD-MM-YYYY'):null},this.ContingencyID).subscribe((res: any) => {
            this.toastrService.success('Data Updated successfully','Non Training Progress Data Success!');
            
            console.log('Preliminary Data:', this.getContingencyData);
            this.resetFormContingency();
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addContingency'));
            modal1.hide();
          
          }, (error) => {
             this.resetFormContingency();
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addContingency'));
            modal1.hide();
            this.toastrService.error(error.message,"Non Training Progress Data Error!");
          });
      }
      else{
        console.log('Form Submitted:', this.contingencyForm.value);
          this._commonService.add(APIS.nontrainingtargets.saveNonTrainingtargetsAleapContingency,{...this.contingencyForm.value,"expenditures":[],nonTrainingActivityId:Number(this.selectedActivity),nonTrainingSubActivityId:Number(this.selectedBudgetHead),dateOfJoining:this.contingencyForm?.value?.dateOfJoining?moment(this.contingencyForm?.value?.dateOfJoining).format('DD-MM-YYYY'):null}).subscribe((res: any) => {
            this.toastrService.success('Data saved successfully','Non Training Progress Data Success!');
            this.resetFormContingency();
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addContingency'));
            modal1.hide();
           
          
          }, (error) => {
            this.resetFormContingency();
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addContingency'));
            modal1.hide();
            this.toastrService.error(error.message);
          });
      }
     this.getDeatilOfTargets()
        }
  
    }
  deleteContingencyID:any
  deleteContingency(id:any):void{
    this.deleteContingencyID=id
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
     const previewModal = document.getElementById('exampleModalDeleteContinuty');
     const modalInstance = new bootstrap.Modal(previewModal);
      modalInstance.show();
  }
  ConfirmdeleteContingency(item:any){
      this._commonService
      .deleteId(APIS.nontrainingtargets.deleteNonTrainingtargetsAleapContingency,item).subscribe({
        next: (data: any) => {
          if(data?.status==400){
            this.toastrService.error(data?.message, "Non Training Progress Data Error!");
            this.closeModalDeleteContinuty();
            this.deleteContingencyID =''
          }
          else{
            // this.getBulkExpenditure()
            
          this.toastrService.success( 'Record Deleted Successfully', "Non Training Progress Data Success!");
          this.closeModalDeleteContinuty();
            this.deleteContingencyID =''
          }
          
        },
        error: (err) => {
          this.toastrService.error(err.message, "Non Training Progress Error!");
          this.closeModalDeleteContinuty();
          this.deleteContingencyID =''
          
          new Error(err);
        },
      });
      this.getDeatilOfTargets()

    }
  closeModalDeleteContinuty(): void {
      const editSessionModal = document.getElementById('exampleModalDeleteContinuty');
      if (editSessionModal) {
        const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
        modalInstance.hide();
      }
    }

// paymenr 
  iseditModePayment = false;
  paymentID:any
  openModelPayment(mode: string,item?: any): void {
    this.paymentID=''
    if (mode === 'add') {
      this.iseditModePayment = false;
      this.paymentForm.reset();
      this.isSubmitted = false;
      this.paymentForMonth = ''; // Clear the payment month for add mode
       setTimeout(() => {
       this.monthlyRange.setValue('08-2025');
      }, 0);
    }
    if (mode === 'edit') {

      this.paymentID=item?.nonTrainingResourceExpenditureId
      this.iseditModePayment = true;
      // Set the paymentForMonth value from response - this will trigger the monthly-range component update
      this.paymentForMonth = item?.paymentForMonth || '';
      
      // Use setTimeout to ensure the monthly-range component is available
      setTimeout(() => {
        if (this.monthlyRange && item?.paymentForMonth) {
          this.monthlyRange.setValue(item.paymentForMonth);
        }
      }, 0);
      
      this.paymentForm.patchValue({
        amount: item?.amount || 0,
        paymentForMonth: item?.paymentForMonth || '',
        dateOfPayment: item?.dateOfPayment ? this.convertToISOFormat(item?.dateOfPayment) : '',
        resourceId: item?.resourceId || 0,
        bankName: item?.bankName || '',
        ifscCode: item?.ifscCode || '',
        accountNo: item?.accountNo || ''
       
      });
    }
    this.onResourceChange(item?.resourceId,this.resourceList)
    const modal1 = new bootstrap.Modal(document.getElementById('addPayment'));
    modal1.show();
  }
  onResourceChange(event:any,list:any){
    console.log('Selected Resource ID:', list);
    const selectedResource = list.find((item: any) => item.resourceId == event);
    console.log('Selected Resource:', selectedResource);
    if(selectedResource){
      this.paymentForm.patchValue({
        bankName: selectedResource?.bankName || '',
        ifscCode: selectedResource?.ifscCode || '',
        accountNo: selectedResource?.accountNo || ''
      });
    }
  }
    createFormPayment(): FormGroup {
    return this.fb.group({
      amount: [0, [Validators.required, Validators.min(0), Validators.max(10000000)]],
      paymentForMonth: ['08-2025',],
      dateOfPayment: ['', Validators.required],
      resourceId: [0, [Validators.required,]],
      bankName: ['',],
      ifscCode: ['', ],
      accountNo: ['', ]
    });
  }

  get fPayment() {
    return this.paymentForm.controls;
  }
  paymentForMonth: any = "08-2025";
  onChangeDate(event:any){
    console.log(event,event.value,moment(event.value).format('MM-YYYY'));
    this.paymentForm.patchValue({paymentForMonth: moment(event.value).format('MM-YYYY')
    });
   this.paymentForMonth= event.value ? moment(event.value).format('MM-YYYY') : '';
  }
  onSubmitPayment(): void {
      this.isSubmitted = true;
      console.log(this.paymentForm.value);
      if (this.paymentForm.valid) {
        
         if(this.iseditModePayment){
          const formData: any = {
          nonTrainingResourceExpenditureId: 0, // Generated by backend
          amount: this.paymentForm.value.amount,
          paymentForMonth: this.paymentForm.value.paymentForMonth,
          dateOfPayment: this.paymentForm.value.dateOfPayment,
          uploadBillUrl: this.paymentForm.value.uploadBillUrl,
          resourceId: Number(this.paymentForm.value.resourceId)
        };
          this._commonService.update(APIS.nontrainingtargets.updateNonTrainingtargetsAleapContingencyPayment,{...formData},this.paymentID).subscribe((res: any) => {
            this.toastrService.success('payments Updated successfully','Non Training Progress Data Success!');
            
            console.log('Preliminary Data:', this.getContingencyData);
            
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addPayment'));
            modal1.hide();
             document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          
          }, (error) => {
            //  this.resetForm();
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addPayment'));
            modal1.hide();
             document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            this.toastrService.error(error.message,"Non Training Progress Data Error!");
          });
      }
      else{
        console.log('Form Submitted:', this.contingencyForm.value);
        const formData = new FormData();
            formData.append("expenditureDto", JSON.stringify({
            nonTrainingResourceExpenditureId: 0, // Generated by backend
          amount: this.paymentForm.value.amount,
          paymentForMonth: this.paymentForm.value.paymentForMonth,
          dateOfPayment: this.paymentForm.value.dateOfPayment,
          resourceId: Number(this.paymentForm.value.resourceId)}));
  
            if (this.paymentForm.value.billInvoicePath) {
              formData.append("file", this.uploadedFiles);
              }
          this._commonService.add(APIS.nontrainingtargets.saveNonTrainingtargetsAleapContingencyPayment,formData).subscribe((res: any) => {
            this.toastrService.success('Payments saved successfully','Non Training Progress Data Success!');
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addPayment'));
            modal1.hide();
             document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
           
          
          }, (error) => {
         
            this.isSubmitted = false;
            const modal1 = bootstrap.Modal.getInstance(document.getElementById('addPayment'));
            modal1.hide();
             document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            this.toastrService.error(error.message);
          });
      }
     
        this.getDeatilOfTargets()
        // console.log('Form Data:', formData);
        // Call your API service here
        // this.paymentService.createPayment(formData).subscribe(...);
        
      
      }
    }
  deletePayment(id:any):void{
    this.deleteContingencyID=id
     document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
     const previewModal = document.getElementById('exampleModalDeletePayment');
    if (previewModal) {
      const modalInstance = new bootstrap.Modal(previewModal);
      modalInstance.show();

    }
  }
  ConfirmdeletePayment(item:any){
      this._commonService
      .deleteId(APIS.nontrainingtargets.deleteNonTrainingtargetsAleapContingencyPayment,item).subscribe({
        next: (data: any) => {
          if(data?.status==400){
            this.toastrService.error(data?.message, "Non Training Progress Data Error!");
            this.closeModalDeletePayment();
            
            this.deleteContingencyID =''
          }
          else{
            // this.getBulkExpenditure()
            this.closeModalDeletePayment();
            this.deleteContingencyID =''
          this.toastrService.success( 'Record Deleted Successfully', "Non Training Progress Data Success!");
          }
          
        },
        error: (err) => {
          this.closeModalDeletePayment();
          this.deleteContingencyID =''
          this.toastrService.error(err.message, "Non Training Progress Error!");
          new Error(err);
        },
      });
      this.getDeatilOfTargets()

    }
    closeModalDeletePayment(): void {  
      const editSessionModal = document.getElementById('exampleModalDeletePayment');
      if (editSessionModal) {
        const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
        modalInstance.hide();   
       }
      }
       dataTable: any;
        reinitializeDataTableBulk() {
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        setTimeout(() => {
          this.initializeDataTableBulk();
        }, 0);
      }
    
      initializeDataTableBulk() {
        this.dataTable = new DataTable('#view-Priliminary', {
          // scrollX: true,
          // scrollCollapse: true,    
          // responsive: true,    
          // paging: true,
          // searching: true,
          // ordering: true,
          scrollY: "415px",
          scrollX: true,
          scrollCollapse: true,
          autoWidth: true,
          paging: true,
          info: false,
          searching: false,
          destroy: true, // Ensure reinitialization doesn't cause issues
        });
      }

    
}
