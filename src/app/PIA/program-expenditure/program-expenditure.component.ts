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
    this.getExpenditure()
    this.getBulkExpenditure()
   
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
    // {
    //   "agencyId": 1,
    //   "itemName": "Welcome kit",
    //   "purchaseDate": "2025-04-15",
    //   "purchasedQuantity": 20,
    //   "headOfExpenseId": 3,
    //   "unitCost": 1500.00,
    //   "billNo": 456789,
    //   "billDate": "2025-04-16",
    //   "payeeName": "ABC Furnitures Ltd.",
    //   "bankName": "State Bank of India",
    //   "ifscCode": "SBIN0001234",
    //   "modeOfPayment": "CASH",  
    //   "remarks": "Procurement for new office setup",
    //   "uploadBillUrl": "https://example.com/uploads/bill456789.pdf"
    // }
    this.BulkExpenditureForm = new FormGroup({
      itemName: new FormControl("", [Validators.required]),
      purchaseDate: new FormControl("", [Validators.required]),
      purchasedQuantity: new FormControl("", [Validators.required]),
      headOfExpenseId: new FormControl("", [Validators.required]),
      unitCost: new FormControl("", [Validators.required]),
      billNo: new FormControl("", [Validators.required]),
      billDate: new FormControl("", [Validators.required]),
      payeeName: new FormControl("", [Validators.required]),
      bankName: new FormControl("", [Validators.required]),
      ifscCode: new FormControl("", [Validators.required]),
      modeOfPayment: new FormControl("", [Validators.required]),
      remarks: new FormControl("", ),
      uploadBillUrl: new FormControl("",),
    })
  }
  ChangeexpenditureType(event:any,val:any){
    this.expenditureType=val
    if(val=='Bulk'){
      this.getBulkExpenditure()
    }
    else{
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
  OpenModal():any{
    
    if(this.programCreationMain.value.activityId && this.programCreationMain.value.subActivityId && this.programCreationMain.value.programId){
      this.PrePostExpenditureForm.reset()
      const modal = new bootstrap.Modal(this.preEventModal.nativeElement);
        modal.show();
        // this.formModel = new window.bootstrap.Modal(document.getElementById("addInventory")    );
      // return true;;
    }
    else{
      this.toastrService.warning('Please select Activity,subactivity,Program then only you have to enter data')
      // return false;
     
    }
    
  }
  //save pre and post expenditure 
  ExpenditureSubmit(){
    let payload={...this.programCreationMain.value,...this.PrePostExpenditureForm.value,agencyId:this.agencyId}
    console.log(payload)
    this._commonService
        .add(APIS.programExpenditure.saveExpenditure, payload).subscribe({
          next: (data: any) => {
            if(data?.status==400){
              this.toastrService.error(data?.message, this.expenditureType +"Expenditure Data Error!");
            }
            else{
              this.PrePostExpenditureForm.reset();
              this.getExpenditure()
             
            this.toastrService.success( this.expenditureType +'Expenditure Added Successfully', this.expenditureType +"Expenditure Data Success!");
            }
            
          },
          error: (err) => {
            
            this.toastrService.error(err.message, this.expenditureType +"Expenditure Data Error!");
            new Error(err);
          },
        });
  }
  getExpenditureData:any=[]
  TotalAmount:any=0
  getExpenditure(){
    this.getExpenditureData=[]
    this.TotalAmount=0
    this._commonService
        .getById(APIS.programExpenditure.getExpenditure,this.expenditureType).subscribe({
          next: (data: any) => {
           if(data?.data){
            this.getExpenditureData=data?.data
            this.reinitializeDataTable();
            this.getExpenditureData?.map((item:any)=>{
              this.TotalAmount+=item?.cost
            })
           }
            
          },
          error: (err) => {
            
            this.toastrService.error(err.message, this.expenditureType +"Expenditure Data Error!");
            new Error(err);
          },
        });
  }
  // save Bulk expenditure
  BulkExpenditureSubmit(){
    let payload={...this.BulkExpenditureForm.value,agencyId:this.agencyId}
    console.log(payload)
    this._commonService
        .add(APIS.programExpenditure.savebulkExpenditure, payload).subscribe({
          next: (data: any) => {
            if(data?.status==400){
              this.toastrService.error(data?.message, this.expenditureType +"Expenditure Data Error!");
            }
            else{
              this.BulkExpenditureForm.reset()
              this.getBulkExpenditure()
              // this.advanceSearch(this.getSelDataRange);
          
            // this.formDetails()
            // modal.close()
            this.toastrService.success( this.expenditureType +'Expenditure Added Successfully', this.expenditureType +"Expenditure Data Success!");
            }
            
          },
          error: (err) => {
            
            this.toastrService.error(err.message, this.expenditureType +"Expenditure Data Error!");
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
    this._commonService
        .getDataByUrl(APIS.programExpenditure.getBulkExpenditure).subscribe({
          next: (data: any) => {
            if(data?.data){
              this.getBulkExpenditureData=data?.data
              this.reinitializeDataTableBulk();
              this.getBulkExpenditureData?.map((item:any)=>{
                this.BulkTotalUnitCost+=item?.unitCost
                this.BulkTotalCost+=item?.totalCost
              })
            }
           
            
          },
          error: (err) => {
            
            this.toastrService.error(err.message, this.expenditureType +"Expenditure Data Error!");
            new Error(err);
          },
        });
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
