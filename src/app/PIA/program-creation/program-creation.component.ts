import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import moment from "moment";
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
      name: ['', Validators.required],
      agencyIds: [['1']],
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
    this.programCreationMain = new FormGroup({
      // date: new FormControl("", [Validators.required]),
      activityId: new FormControl("", [Validators.required]),
      subActivityId: new FormControl("", [Validators.required,]),
      programType: new FormControl("", [Validators.required]), //Validators.required
      programDetails: new FormControl("", [Validators.required,]),
      programTitle: new FormControl("", [Validators.required]),
      // noOfDays: new FormControl("", [Validators.required,]),
      startDate: new FormControl("", [Validators.required]),
      endDate: new FormControl("", [Validators.required]),
      startTime: new FormControl("", [Validators.required,]),
      endTime: new FormControl("", [Validators.required,]),
      spocName: new FormControl("", [Validators.required,]),
      spocContactNo: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      programLocation: new FormControl("", [Validators.required,]),
      kpi: new FormControl("", [Validators.required,]),
      // TargetSector: new FormControl("",[Validators.required,]),
      // targetAudience: new FormControl("",[Validators.required,]),
      // targetNoOfParticipants: new FormControl("",[Validators.required,]),
    });
  }
  formDetailsTwo() {
    this.programCreationSub = new FormGroup({
      details: this.fb?.array([this.fb.group({
        sessionDate: new FormControl("", [Validators.required]),
        startTime: new FormControl("", [Validators.required]),
        endTime: new FormControl("", [Validators.required]),
        sessionTypeName: new FormControl("", [Validators.required]),
        sessionTypeMethodology: new FormControl("",),
        sessionDetails: new FormControl("",),
        // sessionExpectedOutComes: new FormControl("",),
        resourceId: new FormControl("",),
        meterialType: new FormControl("",),
        uploaFiles: [null, Validators.required],
        sessionStreamingUrl: new FormControl("",),
        videoUrls: [null, Validators.required],
      })]),
    });
  }
  formDetailsLocation() {
    this.locationForm = new FormGroup({
      locationName: new FormControl("", [Validators.required]),
      ownershipType: new FormControl("", [Validators.required]),
      typeOfVenue: new FormControl("", [Validators.required]),
      latitude: new FormControl("", [Validators.required]),
      longitude: new FormControl("",),
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
        "uploaFiles": [null],
        "sessionStreamingUrl": "",
        "videoUrls": []
      }
    );
  }
  // Add New row
  onAddRow(index: any) {
    const control = this.programCreationSub?.get("details") as FormArray;
    control.insert(index + 1, this.initiateForm());
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

  formatTime(timeValue: any) {
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const suffix = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM case
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
    }
    return timeValue;
  }

  submitForm() {

    let val = { ...this.programCreationMain.value }
    // this.programCreationSub?.controls["details"]?.value.forEach((element:any,index:any) => {
    //   if(element['uploaFile']){
    //   element['uploaFile']=this.convertToBlob(element['uploaFile']);
    //   }

    // })
    val = { ...this.programCreationMain.value, programSessionList: this.programCreationSub?.controls["details"]?.value }
    console.log(val)
    let maindata = { ...this.programCreationMain.value }
    maindata['activityId'] = 1
    maindata['subActivityId'] = 1
    maindata['locationId'] = 1
    maindata['agencyId'] = 1
    maindata['startTime'] = this.formatTime(maindata['startTime'])
    maindata['endTime'] = this.formatTime(maindata['endTime'])
    maindata['startDate'] = moment(maindata['startDate']).format('DD-MM-YYYY')
    maindata['endDate'] = moment(maindata['endDate']).format('DD-MM-YYYY')
    const programData = JSON.parse(localStorage.getItem('programDetails') || '[]');
    programData.push(val);
    localStorage.setItem('programDetails', JSON.stringify(programData));
    let objectnew: any = [...this.programCreationSub?.controls["details"]?.value];
    //let formData = new FormData();
    //formData.set("data", JSON.stringify(this.programCreationSub?.controls["details"]?.value))

    const apiCalls = objectnew.map((element: any, index: any) => {
      const formData = new FormData();
      //const videoUrls:any = []       
      if (element['uploaFiles']) {
        element['uploaFiles'].forEach((file: any) => {
          formData.append("files", file);
          //videoUrls.push(file.name)          
        })
        //element['videoUrls']=videoUrls
        element['startTime'] = this.formatTime(element['startTime'])
        element['endTime'] = this.formatTime(element['endTime'])
        element['sessionDate'] = moment(element['sessionDate']).format('DD-MM-YYYY')
        element['programId'] = 1
        element['resourceId'] = 1
        delete element['uploaFiles'];
        delete element['meterialType']
        formData.set("data", JSON.stringify(element))
      }

      return this._commonService.uploadImage(formData);
    })
    const programCreationCall = this._commonService.add(APIS.programCreation.addprogram, maindata);
    apiCalls.push(programCreationCall);

    // Parallel API Calls
    forkJoin(apiCalls).subscribe({
      next: (results) => {
        console.log('All API calls completed:', results);
        this.closeModal()
        this.toastrService.success('Program Created Successfully', "Program Creation Success!");
        this.programCreationMain.reset();
        this.programCreationSub.reset();
      },
      error: (err) => {
        console.error('Error in API calls:', err);
        this.closeModal()
        this.toastrService.error(err, "Program Creation Error!");
        this.programCreationMain.reset();
        this.programCreationSub.reset();
      },
    });


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
  onModalSubmitType() {
    if (this.modalFormStype.valid) {
      // Add source type to the array
      const newSourceType = this.modalFormStype.value.name;
      this.sourceTypes.push({
        type: "sourceType",
        values: newSourceType
      });

      this._commonService
      .add(APIS.programCreation.addResource, this.modalFormStype.value)
      .subscribe({
        next: (data) => {
          // this.advanceSearch(this.getSelDataRange);
          // modal.close()
          this.toastrService.success('Resoure Person Created Successfully', "");
          this.getSessionResource()
        },
        error: (err) => {
          this.toastrService.error(err.message, "Location Creation Error!");
          new Error(err);
        },
      });

      

      const addResourceModal = document.getElementById('addResource');
      if (addResourceModal) {
        const modalInstance = bootstrap.Modal.getInstance(addResourceModal);
        modalInstance.hide();
      }
    }
  }
  onModalSubmitLocation() {
    console.log(this.locationForm.value)
    let payload: any = { ...this.locationForm.value }
    payload['typeOfVenue'] == 'Others' ? payload['typeOfVenue'] = payload['OthersType'] : payload['typeOfVenue']
    payload['agencyId'] = '1'
    // payload['filePath']=this.convertToBlob(payload['filePath']);
    delete payload['OthersType']
    this._commonService
      .add(APIS.programCreation.addLocation, payload)
      .subscribe({
        next: (data) => {
          // this.advanceSearch(this.getSelDataRange);
          // modal.close()
          this.toastrService.success('Location Added Successfully', "Program Creation Success!");
          this.getProgramLocation()
        },
        error: (err) => {
          this.toastrService.error(err.message, "Location Creation Error!");
          new Error(err);
        },
      });
  }
  getProgramLocationData: any = []
  getProgramLocation() {
    this._commonService
      .getById(APIS.programCreation.getLocation, '1')
      .subscribe({
        next: (data: any) => {
          this.getProgramLocationData = data.data
          // this.toastrService.success('Location Added Successfully', "Program Creation Success!");
        },
        error: (err: any) => {
          // this.toastrService.error(err.message, "Program Creation Error!");
          new Error(err);
        },
      });
  }
  getSessionResourceData: any = []
  getSessionResource() {
    this._commonService
      .getById(APIS.programCreation.getResource, '1')
      .subscribe({
        next: (data: any) => {
          this.getSessionResourceData = data.data
          // this.toastrService.success('Location Added Successfully', "Program Creation Success!");
        },
        error: (err: any) => {
          // this.toastrService.error(err.message, "Program Creation Error!");
          new Error(err);
        },
      });
  }
  uploadedFiles: any = [];
  onFilesSelected(event: any, index: any) {
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
    let urlsList: any = []
    if (rows && input.files) {
      const newFiles = Array.from(input.files); // Convert FileList to Array
      for (let i = 0; i < input.files.length; i++) {
        const fileName = input.files[i].name; // Get actual file name
        //const fakePath = `C:\\fakepath\\${fileName}`; // Construct fake path
        const fakePath = `${fileName}`; // Construct fake path
        urlsList.push(fakePath); // Push the fake path to the urlsList array
      }
      //console.log(urlsList,'urlsList')
      rows.at(index).get('uploaFiles')?.setValue(newFiles);
      rows.at(index).get('videoUrls')?.setValue(urlsList);
    }

  }
}

/*

onFilesSelected(event: any, index: any) {
    const input = event.target as HTMLInputElement;
    const filesTotl:any = event.target as HTMLInputElement;
    const rows = this.programCreationSub.get('details') as FormArray;
    let urlsList: any = [];

    if (rows && input.files) {
      const newFiles = Array.from(input.files); // Convert FileList to Array
      for(let i=0;i<filesTotl.files.length;i++){
        urlsList.push(filesTotl[i].value)
      }
      // newFiles.forEach((file: any) => {
      //   urlsList.push(URL.createObjectURL(file)); // Push the file URL to the urlsList array
      // });
      console.log(newFiles, 'videoUrls', urlsList);
      rows.at(index).get('uploaFiles')?.setValue(newFiles);
      rows.at(index).get('videoUrls')?.setValue(urlsList);
    }
  }
*/
// {"sessionDate": "01-01-2025","startTime": "10:00 AM","endTime": "12:00 AM","sessionTypeName": "Session","sessionTypeMethodology": "Discussion","sessionDetails": "Sample session details","resourceId": 1,"programId": 1,"videoUrls": ["video1 url","video2 url"],"sessionStreamingUrl": "session streaming2 url"}