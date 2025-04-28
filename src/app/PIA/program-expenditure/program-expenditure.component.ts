import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var bootstrap: any;
@Component({
  selector: 'app-program-expenditure',
  templateUrl: './program-expenditure.component.html',
  styleUrls: ['./program-expenditure.component.css']
})
export class ProgramExpenditureComponent implements OnInit {

  agencyId: any
  expenditureType:any='PRE'
  constructor(
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
  ) {
    this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
  }

  ngOnInit(): void {
    this.getHeadOfExpenditure()
    this.getAllActivityList()
    this.getProgramTypeData();
    this.onAgencyChange()
    this.formDetails()
    this.formDetailsPre()
    this.formDetailsBulk()
    
   
    this.programCreationMain.controls['activityId'].valueChanges.subscribe((activityId: any) => {
      if (activityId) this.getSubActivitiesList(activityId);
    });
  }

  get f2() {
    return this.programCreationMain.controls;
  }
  get fPre() {
    return this.PrePostExpenditureForm.controls;
  }
  get fBulk() {
    return this.BulkExpenditureForm.controls;
  }
  @ViewChild('preEventModal') preEventModal!: ElementRef;
  @ViewChild('BulkEvenModal') BulkEvenModal!: ElementRef;
  activityList: any
  subActivitiesList: any
  programCreationMain!: FormGroup;
  BulkExpenditureForm!: FormGroup;
  PrePostExpenditureForm!: FormGroup;
  ExpenditureData:any=[]
  getHeadOfExpenditure() {
    this._commonService.getDataByUrl(APIS.programExpenditure.getHeadOfExpenditure).subscribe({
      next: (data: any) => {
        this.ExpenditureData = data;
      },
      error: (err: any) => {
        this.ExpenditureData = [];
      }
    })
  }
  programData:any={}
  getProgramDetailsById(ProgrmId:any){
    this.programData=[]
    if(this.expenditureType=='Bulk'){
      this.TotalAmount=0
      // this.getBulkExpenditure()
      this.getExpenditure()
    }
    else{
      this.TotalAmount=0
      this.getExpenditure()
      // this.getBulkExpenditure()
    }
    
    
    if(ProgrmId){
      this._commonService.getById(APIS.programCreation.getSingleProgramsList, ProgrmId)?.subscribe({
        next: (data: any) => {
         if(data?.data){
           this.programData = data?.data;
          //  this.getSubActivitiesList(this.programData.activityId)
           this.programCreationMain.get('activityId')?.setValue(this.programData?.activityId)
           
         
         }
         
          
        },
        error: (err: any) => {
          this.toastrService.error(err.message, "Error fetching program details!");
        }
      });
    }
   
  }

  getAllActivityList() {
    this.subActivitiesList = []
    this._commonService.getById(APIS.programCreation.getActivityListbyId, this.agencyId).subscribe({
      next: (data: any) => {
        this.activityList = data.data;
      },
      error: (err: any) => {
        this.activityList = [];
      }
    })
  }

  getSubActivitiesList(activityId: any) {
    this._commonService.getDataByUrl(`${APIS.programCreation.getSubActivityListByActivity + '/' + activityId}`).subscribe({
      next: (data: any) => {
        this.subActivitiesList = data.data.subActivities;
        if(this.programData?.subActivityId){
          this.programCreationMain.get('subActivityId')?.setValue(this.programData?.subActivityId)
        }
      },
      error: (err: any) => {
        this.subActivitiesList = [];
      }
    })
  }
 // Load Programs
 programs:any
 onAgencyChange(): void {
  this.programs = [];
  if (this.agencyId) {
    this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency}/${this.agencyId}`).subscribe({
      next: (data: any) => {
        this.programs = data.data;
      },
      error: (err) => {
        console.error('Error loading programs:', err);
      }
    });
  }
}
  formDetails() {
    this.programCreationMain = new FormGroup({
      activityId: new FormControl("", [Validators.required]),
      subActivityId: new FormControl("", [Validators.required]),
      programId: new FormControl("", [Validators.required]),
      expenditureType: new FormControl("PRE", [Validators.required]),
    })
  }
  formDetailsPre() {
    // {

    //   "activityId": 1,
    //   "subActivityId": 2,
    //   "programId": 1,
    //   "agencyId": 1,
    //   "expenditureType": "POST",
    //   "headOfExpenseId": 3,
    //   "cost": 15000.75,
    //   "billNo": 12345,
    //   "billDate": "2025-04-15",
    //   "payeeName": "ABC Constructions",
    //   "bankName": "State Bank of India",
    //   "ifscCode": "SBIN0001234",
    //   "modeOfPayment": "BANK_TRANSFER",
    //   "purpose": "Infrastructure Development",
    //   "uploadBillUrl": "https://example.com/uploads/bill12345.pdf"
    // }
    this.PrePostExpenditureForm = new FormGroup({
      headOfExpenseId: new FormControl("", [Validators.required]),
      billNo: new FormControl("", [Validators.required]),
      cost: new FormControl("", [Validators.required]),
      billDate: new FormControl("", [Validators.required]),
      payeeName: new FormControl("", [Validators.required]),
      bankName: new FormControl("", [Validators.required]),
      ifscCode: new FormControl("", [Validators.required]),
      modeOfPayment: new FormControl("", [Validators.required]),
      purpose: new FormControl("", ),
      uploadBillUrl: new FormControl("", ),
    })
  }
  formDetailsBulk() {
    this.BulkExpenditureForm = new FormGroup({
      itemName: new FormControl("", [Validators.required]),
      purchaseDate: new FormControl("",),
      purchasedQuantity: new FormControl("",),
      headOfExpenseId: new FormControl("",[Validators.required]),
      unitCost: new FormControl("",),
      bulkExpenditureId: new FormControl("",),
      availableQuantity: new FormControl("", ),
      consumedQuantityFromBulk: new FormControl("", ),
      consumedQuantity: new FormControl("", [Validators.required]),
      allocatedCost: new FormControl("", ),
    })
  }
  ChangeexpenditureType(event:any,val:any){
    this.expenditureType=val
    if(val=='Bulk'){
      this.TotalAmount=0
      // this.getBulkExpenditure()
      this.getExpenditure()
    }
    else{
      this.TotalAmount=0
      // this.getBulkExpenditure()
      this.getExpenditure()
    }
  }
  getProgramType: any = [];
  getProgramTypeData() {
    this._commonService.getById(APIS.programCreation.getProgramType, this.agencyId)
      .subscribe({
        next: (data: any) => {
          this.getProgramType = data.data;
        },
        error: (err: any) => {
          new Error(err);
        },
      });
  }
  GetItemsData:any
  getHeadOfExpenseId(val:any){
    this.GetItemsData=[]
    if(val){
      this._commonService.getDataByUrl(APIS.programExpenditure.getItemByExpenses+'='+val,)?.subscribe({
        next: (data: any) => {
         if(data){
           this.GetItemsData = data;
         }
        },
        error: (err: any) => {
          this.toastrService.error(err.message, "Error fetching program details!");
        }
      });
    }
  }
  getBulkByItem:any
  getBulkDataByItem(val:any,expenseId:any){
    this.getBulkByItem=[]
    if(val && expenseId){
      this._commonService.add(APIS.programExpenditure.getBulkDataByExpensesItem,{"expenseId": expenseId,"itemName": val})?.subscribe({
        next: (data: any) => {
         if(data){
           this.getBulkByItem = data;
           this.BulkExpenditureForm.patchValue({"purchasedQuantity": this.getBulkByItem?.purchasedQuantity,"unitCost": this.getBulkByItem?.unitCost,"purchaseDate": this.getBulkByItem?.purchaseDate.substring(0,10),"consumedQuantityFromBulk": this.getBulkByItem?.consumedQuantity,"bulkExpenditureId": this.getBulkByItem?.bulkExpenditureId,"availableQuantity": this.getBulkByItem?.availableQuantity})
         }
        },
        error: (err: any) => {
          this.toastrService.error(err.message, "Error fetching program details!");
        }
      });
    }
  }
  calcCostAllocated(Val:any){
    this.fBulk['allocatedCost'].setValue(Val*this.fBulk['unitCost'].value)
  }
  OpenModal():any{
    
    if(this.programCreationMain.value.activityId && this.programCreationMain.value.subActivityId && this.programCreationMain.value.programId){
      this.PrePostExpenditureForm.reset()
      if(this.expenditureType=='Bulk'){
        const modal = new bootstrap.Modal(this.BulkEvenModal.nativeElement);
        modal.show();
      }
      else{
        const modal = new bootstrap.Modal(this.preEventModal.nativeElement);
        modal.show();
      }
      
        // this.formModel = new window.bootstrap.Modal(document.getElementById("addInventory")    );
      // return true;;
    }
    else{
      this.toastrService.warning('Please select Activity,subactivity,Program then only you have to Add '+this.expenditureType+' Expenditure')
      // return false;
     
    }
    
  }
  validateFileExtension(file: File): boolean {
    const allowedExtensions = ['xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx','jpg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension || '');
  }
  uploadedFiles: any = [];
  onFileChange(event: any) {
    // const file = event.target.files[0];
    // let urlsList: any = [];
    // if (file) {
    //   this.sessionForm.patchValue({ uploaFiles: file });
    // }
    const input = event.target as HTMLInputElement;
    let urlsList: any = [];

    if (input.files) {
      const newFiles = Array.from(input.files);
      const validFiles = newFiles.filter(file => this.validateFileExtension(file));
      if (validFiles.length !== newFiles.length) {
        this.toastrService.error('Invalid file type selected. Only Excel, Word, and PowerPoint files are allowed.', 'File Upload Error');
      }
      for (let i = 0; i < validFiles.length; i++) {
        const fileName = validFiles[i].name;
        const fakePath = `${fileName}`;
        urlsList.push(fakePath);
      }
      //this.sessionForm.patchValue({ uploaFiles: validFiles });
      //this.sessionForm.get('uploaFiles')?.setValue(validFiles);
      // Save valid files separately
      this.uploadedFiles = validFiles;
      // this.sessionForm.patchValue({ videoUrls: urlsList });
    }
  }
  //save pre and post expenditure 
  ExpenditureSubmit(){
    let payload={...this.programCreationMain.value ,programId:Number(this.programCreationMain.value.programId),...this.PrePostExpenditureForm.value,headOfExpenseId:Number(this.PrePostExpenditureForm.value.headOfExpenseId),agencyId:this.agencyId}
    console.log(payload)
    const formData = new FormData();
      formData.append("request", JSON.stringify(payload));

      if (this.PrePostExpenditureForm.value.uploadBillUrl) {
        formData.append("files", this.uploadedFiles[0]);
        }
    this._commonService
        .add(APIS.programExpenditure.saveExpenditure, formData).subscribe({
          next: (data: any) => {
            
            if(data?.status==400){
              this.toastrService.error(data?.message, this.expenditureType +" Expenditure Data Error!");
            }
            else{
              this.uploadedFiles=[]
              this.PrePostExpenditureForm.reset();
              this.TotalAmount=0
              this.getExpenditure()
              // this.getBulkExpenditure()
              
             
            this.toastrService.success( this.expenditureType +' Expenditure Added Successfully', this.expenditureType +" Expenditure Data Success!");
            }
            
          },
          error: (err) => {
            
            this.toastrService.error(err.message, this.expenditureType +" Expenditure Data Error!");
            new Error(err);
          },
        });
  }
  getExpenditureData:any=[]
  getExpenditureDataBoth:any=[]
  TotalAmount:any=0
  getExpenditure(){
    this.uploadedFiles=[]
    this.getExpenditureData=[]
    this.getExpenditureDataBoth=[]
    if(this.f2['programId'].value){
      this._commonService
        .getDataByUrl(APIS.programExpenditure.getExpenditure+'?programId='+this.f2['programId'].value+'&expenditureType='+'PRE').subscribe({
          next: (data: any) => {
           if(data?.data){
            this.getExpenditureData=data?.data
            this.getExpenditureDataBoth=[...this.getExpenditureDataBoth,...data?.data]
            // this.getExpenditure()
            this.getPost()
            this.reinitializeDataTable();
            this.getExpenditureData?.map((item:any)=>{
              this.TotalAmount+=item?.cost
            })
           }
            
          },
          error: (err) => {
            this.getPost()
            this.toastrService.error(err.message, this.expenditureType +" Expenditure Data Error!");
            new Error(err);
          },
        });
        
    }
    
  }
  getPost(){
    this._commonService
        .getDataByUrl(APIS.programExpenditure.getExpenditure+'?programId='+this.f2['programId'].value+'&expenditureType='+'POST').subscribe({
          next: (data: any) => {
           if(data?.data){
            this.getExpenditureData=data?.data
            this.getExpenditureDataBoth=[...this.getExpenditureDataBoth,...data?.data]
            this.getBulkExpenditure()
            this.reinitializeDataTable();
            this.getExpenditureData?.map((item:any)=>{
              this.TotalAmount+=item?.cost
            })
           }
            
          },
          error: (err) => {
            this.getBulkExpenditure()
            this.toastrService.error(err.message, this.expenditureType +" Expenditure Data Error!");
            new Error(err);
          },
        });
  }
  // save Bulk expenditure
  BulkExpenditureSubmit(){
    let payload1:any={
      "activityId": this.programCreationMain.value?.activityId,
      "subActivityId": this.programCreationMain.value?.subActivityId,
      "programId": this.programCreationMain.value?.programId,
      "agencyId": this.agencyId,
      // "expenditureType": "PRE",
      "headOfExpenseId": this.BulkExpenditureForm.value?.headOfExpenseId,
      "bulkExpenditureId": this.BulkExpenditureForm.value?.bulkExpenditureId,
      "consumedQuantity": this.BulkExpenditureForm.value?.consumedQuantity,
      "allocatedCost":this.BulkExpenditureForm.value?.allocatedCost
  }
    // let payload={...this.BulkExpenditureForm.value,agencyId:this.agencyId}
    // console.log(payload)
    this._commonService
        .add(APIS.programExpenditure.savebulkByItemExpenditure, payload1).subscribe({
          next: (data: any) => {
            if(data?.status==400){
              this.toastrService.error(data?.message, this.expenditureType +" Expenditure Data Error!");
            }
            else{
              this.BulkExpenditureForm.reset()
              this.TotalAmount=0
              this.getExpenditure()
              // this.advanceSearch(this.getSelDataRange);
          
            // this.formDetails()
            // modal.close()
            this.toastrService.success( this.expenditureType +' Expenditure Added Successfully', this.expenditureType +" Expenditure Data Success!");
            }
            
          },
          error: (err) => {
            
            this.toastrService.error(err.message, this.expenditureType +" Expenditure Data Error!");
            new Error(err);
          },
        });
  }
  getBulkExpenditureData:any=[]
  BulkTotalUnitCost:any=0
  BulkTotalCost:any=0
  getBulkExpenditure(){
    this.getBulkExpenditureData=[]
    this.BulkTotalUnitCost=0
    this.BulkTotalCost=0
    this.BulkExpenditureForm.reset()
    if(this.f2['programId'].value){
      this._commonService
      .getDataByUrl(APIS.programExpenditure.getBulkExpenditureByProgramId+'?programId='+this.f2['programId'].value).subscribe({
        next: (data: any) => {
          if(data?.data){
            this.getExpenditureDataBoth=[...this.getExpenditureDataBoth,...data?.data]
             console.log( this.getExpenditureData,data?.data,this.getExpenditureDataBoth)
            this.getBulkExpenditureData=data?.data
            this.reinitializeDataTableBulk();
            this.reinitializeDataTable();
            this.getBulkExpenditureData?.map((item:any)=>{
              this.BulkTotalUnitCost+=item?.unitCost
              this.TotalAmount+=item?.allocatedCost
            })
          }
         
          console.log(this.TotalAmount)
        },
        error: (err) => {
          
          this.toastrService.error(err.message, this.expenditureType +" Expenditure Data Error!");
          new Error(err);
        },
      });
    }
   
  }
  dataTable: any;
    reinitializeDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
      setTimeout(() => {
        this.initializeDataTable();
      }, 0);
    }
  
    initializeDataTable() {
      this.dataTable = new DataTable('#expenditure-table', {
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
        paging: false,
        info: false,
        searching: false,
        destroy: true, // Ensure reinitialization doesn't cause issues
      });
    }
    dataTableBulk: any;
    reinitializeDataTableBulk() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
      setTimeout(() => {
        this.initializeDataTableBulk();
      }, 0);
    }
  
    initializeDataTableBulk() {
      this.dataTable = new DataTable('#expenditure-table-bulk', {
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
        paging: false,
        info: false,
        searching: false,
        destroy: true, // Ensure reinitialization doesn't cause issues
      });
    }
}
