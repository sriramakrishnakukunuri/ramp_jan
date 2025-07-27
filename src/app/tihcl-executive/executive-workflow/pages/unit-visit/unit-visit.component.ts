import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-unit-visit',
  templateUrl: './unit-visit.component.html',
  styleUrls: ['./unit-visit.component.css']
})
export class UnitVisitComponent implements OnInit {
@ViewChild('addmachinary') addmachinary!: ElementRef;
@ViewChild('addvisit') addvisit!: ElementRef;
  unitVisitForm!: FormGroup;
  factoryDetails: any[] = [];
  @Input() freeze:any
  isSameAddress: boolean = true;
  machineForm!: FormGroup;
  visitForm!: FormGroup;
  applicationData:any
   @Output() progressBarStatusUpdate:any = new EventEmitter();
   constructor(private fb: FormBuilder,private toastrService: ToastrService,
          private _commonService: CommonServiceService,) {
             const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
             this.applicationData=applicationData
             console.log( this.applicationData,'srl')
    }

  ngOnInit(): void {
    this.getAllDistricts()
    this.getDataById()
    this.initForm();
    this.createForm();
    this.createVisitForm();
  }
 today:any= this._commonService.getDate();
 initForm(): void {
    this.unitVisitForm = this.fb.group({
      visitedBy: ['', Validators.required],
      dateOfVisit: ['', Validators.required],
      timeOfVisit: ['00:00', Validators.required],
      // nameOfThePerson: ['', Validators.required],
      // designation: ['', Validators.required],
      selectLandDetails: ['', Validators.required],
      // factoryAddress: ['', Validators.required],
      "latitude":["", [Validators.pattern(/^[0-9.]{1,50}$/)]],
      "longitude":["", [Validators.pattern(/^[0-9.]{1,50}$/)]],
      "district": ['', Validators.required],
      "mandal": ['', Validators.required],
      "village": ['', Validators.required],
      "street": ['', Validators.required],
      isSameAsFactoryAddress: [false,],
      registerAddress: ['', Validators.required],
      isUpgradationRequired: [false,],
      isMachineryProperlyAligned: [false,],
      isCompanyNameBoard: [false,[Validators.required]],
      isFinancedBankNameBoard: [false,[Validators.required]],
      officeStaff: ['', [Validators.required, Validators.min(0)]],
      factoryWorkers: ['', [Validators.required, Validators.min(0)]],
      temporaryWorkers: ['', [Validators.required, Validators.min(0)]],
      isEmpAttendanceRegister: [false,[Validators.required]],
      inconsistenciesWithPeopleWorking: ['',[Validators.required]],
      productsMfgAndSold: ['', Validators.required],
      seasonalOrThroughtoutYear: ['', Validators.required],
      noOfShifts: ['', [Validators.required, Validators.min(1)]],
      isStocksStoredProperty: [false,[Validators.required]],
      isAdequateStorageCapacity: [false,[Validators.required]],
      stocksMaintaned: ['',[Validators.required]],
      isUptoDate: [false,[Validators.required]],
      valueOfTheStock: ['', [Validators.required, Validators.min(0)]],
      rawMaterials: ['',[Validators.required,Validators.min(0)]],
      workInProgress: ['',[Validators.required,Validators.min(0)]],
      finishedGoods: ['',[Validators.required,Validators.min(0)]],
      periodicity: [, Validators.required],
      maxProductionInUnit: ['', [Validators.required]],
      minProductionInUnit: ['', [Validators.required]],
      currentProductionInUnit: ['', [Validators.required, Validators.min(0)]],
      costPerUnit: ['', ],
      sellingPricePerUnit: ['', ],
      profitMargin: ['', ],
      recentConsumption: ['', [Validators.required, Validators.min(0)]],
      // maxConsumption: ['', [Validators.required, Validators.min(0)]],
      powerBillPaidDate: ['', Validators.required],
      factoryDetails: this.fb.array([]),
      visitorsDetailsRequests: this.fb.array([])
    });
  }
  toggleRegisterAddress(val:any){
    const isSameAsFactoryAddress = this.unitVisitForm.get('isSameAsFactoryAddress')?.value;
    if (val) {
      const factoryAddress = this.unitVisitForm.get('district')?.value + ' , ' + this.unitVisitForm.get('mandal')?.value + ' , ' + this.unitVisitForm.get('village')?.value + ' , ' + this.unitVisitForm.get('street')?.value;
      this.unitVisitForm.patchValue({ registerAddress: factoryAddress });
      // this.unitVisitForm.patchValue({ registerAddress: this.unitVisitForm.get('district')?.value });
    } else {
      this.unitVisitForm.patchValue({ registerAddress: '' });
    }
  }
  OnchangeValue(){
    const rawMaterials = this.unitVisitForm.get('rawMaterials')?.value || 0;
    const workInProgress = this.unitVisitForm.get('workInProgress')?.value || 0;
    const finishedGoods = this.unitVisitForm.get('finishedGoods')?.value || 0;

    const totalStockValue = rawMaterials + workInProgress + finishedGoods;
    this.unitVisitForm.patchValue({ valueOfTheStock: totalStockValue });
  }
  allDistricts:any
  getAllDistricts(){
    this.allDistricts = []
    this._commonService.getDataByUrl(APIS.tihclMasterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    })
  }
  MandalList:any
   GetMandalByDistrict(event: any) {
    this.unitVisitForm.get('mandal')?.reset();

      const districId=this.allDistricts.filter((item:any)=>{
        console.log(item)
        if(event==item.districtName){
          return item
        }
      })
      console.log(districId)
    this.MandalList=[]
    if(districId.length){
        this._commonService.getDataByUrl(APIS.tihclMasterList.getMandal + districId[0]?.districtId).subscribe({
      next: (data: any) => {
        this.MandalList = data.data;
      },
      error: (err: any) => {
        this.MandalList = [];
      }
    })
    }
  

  }
createForm(): void {
    this.machineForm = this.fb.group({
      typesOfMachine: ['', Validators.required],
      id:[null],
      purpose: ['', Validators.required],
      noOfMachines: ['', [Validators.required, Validators.min(1)]],
      costOfMachinePurchased: ['', [Validators.required, Validators.min(0)]],
      currentCondition: ['', Validators.required],
      valueOfMachinery: ['', [Validators.required, Validators.min(0)]]
    });
  }
  createVisitForm(): void {
    this.visitForm = this.fb.group({
      visitedBy: ['', Validators.required],
      id:[null],
      nameOfThePersonMet: ['', Validators.required],
      designation: ['', [Validators.required]],
    });
  }
  get VisitArray(): FormArray {
    return this.unitVisitForm.get('visitorsDetailsRequests') as FormArray;
  }
  get factoryDetailsArray(): FormArray {
    return this.unitVisitForm.get('factoryDetails') as FormArray;
  }

  ExistingunitVisit:any={}
    getDataById(id?:any){
      // this.factoryDetailsArray.reset()
      this._commonService.getById(APIS.tihclExecutive.getUnitVisitById,this.applicationData?.registrationUsageId?this.applicationData?.registrationUsageId:this.applicationData?.registrationId).subscribe({
              next: (response) => {
                console.log(response)
                if(Object.keys(response?.data).length){
                  this.ExistingunitVisit=response?.data
                  console.log( this.ExistingunitVisit)
                  this.patchValueBydata(response?.data)
                }        
              },
              error: (error) => {
              }
            });
    }
    patchValueBydata(data:any){
       this.unitVisitForm.patchValue({
      // visitedBy: data?.visitedBy,
      dateOfVisit: data?.dateOfVisit,
      timeOfVisit: data?.timeOfVisit,
      // nameOfThePerson: data?.nameOfThePerson,
      // designation: data?.designation,
      selectLandDetails: data?.selectLandDetails,
      // factoryAddress: data?.factoryAddress,
      latitude: data?.latitude,
      longitude: data?.longitude,
      district: data?.district,
      mandal: data?.mandal,
      village: data?.village,
      street: data?.street,
      isSameAsFactoryAddress: data?.isSameAsFactoryAddress,
      registerAddress: data?.registerAddress,
      isUpgradationRequired: data?.isUpgradationRequired,
      isMachineryProperlyAligned: data?.isMachineryProperlyAligned,
      isCompanyNameBoard: data?.isCompanyNameBoard,
      isFinancedBankNameBoard: data?.isFinancedBankNameBoard,
      officeStaff: data?.officeStaff,
      factoryWorkers: data?.factoryWorkers,
      temporaryWorkers: data?.temporaryWorkers,
      isEmpAttendanceRegister: data?.isEmpAttendanceRegister,
      inconsistenciesWithPeopleWorking: data?.inconsistenciesWithPeopleWorking,
      productsMfgAndSold: data?.productsMfgAndSold,
      seasonalOrThroughtoutYear: data?.seasonalOrThroughtoutYear,
      noOfShifts: data?.noOfShifts,
      isStocksStoredProperty: data?.isStocksStoredProperty,
      isAdequateStorageCapacity: data?.isAdequateStorageCapacity,
      stocksMaintaned: data?.stocksMaintaned,
      isUptoDate: data?.isUptoDate,
      valueOfTheStock: data?.valueOfTheStock,
      rawMaterials: data?.rawMaterials,
      workInProgress: data?.workInProgress,
      finishedGoods: data?.finishedGoods,
      periodicity: data?.periodicity,
      maxProductionInUnit: data?.maxProductionInUnit,
      minProductionInUnit: data?.minProductionInUnit,
      currentProductionInUnit: data?.currentProductionInUnit,
      costPerUnit: data?.costPerUnit,
      sellingPricePerUnit: data?.sellingPricePerUnit,
      profitMargin: data?.profitMargin,
      recentConsumption: data?.recentConsumption,
      // maxConsumption: data?.maxConsumption,
       powerBillPaidDate: data?.powerBillPaidDate
      });
      this.factoryDetailsArray.clear();
       data?.factoryDetails.forEach((machine:any) => {
      this.addMachineDetail(machine);
    });
      this.createVisitForm();
      this.VisitArray.clear();
      data?.visitorsDetailsRequests.forEach((visit:any) => {
        this.addVisitDetail(visit);
      });

    }
  addVisitDetail(visit?: any): void {
    const visitGroup = this.fb.group({
      visitedBy: [visit ? visit.visitedBy : '', Validators.required],
      id:[visit?visit.id:null],
      nameOfThePersonMet: [visit ? visit.nameOfThePersonMet : '', Validators.required],
      designation: [visit ? visit.designation : '', [Validators.required]],
    }); 
    this.VisitArray.push(visitGroup);
  }
 addMachineDetail(machine?: any): void {
    const machineGroup = this.fb.group({
      typesOfMachine: [machine ? machine.typesOfMachine : ''],
      purpose: [machine ? machine.purpose : ''],
      noOfMachines: [machine ? machine.noOfMachines : ''],
      costOfMachinePurchased: [machine ? machine.costOfMachinePurchased : ''],
      currentCondition: [machine ? machine.currentCondition : ''],
      valueOfMachinery: [machine ? machine.valueOfMachinery : ''],
      id:[machine?machine.id:null]
    });
    this.factoryDetailsArray.push(machineGroup);
  }
  onSubmit(): void {
    if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length && Object.keys( this.ExistingunitVisit).length && this.ExistingunitVisit?.id){
         let payload:any={...this.unitVisitForm.value, "applicationNo": this.applicationData?.applicationNo,"applicationStatus": "UNIT_VISIT"}
         this._commonService.update(APIS.tihclExecutive.updateUnitVisit,payload,this.ExistingunitVisit?.id).subscribe({
          next: (response) => {
           this.getDataById(response?.data?.id)
           this.progressBarStatusUpdate.emit({"update":true})
            this.toastrService.success('Unit Visit Data Updated Successfully','Unit Visit');

            //  this.progressBarStatusUpdate.emit({"update":true})
    
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
      else if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length && !Object.keys( this.ExistingunitVisit).length){
      console.log(this.applicationData,this.unitVisitForm.value)
        let payload:any={...this.unitVisitForm.value, "applicationNo": this.applicationData?.applicationNo,"applicationStatus": "MANAGER_APPROVAL_1"}
       this._commonService.add(APIS.tihclExecutive.saveUnitVisit,payload).subscribe({
          next: (response) => {
           this.getDataById(response?.data?.id)
           this.progressBarStatusUpdate.emit({"update":true})
            this.toastrService.success('Unit Visit Data Saved Successfully','Unit Visit');

            //  this.progressBarStatusUpdate.emit({"update":true})
    
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      
      } 
      else {
      Object.keys(this.unitVisitForm.controls).forEach(field => {
        const control = this.unitVisitForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      console.log('Form is invalid');
    }
  }
  saveExistingData(){
    console.log(this.ExistingunitVisit)
     if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length && Object.keys( this.ExistingunitVisit).length && this.ExistingunitVisit?.id){
         let payload:any={...this.unitVisitForm.value, "applicationNo": this.applicationData?.applicationNo,"applicationStatus": "UNIT_VISIT"}
         this._commonService.update(APIS.tihclExecutive.updateUnitVisit,payload,this.ExistingunitVisit?.id).subscribe({
          next: (response) => {
           this.getDataById(response?.data?.id)
           this.progressBarStatusUpdate.emit({"update":true})
            this.toastrService.success('Unit Visit Data Updated Successfully','Unit Visit');

            //  this.progressBarStatusUpdate.emit({"update":true})
    
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }else  if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length && this.ExistingunitVisit?.id){
         let payload:any={...this.unitVisitForm.value, "applicationNo": this.applicationData?.applicationNo,"applicationStatus": "UNIT_VISIT"}
         this._commonService.update(APIS.tihclExecutive.updateUnitVisit,payload,this.ExistingunitVisit?.id).subscribe({
          next: (response) => {
           this.getDataById(response?.data?.id)
           this.progressBarStatusUpdate.emit({"update":true})
            this.toastrService.success('Unit Visit Data Updated Successfully','Unit Visit');

            //  this.progressBarStatusUpdate.emit({"update":true})
    
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
      else  if(Object.keys(this.ExistingunitVisit).length && this.ExistingunitVisit?.id){

         let payload:any={...this.unitVisitForm.value, "applicationNo": this.applicationData?.applicationNo,"applicationStatus": "MANAGER_APPROVAL_1"}
         this._commonService.update(APIS.tihclExecutive.updateUnitVisit,payload,this.ExistingunitVisit?.id).subscribe({
          next: (response) => {

           this.getDataById(response?.data?.id)
           this.progressBarStatusUpdate.emit({"update":true})
            this.toastrService.success('Unit Visit Data Updated Successfully','Unit Visit');

            //  this.progressBarStatusUpdate.emit({"update":true})
    
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
      else{
          console.log(this.applicationData,this.unitVisitForm.value)
        let payload:any={...this.unitVisitForm.value, "applicationNo": this.applicationData?.applicationNo,"applicationStatus": "MANAGER_APPROVAL_1"}
         this._commonService.add(APIS.tihclExecutive.saveUnitVisit,payload).subscribe({
          next: (response) => {
           this.getDataById(response?.data?.id)
           this.progressBarStatusUpdate.emit({"update":true})
            this.toastrService.success('Unit Visit Data Saved Successfully','Unit Visit');

            //  this.progressBarStatusUpdate.emit({"update":true})
    
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
  }
  onSubmitModel(): void {
    if (this.machineForm.valid ) {
      console.log(this.machineForm?.value)
       const factoryDetailsArray = this.unitVisitForm.get('factoryDetails') as FormArray;
    // Push the new form group
        factoryDetailsArray.push(this.fb.group(this.machineForm.value));
      this.onClose()
    } else {
      this.markFormGroupTouched(this.unitVisitForm);
    }
  }
    markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  openModel(){
        this.machineForm.reset()
        const modal = new bootstrap.Modal(this.addmachinary.nativeElement);
        modal.show(); 
  }
   editCreditDetails(item: any) {
     this.machineForm = this.fb.group({
      typesOfMachine: [item?.typesOfMachine, Validators.required],
       id:[item?.id?item.id:null],
      purpose: [item?.purpose, Validators.required],
      noOfMachines: [item?.noOfMachines, [Validators.required, Validators.min(1)]],
      costOfMachinePurchased: [item?.costOfMachinePurchased, [Validators.required, Validators.min(0)]],
      currentCondition: [item?.currentCondition, Validators.required],
      valueOfMachinery: [item?.valueOfMachinery, [Validators.required, Validators.min(0)]]
    });
        const deliveryDetailsArray = this.unitVisitForm.get('factoryDetails') as FormArray;
        const index = deliveryDetailsArray.controls.findIndex(control => control.value === item);
        if (index !== -1) {
          deliveryDetailsArray.removeAt(index);
        }
         const modal = new bootstrap.Modal(this.addmachinary.nativeElement);
         modal.show(); 
    }
  
    deleteCreditDetail(item:any,index: number) {
      console.log(item)
      if(item?.id){
         this._commonService.deleteById(APIS.tihclExecutive.getUnitVisitDelete,item?.id).subscribe({
             next: (response) => {
                // this.progressBarStatusUpdate.emit({"update":true})
             },
             error: (error) => {
               console.error('Error submitting form:', error);
             }
           });
      }
      const deliveryDetailsArray = this.unitVisitForm.get('factoryDetails') as FormArray;
      deliveryDetailsArray.removeAt(index);
    }
    onClose(): void {
      const editSessionModal = document.getElementById('addmachinary');
    if (editSessionModal) {
      const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
      modalInstance.hide();
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    }
  }
  onSubmitModelVisit(): void {
    if (this.visitForm.valid) {
      const visitDetailsArray = this.unitVisitForm.get('visitorsDetailsRequests') as FormArray;
      visitDetailsArray.push(this.fb.group(this.visitForm.value));
      this.onCloseVisit();
    } else {
      this.markFormGroupTouchedVisit(this.visitForm);
    }
  }

  markFormGroupTouchedVisit(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouchedVisit(control);
      }
    });
  }

  openModelVisit() {
    this.createVisitForm();
    this.visitForm.reset();
    const modal = new bootstrap.Modal(this.addvisit.nativeElement);
    modal.show();
  }

  editCreditDetailsVisit(item: any) {
    this.visitForm = this.fb.group({
      visitedBy: [item?.visitedBy, Validators.required],
      id: [item?.id ? item.id : null],
      nameOfThePersonMet: [item?.nameOfThePersonMet, Validators.required],
      designation: [item?.designation, [Validators.required]],
    });
    const visitDetailsArray = this.unitVisitForm.get('visitorsDetailsRequests') as FormArray;
    const index = visitDetailsArray.controls.findIndex(control => control.value === item);
    if (index !== -1) {
      visitDetailsArray.removeAt(index);
    }
    const modal = new bootstrap.Modal(this.addvisit.nativeElement);
    modal.show();
  }

  deleteCreditDetailVisit(item: any, index: number) {
    // If you want to call delete API for visit, add here
    const visitDetailsArray = this.unitVisitForm.get('visitorsDetailsRequests') as FormArray;
    visitDetailsArray.removeAt(index);
  }

  onCloseVisit(): void {
    const editSessionModal = document.getElementById('addvisit');
    if (editSessionModal) {
      const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
      modalInstance.hide();
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }
  }
}
