import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  unitVisitForm!: FormGroup;
  factoryDetails: any[] = [];
  isSameAddress: boolean = true;
  machineForm!: FormGroup;
  applicationData:any
   @Output() progressBarStatusUpdate:any = new EventEmitter();
   constructor(private fb: FormBuilder,private toastrService: ToastrService,
          private _commonService: CommonServiceService,) {
             const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
             this.applicationData=applicationData
    }

  ngOnInit(): void {
    this.getDataById()
    this.initForm();
    this.createForm();
  }
 initForm(): void {
    this.unitVisitForm = this.fb.group({
      visitedBy: ['', Validators.required],
      dateOfVisit: ['', Validators.required],
      timeOfVisit: ['00:00', Validators.required],
      nameOfThePerson: ['', Validators.required],
      designation: ['', Validators.required],
      selectLandDetails: ['', Validators.required],
      factoryAddress: ['', Validators.required],
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
      rawMaterials: ['',[Validators.required]],
      workInProgress: ['',[Validators.required]],
      finishedGoods: ['',[Validators.required]],
      maxProductionInUnit: ['', [Validators.required, Validators.min(0)]],
      minProductionInUnit: ['', [Validators.required, Validators.min(0)]],
      currentProductionInUnit: ['', [Validators.required, Validators.min(0)]],
      costPerUnit: ['', [Validators.required, Validators.min(0)]],
      sellingPricePerUnit: ['', [Validators.required, Validators.min(0)]],
      profitMargin: ['', [Validators.required, Validators.min(0)]],
      recentConsumption: ['', [Validators.required, Validators.min(0)]],
      maxConsumption: ['', [Validators.required, Validators.min(0)]],
      factoryDetails: this.fb.array([])
    });
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
      visitedBy: data?.visitedBy,
      dateOfVisit: data?.dateOfVisit,
      timeOfVisit: data?.timeOfVisit,
      nameOfThePerson: data?.nameOfThePerson,
      designation: data?.designation,
      selectLandDetails: data?.selectLandDetails,
      factoryAddress: data?.factoryAddress,
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
      maxProductionInUnit: data?.maxProductionInUnit,
      minProductionInUnit: data?.minProductionInUnit,
      currentProductionInUnit: data?.currentProductionInUnit,
      costPerUnit: data?.costPerUnit,
      sellingPricePerUnit: data?.sellingPricePerUnit,
      profitMargin: data?.profitMargin,
      recentConsumption: data?.recentConsumption,
      maxConsumption: data?.maxConsumption
      });
      this.factoryDetailsArray.clear();
       data?.factoryDetails.forEach((machine:any) => {
      this.addMachineDetail(machine);
    });
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
    if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length && Object.keys( this.ExistingunitVisit).length){
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
     if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length && Object.keys( this.ExistingunitVisit).length){
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
      }else  if(this.unitVisitForm.valid && this.unitVisitForm.value?.factoryDetails?.length){
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
      else  if(Object.keys(this.ExistingunitVisit).length){

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
}
