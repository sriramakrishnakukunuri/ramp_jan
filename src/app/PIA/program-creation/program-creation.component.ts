import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import moment from "moment";
declare var bootstrap: any;
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;

@Component({
  selector: 'app-program-creation',
  templateUrl: './program-creation.component.html',
  styleUrls: ['./program-creation.component.css']
})
export class ProgramCreationComponent implements OnInit, AfterViewInit {
  programCreationMain!: FormGroup;
  programCreationSub!: FormGroup;
  locationForm!: FormGroup;
  programId: string | null = null;
  agencyId:any
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.formDetails();
    this.formDetailsTwo();
    this.formDetailsLocation();
    
    this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    this.modalFormStype = this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      organizationName: ['', Validators.required],
      qualification: ['', Validators.required],
      designation: ['', Validators.required],
      specialization: ['', Validators.required],
      briefDescription: ['', Validators.required],
      gender: ['', Validators.required],
      agencyIds: [[this.agencyId]],
    });
    this.getProgramLocation();
    this.getSessionResource();
  }

  ngOnInit(): void {
    this.programId = this.route.snapshot.paramMap.get('id');
    if (this.programId) {
      this.getProgramDetailsById(this.programId);
    }
    console.log(this.programId, 'programId');
    (document.getElementById('collapseExample') as HTMLElement).classList.add('show');
    (this.programCreationSub?.controls["details"] as FormArray).clear();
    this.onAddRow(0);
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   new DataTable('#creation-table', {
    //     scrollY: "415px",
    //     scrollX: true,
    //     scrollCollapse: true,
    //     autoWidth: true,
    //     paging: false,
    //     info: false,
    //     searching: false,
    //     destroy: true,
    //   });
    // }, 500);
  }

  get f2() {
    return this.programCreationMain.controls;
  }

  get fLocation() {
    return this.locationForm.controls;
  }

  formDetails() {
    this.programCreationMain = new FormGroup({
      activityId: new FormControl("", [Validators.required]),
      subActivityId: new FormControl("", [Validators.required]),
      programType: new FormControl("", [Validators.required]),
      programDetails: new FormControl("", [Validators.required]),
      programTitle: new FormControl("", [Validators.required]),
      startDate: new FormControl("", [Validators.required]),
      endDate: new FormControl("", [Validators.required]),
      startTime: new FormControl("", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      spocName: new FormControl("", [Validators.required]),
      spocContactNo: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      programLocation: new FormControl("", [Validators.required]),
      kpi: new FormControl("", [Validators.required]),
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
        resourceId: new FormControl("",),
        //meterialType: new FormControl("",),
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
    return this.fb.group({
      sessionDate: "",
      startTime: "",
      endTime: "",
      sessionTypeName: "",
      sessionTypeMethodology: "",
      sessionDetails: "",
      resourceId: '',
      //meterialType: "",
      uploaFiles: [null],
      sessionStreamingUrl: "",
      videoUrls: []
    });
  }

  onAddRow(index: any) {
    const control = this.programCreationSub?.get("details") as FormArray;
    control.push(this.initiateForm());
  }

  onRemoveRow(rowIndex: number) {
    const control = this.programCreationSub?.get("details") as FormArray;
    control.removeAt(rowIndex);
  }

  convertToBlob(file: File): Blob {
    return new Blob([file]);
  }

  formatTime(timeValue: any) {
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const suffix = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
    }
    return timeValue;
  }

  getProgrameIdBasesOnSave:any
  submitProgramCreation() {
    this.getProgrameIdBasesOnSave = ''
    let maindata = { ...this.programCreationMain.value };
    maindata['startTime'] = this.formatTime(maindata['startTime'])
    maindata['endTime'] = this.formatTime(maindata['endTime'])
    maindata['startDate'] = moment(maindata['startDate']).format('DD-MM-YYYY')
    maindata['endDate'] = moment(maindata['endDate']).format('DD-MM-YYYY')
    maindata['locationId'] = 1
    maindata['agencyId'] = this.agencyId
    const programCreationCall = this._commonService.add(APIS.programCreation.addprogram, maindata).subscribe({
      next: (data) => {
        this.getProgrameIdBasesOnSave = data.data
        this.toastrService.success('Program Created Successfully', "Program Creation Success!");
        this.programCreationMain.reset();
        this.programCreationSub.reset();
      },
      error: (err) => {
        this.toastrService.error(err.message, "Program Creation Error!");
        new Error(err);
      },
    })
  }

  submitForm() {
    let val = { ...this.programCreationMain.value };
    val = { ...this.programCreationMain.value, programSessionList: this.programCreationSub?.controls["details"]?.value };
    let maindata = { ...this.programCreationMain.value };
    maindata['activityId'] = 1;
    maindata['subActivityId'] = 1;
    maindata['locationId'] = 1;
    maindata['agencyId'] = this.agencyId;
    maindata['startTime'] = this.formatTime(maindata['startTime']);
    maindata['endTime'] = this.formatTime(maindata['endTime']);
    maindata['startDate'] = moment(maindata['startDate']).format('DD-MM-YYYY');
    maindata['endDate'] = moment(maindata['endDate']).format('DD-MM-YYYY');
    const programData = JSON.parse(localStorage.getItem('programDetails') || '[]');
    programData.push(val);
    localStorage.setItem('programDetails', JSON.stringify(programData));
    let objectnew: any = [...this.programCreationSub?.controls["details"]?.value];

    const apiCalls = objectnew.map((element: any, index: any) => {
      const formData = new FormData();
      if (element['uploaFiles']) {
        element['uploaFiles'].forEach((file: any) => {
          formData.append("files", file);
        });
        element['startTime'] = this.formatTime(element['startTime']);
        element['endTime'] = this.formatTime(element['endTime']);
        element['sessionDate'] = moment(element['sessionDate']).format('DD-MM-YYYY');
        if(this.programId) {
          element['programId'] = Number(this.programId);
        }else if(this.getProgrameIdBasesOnSave){
          element['programId'] = Number(this.getProgrameIdBasesOnSave.programId);
        }else {
          element['programId'] = Number(element['programId'] ? element['programId'] : 1);
        }        
        element['resourceId'] = Number(element['resourceId']);
        delete element['uploaFiles'];
        //delete element['meterialType'];
        formData.set("data", JSON.stringify(element));
      }if(element['uploaFiles'] === null){
        element['startTime'] = this.formatTime(element['startTime']);
        element['endTime'] = this.formatTime(element['endTime']);
        element['sessionDate'] = moment(element['sessionDate']).format('DD-MM-YYYY');
        if(this.programId) {
          element['programId'] = Number(this.programId);
        }else if(this.getProgrameIdBasesOnSave){
          element['programId'] = Number(this.getProgrameIdBasesOnSave.programId);
        }else {
          element['programId'] = Number(element['programId'] ? element['programId'] : 1);
        }        
        element['resourceId'] = Number(element['resourceId']);
        delete element['uploaFiles'];
        delete element['videoUrls'];
        //delete element['meterialType'];
        formData.set("data", JSON.stringify(element));
      }
      return this._commonService.uploadImage(formData);
    });

    forkJoin(apiCalls).subscribe({
      next: (results) => {
        this.closeModal();
        this.toastrService.success('Program Created Successfully', "Program Creation Success!");
        this.programCreationMain.reset();
        this.programCreationSub.reset();
      },
      error: (err) => {
        this.closeModal();
        this.toastrService.error(err, "Program Creation Error!");
        this.programCreationMain.reset();
        this.programCreationSub.reset();
      },
    });
  }

  redirect() {
    this.router.navigate(['/veiw-program-creation']);
  }
  @ViewChild('exampleModal') exampleModal!: ElementRef;

  openModal(): void {
    const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
    modal.show();
  }

  closeModal(): void {
    const modal = bootstrap.Modal.getInstance(this.exampleModal.nativeElement);
    modal.hide();
  }

  modalFormStype!: FormGroup;
  sourceTypes: any = [];

  onModalSubmitType() {
    if (this.modalFormStype.valid) {
      const newSourceType = this.modalFormStype.value;
      this.sourceTypes.push(newSourceType);

      this._commonService
        .add(APIS.programCreation.addResource, this.modalFormStype.value)
        .subscribe({
          next: (data) => {
            this.toastrService.success('Resource Person Created Successfully', "");
            this.getSessionResource();
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
    let payload: any = { ...this.locationForm.value };
    payload['typeOfVenue'] == 'Others' ? payload['typeOfVenue'] = payload['OthersType'] : payload['typeOfVenue'];
    payload['agencyId'] = this.agencyId;
    delete payload['OthersType'];
    this._commonService
      .add(APIS.programCreation.addLocation, payload)
      .subscribe({
        next: (data) => {
          this.toastrService.success('Location Added Successfully', "Program Creation Success!");
          this.getProgramLocation();
        },
        error: (err) => {
          this.toastrService.error(err.message, "Location Creation Error!");
          new Error(err);
        },
      });
  }

  getProgramLocationData: any = [];
  getProgramLocation() {
    this._commonService
      .getById(APIS.programCreation.getLocation, this.agencyId)
      .subscribe({
        next: (data: any) => {
          this.getProgramLocationData = data.data;
        },
        error: (err: any) => {
          new Error(err);
        },
      });
  }

  getSessionResourceData: any = [];
  getSessionResource() {
    this._commonService
      .getById(APIS.programCreation.getResource, this.agencyId)
      .subscribe({
        next: (data: any) => {
          this.getSessionResourceData = data.data;
        },
        error: (err: any) => {
          new Error(err);
        },
      });
  }

  uploadedFiles: any = [];
  // onFilesSelected(event: any, index: any) {
  //   const input = event.target as HTMLInputElement;
  //   const rows = this.programCreationSub.get('details') as FormArray;
  //   let urlsList: any = [];
  //   if (rows && input.files) {
  //     const newFiles = Array.from(input.files);
  //     for (let i = 0; i < input.files.length; i++) {
  //       const fileName = input.files[i].name;
  //       const fakePath = `${fileName}`;
  //       urlsList.push(fakePath);
  //     }
  //     rows.at(index).get('uploaFiles')?.setValue(newFiles);
  //     rows.at(index).get('videoUrls')?.setValue(urlsList);
  //   }
  // }
  validateFileExtension(file: File): boolean {
    const allowedExtensions = ['xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension || '');
  }

  onFilesSelected(event: any, index: any) {
    const input = event.target as HTMLInputElement;
    const rows = this.programCreationSub.get('details') as FormArray;
    let urlsList: any = [];
    if (rows && input.files) {
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
      rows.at(index).get('uploaFiles')?.setValue(validFiles);
      rows.at(index).get('videoUrls')?.setValue(urlsList);
    }
  }

  getProgramDetailsById(programId: string) {
    this._commonService.getById(APIS.programCreation.getSingleProgramsList, programId).subscribe({
      next: (data: any) => {
        const program = data.data;
        this.programCreationMain.patchValue({
          activityId: program.activityId,
          subActivityId: program.subActivityId,
          programType: program.programType,
          programDetails: program.programDetails,
          programTitle: program.programTitle,
          startDate: moment(program.startDate).format('YYYY-MM-DD'),
          endDate: moment(program.endDate).format('YYYY-MM-DD'),
          startTime: this.convertTo24HourFormat(program.startTime),
          endTime: this.convertTo24HourFormat(program.endTime),
          spocName: program.spocName,
          spocContactNo: program.spocContactNo,
          programLocation: program.programLocation,
          kpi: program.kpi,
        });

        const sessionArray = this.programCreationSub.get('details') as FormArray;
        sessionArray.clear();
        if(program.programSessionList.length) {
          program.programSessionList.forEach((session: any, index: any) => {
            const sessionGroup = this.initiateForm();
            sessionGroup.patchValue({
              sessionDate: moment(session.sessionDate).format('YYYY-MM-DD'),
              startTime: this.convertTo24HourFormat(session.startTime),
              endTime: this.convertTo24HourFormat(session.endTime),
              sessionTypeName: session.sessionTypeName,
              sessionTypeMethodology: session.sessionTypeMethodology,
              sessionDetails: session.sessionDetails,
              resourceId: session.resourceId,
              //meterialType: session.meterialType,
              uploaFiles: null,
              sessionStreamingUrl: session.sessionStreamingUrl,
              videoUrls: session.videoUrls,
            });
            sessionArray.push(sessionGroup);
          });
          //this.reinitializeDataTable();
        }else {
          (this.programCreationSub?.controls["details"] as FormArray).clear();
          this.onAddRow(0);
        }
      },
      error: (err: any) => {
        this.toastrService.error(err.message, "Error fetching program details!");
      }
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
    this.dataTable = new DataTable('#creation-table', {              
      // scrollX: true,
      // scrollCollapse: true,    
      // responsive: true,    
      // paging: true,
      // searching: true,
      // ordering: true,
      scrollY: "415px",     
      scrollX:        true,
      scrollCollapse: true,
      autoWidth:         true,  
      paging:         false,  
      info: false,   
      searching: false,  
      order: [[0, 'asc']],
      destroy: true, // Ensure reinitialization doesn't cause issues
      });
  }

  convertTo24HourFormat(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}