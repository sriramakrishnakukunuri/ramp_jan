import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
@Component({
  selector: 'app-program-creation',
  templateUrl: './program-creation.component.html',
  styleUrls: ['./program-creation.component.css']
})
export class ProgramCreationComponent implements OnInit {
  programCreationMain!: FormGroup;
  programCreationSub!: FormGroup;
  locationForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,
  ) { 
    this.formDetails();
    this.formDetailsTwo();
    this.formDetailsLocation();
    this.getProgramLocation()
    this.getSessionResource()
    this.modalFormStype = this.fb.group({
      sourceType: ['', Validators.required],
  });
  }

  ngOnInit(): void {    
    (document.getElementById('collapseExample') as HTMLElement).classList.add('show');
    (this.programCreationSub?.controls["details"] as FormArray).clear();
    this.onAddRow(0)
  }
  get f2() {
    return this.programCreationMain.controls;
  }
  get fLocation() {
    return this.locationForm.controls;
  }
  formDetails() {
    this.programCreationMain  = new FormGroup({
      // date: new FormControl("", [Validators.required]),
      activityId: new FormControl("", [Validators.required]),
      subActivityId: new FormControl("",[Validators.required,]),
      programType: new FormControl("", [Validators.required]), //Validators.required
      programDetails: new FormControl("",[Validators.required,]),
      programTitle: new FormControl("", [Validators.required]),
      // noOfDays: new FormControl("", [Validators.required,]),
      startDate: new FormControl("",[Validators.required]),
      endDate: new FormControl("",[Validators.required]),
      startTime: new FormControl("",[Validators.required,]),
      endTime: new FormControl("",[Validators.required,]),
      spocName: new FormControl("",[Validators.required,]),
      spocContactNo: new FormControl("",[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      programLocation: new FormControl("",[Validators.required,]),
      kpi: new FormControl("",[Validators.required,]),
      // TargetSector: new FormControl("",[Validators.required,]),
      // targetAudience: new FormControl("",[Validators.required,]),
      // targetNoOfParticipants: new FormControl("",[Validators.required,]),
    });
  }
  formDetailsTwo() {
    this.programCreationSub = new FormGroup({
      details: this.fb?.array([this.fb.group({
        sessionDate:new FormControl("",[Validators.required]),
        startTime: new FormControl("",[Validators.required]),
        endTime: new FormControl("",[Validators.required]),
        sessionTypeName: new FormControl("",[Validators.required]),
        sessionTypeMethodology:new FormControl("",),
        sessionDetails: new FormControl("",),
        // sessionExpectedOutComes: new FormControl("",),
        resourceId: new FormControl("",),
        meterialType: new FormControl("",),
        uploaFiles: [[], Validators.required]
      })]),
    });
  }
  formDetailsLocation() {
    this.locationForm = new FormGroup({
      locationName:new FormControl("",[Validators.required]),
      ownershipType: new FormControl("",[Validators.required]),
      typeOfVenue: new FormControl("",[Validators.required]),
      latitude: new FormControl("",[Validators.required]),
      longitude:new FormControl("",),
      googleMapUrl: new FormControl("",),
      OthersType: new FormControl("",),
      capacity: new FormControl("",),
      agencyId: new FormControl("",),
      filePath: new FormControl("",),
    });
  }
  get addDynamicRow() {
    return this.programCreationSub?.get("details") as FormArray;
  }
  initiateForm(): FormGroup {
    return this.fb.group(
    {
      "sessionDate": "",
      "startTime": "",
      "endTime": "",
      "sessionTypeName": "",
      "sessionTypeMethodology": "",
      "sessionDetails": "",
      "resourceId": '',
      "meterialType": "",
      "uploaFiles": [null]
  }
  );
  }
// Add New row
  onAddRow(index:any) {
    const control = this.programCreationSub?.get("details") as FormArray;
    control.insert(index+1, this.initiateForm());
    // control.push(this.initiateForm());
  }
  onRemoveRow(rowIndex: number) {
    const control = this.programCreationSub?.get("details") as FormArray;
    control.removeAt(rowIndex);
  }
  convertToBlob(file: File): Blob {
    // You can directly work with the file object since it is already a Blob
    // or you can manipulate it if needed, e.g., creating a new Blob
    return new Blob([file]);
  }
  submitForm(){
  
    let val={...this.programCreationMain.value}
    // this.programCreationSub?.controls["details"]?.value.forEach((element:any,index:any) => {
    //   if(element['uploaFile']){
    //   element['uploaFile']=this.convertToBlob(element['uploaFile']);
    //   }
        
    // })
    val={...this.programCreationMain.value,programSessionList:this.programCreationSub?.controls["details"]?.value}
    console.log(val)
    let maindata={...this.programCreationMain.value}
    maindata['activityId']=1
    maindata['subActivityId']=1
    maindata['locationId']=1
    maindata['agencyId']=1
    const programData = JSON.parse(localStorage.getItem('programDetails') || '[]');
    programData.push(val);
    localStorage.setItem('programDetails', JSON.stringify(programData));
    this.closeModal()

    let formData = new FormData();
    formData.set("data", JSON.stringify(this.programCreationSub?.controls["details"]?.value))
    
    this.programCreationSub?.controls['details']?.value.forEach((element:any,index:any) => {
      if(element['uploaFiles']){
        element['uploaFiles'].forEach((file:any) => {          
          formData.append("files", file);
        })
      }
    })

    console.log(this.programCreationSub?.controls['details']?.value,'sgsgsggs')
    

    // this.uploadedFiles.forEach((file:any) => {
    //   formData.append("files", file);
    // })

    //this.router.navigateByUrl('/update-program-execution');
    // this._commonService.requestDataFromMultipleSources(APIS.programCreation.addprogram,APIS.programCreation.addSessions,maindata,formData).subscribe((res: any) => {
    //   this.toastrService.success('Program Created Successfully', 'Success');
    //   this.uploadedFiles=[]
    //  })
    // this._commonService
    //   .add(APIS.programCreation.add,val)
    //   .subscribe({
    //     next: (data) => {
    //       // this.advanceSearch(this.getSelDataRange);
    //       // modal.close()
    //       this.toastrService.success('Program Created Successfully', "Program Creation Success!");
    //     },
    //     error: (err) => {
    //       this.toastrService.error(err.message, "Program Creation Error!");
    //       new Error(err);
    //     },
    //   });
  }

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  

  openModal(): void {    
    // if(this.programCreationMain.valid){
    //   const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
    //   modal.show();
    // }else{
    //   this.toastrService.error('Please enter all fields', "Add Program Error!");
    // }   
    const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
    modal.show(); 
}

closeModal(): void {
    const modal = bootstrap.Modal.getInstance(this.exampleModal.nativeElement);
    modal.hide();
}
modalFormStype!: FormGroup; // Form for the modal
sourceTypes: any = [];
onModalSubmitType(){
  if (this.modalFormStype.valid) {
      // Add source type to the array
      const newSourceType = this.modalFormStype.value.sourceType;
      this.sourceTypes.push({
          type: "sourceType",
          values: newSourceType
      });
      this.toastrService.success('Resoure Person Created Successfully', "");
      
    const addResourceModal = document.getElementById('addResource');
    if (addResourceModal) {
      const modalInstance = bootstrap.Modal.getInstance(addResourceModal);
      modalInstance.hide();
    }
    }
  }
  onModalSubmitLocation(){
    console.log(this.locationForm.value)  
    let payload:any={...this.locationForm.value}
    payload['typeOfVenue']=='Others'?payload['typeOfVenue']=payload['OthersType']:payload['typeOfVenue']
    payload['agencyId']='1'
    // payload['filePath']=this.convertToBlob(payload['filePath']);
    delete payload['OthersType']
    this._commonService
      .add(APIS.programCreation.addLocation,payload)
      .subscribe({
        next: (data) => {
          // this.advanceSearch(this.getSelDataRange);
          // modal.close()
          this.toastrService.success('Location Added Successfully', "Program Creation Success!");
          this.getProgramLocation()
        },
        error: (err) => {
          this.toastrService.error(err.message, "Program Creation Error!");
          new Error(err);
        },
      });
  }
  getProgramLocationData:any=[]
  getProgramLocation(){
    this._commonService
      .getById(APIS.programCreation.getLocation,'1')
      .subscribe({
        next: (data:any) => {
          this.getProgramLocationData=data.data
          // this.toastrService.success('Location Added Successfully', "Program Creation Success!");
        },
        error: (err:any) => {
          // this.toastrService.error(err.message, "Program Creation Error!");
          new Error(err);
        },
      });
  }
  getSessionResourceData:any=[]
  getSessionResource(){
    this._commonService
      .getById(APIS.programCreation.getResource,'1')
      .subscribe({
        next: (data:any) => {
          this.getSessionResourceData=data.data
          // this.toastrService.success('Location Added Successfully', "Program Creation Success!");
        },
        error: (err:any) => {
          // this.toastrService.error(err.message, "Program Creation Error!");
          new Error(err);
        },
      });
  }
  uploadedFiles:any = [];
  onFilesSelected(event:any, index:any) {
    console.log(event.target.files)
    //this.uploadedFiles.push(event.target.files);
    // const input = event.target as HTMLInputElement;
    
    // if (input.files) {      
    //   const files = Array.from(input.files);
    //   //this.addDynamicRow.controls[index].setValue({uploaFiles:files})
    //   //(this.addDynamicRow?.at(index) as FormGroup)?.controls['uploaFiles']?.setValue(files ?? []);
    //   (this.addDynamicRow.get('uploaFiles') as FormArray).at(index).setValue(files)
    // }programCreationSub?.get("details")

    const input = event.target as HTMLInputElement;
  const rows = this.programCreationSub.get('details') as FormArray;

  if (rows && input.files) {
    const newFiles = Array.from(input.files); // Convert FileList to Array
    // Set the combined array of files
    rows.at(index).get('uploaFiles')?.patchValue({uploaFiles: newFiles});
    //(this.programCreationSub.get('details') as FormArray).at(index)?.patchValue({uploaFiles: allFiles});
    //filesList.push(newFiles)
    //this.addDynamicRow.controls[index].setValue({uploaFiles:newFiles})
  }

  }
}
