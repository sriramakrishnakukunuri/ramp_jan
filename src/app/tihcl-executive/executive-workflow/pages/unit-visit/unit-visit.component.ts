import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
      this.createForm();
  }

 initForm(): void {
    this.unitVisitForm = this.fb.group({
      visitedBy: ['', Validators.required],
      dateOfVisit: ['', Validators.required],
      timeOfVisit: ['', Validators.required],
      nameOfThePerson: ['', Validators.required],
      designation: ['', Validators.required],
      selectLandDetails: ['', Validators.required],
      factoryAddress: ['', Validators.required],
      isSameAsFactoryAddress: [false,[Validators.required]],
      registerAddress: ['', Validators.required],
      isUpgradationRequired: [false],
      isMachineryProperlyAligned: [false,[Validators.required]],
      isCompanyNameBoard: [false,[Validators.required]],
      isFinancedBankNameBoard: [false,[Validators.required]],
      officeStaff: ['', [Validators.required, Validators.min(0)]],
      factoryWorkers: ['', [Validators.required, Validators.min(0)]],
      temporaryWorkers: ['', [Validators.required, Validators.min(0)]],
      isEmpAttendanceRegister: [false,[Validators.required]],
      inconsistenciesWithPeopleWorking: [''],
      productsMfgAndSold: ['', Validators.required],
      seasonalOrThroughtoutYear: ['', Validators.required],
      noOfShifts: ['', [Validators.required, Validators.min(1)]],
      isStocksStoredProperty: [false,[Validators.required]],
      isAdequateStorageCapacity: [false,[Validators.required]],
      stocksMaintaned: [''],
      isUptoDate: ['',[Validators.required]],
      valueOfTheStock: ['', [Validators.required, Validators.min(0)]],
      rawMaterials: [''],
      workInProgress: [''],
      finishedGoods: [''],
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

  addMachineDetail(machine?: any): void {
   
  }


  onSubmit(): void {
    if (this.unitVisitForm.valid) {
      console.log('Form submitted:', this.unitVisitForm.value);
      // Handle form submission
    } else {
      Object.keys(this.unitVisitForm.controls).forEach(field => {
        const control = this.unitVisitForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      console.log('Form is invalid');
    }
  }
  saveExistingData(){

  }
  onSubmitModel(): void {
    if (this.machineForm.valid) {
   
    const deliveryDetailsArray = this.unitVisitForm.get('factoryDetails') as FormArray;
    // Push the new form group
    deliveryDetailsArray.push(this.fb.group(this.machineForm.value));
      this.onClose()
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.machineForm.controls).forEach(field => {
        const control = this.machineForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  openModel(){
        this.machineForm.reset()
        const modal = new bootstrap.Modal(this.addmachinary.nativeElement);
        modal.show(); 
  }
   editCreditDetails(item: any) {
     this.machineForm = this.fb.group({
      typesOfMachine: [item?.typesOfMachine, Validators.required],
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
  
    deleteCreditDetail(index: number) {
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
