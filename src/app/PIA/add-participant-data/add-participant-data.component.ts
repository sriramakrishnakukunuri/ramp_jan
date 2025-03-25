
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import moment from 'moment';
declare var $: any;
@Component({
  selector: 'app-add-participant-data',
  templateUrl: './add-participant-data.component.html',
  styleUrls: ['./add-participant-data.component.css']
})
export class AddParticipantDataComponent implements OnInit {
  ParticipantDataForm!: FormGroup;
  OrganisationForm!: FormGroup;
  submitedData: any = []
  OragnizationType: any = 'SHG'
  agencyId:any
  // udyamYesOrNo:any='No'
  programIds: any = '';
  loginsessionDetails: any;
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    }

  ngOnInit(): void {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
    this.formDetails();
    this.formDetailsOrganization();
    //this.getData()
    this.getOrganizationData()
    //this.getAllPrograms()
    this.getProgramsByAgency()
    //this.fOrg['udyamYesOrNo'].value.setValue('No')
    this.getAllDistricts()
  }

  allDistricts:any
  getAllDistricts(){
    this.allDistricts = []
    this._commonService.getDataByUrl(APIS.masterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    })
  }

  agencyProgramList: any;
  getProgramsByAgency() {
    this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency+'/'+this.loginsessionDetails.agencyId}`).subscribe({
      next: (res: any) => {
        this.agencyProgramList = res?.data
      },
      error: (err) => {
        new Error(err);
      }
    })
  }

  programList: any;
  getAllPrograms() {
    this.programList = []
    this._commonService.getDataByUrl(APIS.programCreation.getProgramsList).subscribe({
      next: (res: any) => {
        this.programList = res?.data
        this.programIds = this.programList[0]?.programId
        this.getData()
      },
      error: (err) => {
        new Error(err);
      }
    })
  }

  dropdownProgramsList(event: any, type: any) {
    this.programIds = event.target.value
    if (type == 'table') {
      this.getData()
    }
  }
  ngAfterViewInit() {

  }
  get f2() {
    return this.ParticipantDataForm.controls;
  }
  get fOrg() {
    return this.OrganisationForm.controls;
  }
  formDetails() {
    this.ParticipantDataForm = new FormGroup({
      // date: new FormControl("", [Validators.required]),
      isAspirant: new FormControl("Aspirant", [Validators.required]),
      organizationId: new FormControl("", [Validators.required,]),
      participantName: new FormControl("", [Validators.required]), //Validators.required
      gender: new FormControl("", [Validators.required,]),
      disability: new FormControl("N", [Validators.required]),
      // noOfDays: new FormControl("", [Validators.required,]),
      category: new FormControl("", [Validators.required]),
      aadharNo: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{12}$/)]),
      mobileNo: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      email: new FormControl("", [Validators.required]),
      designation: new FormControl("", [Validators.required,]),
      isParticipatedBefore: new FormControl("", [Validators.required,]),
      previousParticipationDetails: new FormControl("", [Validators.required,]),
      preTrainingAssessmentConducted: new FormControl("", [Validators.required,]),
      postTrainingAssessmentConducted: new FormControl("", [Validators.required,]),
      isCertificateIssued: new FormControl("N", [Validators.required,]),
      certificateIssueDate: new FormControl("",),
      needAssessmentMethodology: new FormControl("", [Validators.required,]),
      programIds: new FormControl("", [Validators.required,]),
      // TargetSector: new FormControl("",[Validators.required,]),
      // targetAudience: new FormControl("",[Validators.required,]),
      // targetNoOfParticipants: new FormControl("",[Validators.required,]),
    });
  }
  formDetailsOrganization() {
    this.OrganisationForm = new FormGroup({
      // date: new FormControl("", [Validators.required]),
      "organizationName": new FormControl("", [Validators.required,]),
      "organizationCategory": new FormControl("", [Validators.required,]),
      "organizationType": new FormControl("", [Validators.required,]),
      "udyamregistrationNo": new FormControl("", [Validators.required,]),
      "udyamYesOrNo": new FormControl("No", [Validators.required,]),
      "dateOfRegistration": new FormControl("", [Validators.required,]),
      "startupCertificateNo": new FormControl("", [Validators.required,]),
      "natureOfStartup": new FormControl("", [Validators.required,]),
      "areasOfWorking": new FormControl("", [Validators.required,]),
      "incorporationDate": new FormControl("", [Validators.required,]),
      "dateOfIssue": new FormControl("", [Validators.required,]),
      "validUpto": new FormControl("", [Validators.required,]),
      "stateId": new FormControl("", [Validators.required,]),
      "distId": new FormControl("", [Validators.required,]),
      // "sector": new FormControl("", [Validators.required,]),
      "mandal": new FormControl("", [Validators.required,]),
      "town": new FormControl("", [Validators.required,]),
      "streetNo": new FormControl("", [Validators.required,]),
      "houseNo": new FormControl("", [Validators.required,]),
      "latitude": new FormControl("", [Validators.required,]),
      "longitude": new FormControl("", [Validators.required,]),
      "contactNo": new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      "email": new FormControl("", [Validators.required,]),
      "website": new FormControl("", [Validators.required,]),
      "ownerName": new FormControl("", [Validators.required,]),
      "ownerContactNo": new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      "ownerEmail": new FormControl("", [Validators.required,]),
      "ownerAddress": new FormControl("", [Validators.required,]),
      "nameOfTheSHG": new FormControl("", [Validators.required,]),
      "nameOfTheVO": new FormControl("", [Validators.required,]),
      "gramaPanchayat": new FormControl("", [Validators.required,])
    });
  }
  getData() {
    this.submitedData = ''
    // sessionStorage.getItem('ParticipantData')
    // let resList = sessionStorage.getItem('ParticipantData') || ''
    // // let resList = sessionStorage.getItem('ParticipantData') || ''   
    // console.log(resList) 
    // if(resList){
    //   this.submitedData=JSON.parse(resList)
    // }
    this._commonService.getById(APIS.participantdata.getDataByProgramId, this.programIds).subscribe({
      next: (res: any) => {
        this.submitedData = res?.data
        this.reinitializeDataTable();
        // this.advanceSearch(this.getSelDataRange);
        // modal.close()

      },
      error: (err) => {
        this.toastrService.error(err.message, "Participant Data Error!");
        new Error(err);
      },
    });
    // console.log(this.submitedData)
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
    this.dataTable = new DataTable('#view-table-participant', {
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

  Submitform() {
    let payload:any={...this.ParticipantDataForm.value, "programIds": [this.ParticipantDataForm.value.programIds], "organizationId": this.ParticipantDataForm.value.organizationId }
  if(this.f2['isAspirant'].value!='Existing Oragnization'){
    delete payload['organizationId']
    delete payload['programIds']

  }
  if(payload['isCertificateIssued']=='N'){
    delete payload['certificateIssueDate'];
  }
  else{
    payload['certificateIssueDate']=moment(payload['certificateIssueDate']).format('DD-MM-YYYY')
  }
   
    this.submitedData.push(this.ParticipantDataForm.value)
    // sessionStorage.setItem('ParticipantData', this.submitedData)

    sessionStorage.setItem('ParticipantData', JSON.stringify(this.submitedData));

    this._commonService
      .add(APIS.participantdata.add, payload).subscribe({
        next: (data: any) => {
          // this.advanceSearch(this.getSelDataRange);
          this.programIds = this.ParticipantDataForm.value.programIds?this.ParticipantDataForm.value.programIds:this.programList[0]?.programId
          this.getData()
          this.ParticipantDataForm.reset()
          this.formDetails()
          // modal.close()
          this.toastrService.success('Participant Data Added Successfully', "Participant Data Success!");
        },
        error: (err) => {
          this.ParticipantDataForm.reset()
          this.formDetails()
          this.toastrService.error(err.message, "Participant Data Error!");
          new Error(err);
        },
      });
    //this.getData()  
  }
  deleteRow(item: any, i: number) {
    //  this.submitedData.pop(i)
    this.submitedData.splice(i, 1)
    console.log(this.submitedData)
    // this.submitedData.push(this.ParticipantDataForm.value)
    // sessionStorage.setItem('ParticipantData', this.submitedData)
    sessionStorage.setItem('ParticipantData', JSON.stringify(this.submitedData));
    this.getData()
  }
  editRow(item: any, i: any) {
    this.ParticipantDataForm.patchValue({ ...item,certificateIssueDate:'20-02-2222' })
  }
  typeOragnization(event: any) {
    console.log(event.target.value)
    this.OragnizationType = event.target.value
  }
  SubmitformOrganization() {
    console.log(this.OrganisationForm.value)
    if (this.OragnizationType == 'SHG') {
      this.OrganisationForm.value['organizationName'] = this.OrganisationForm.value['nameOfTheSHG']
    }
    this._commonService.add(APIS.participantdata.saveOrgnization, { ...this.OrganisationForm.value }).subscribe({
      next: (data: any) => {
        // this.advanceSearch(this.getSelDataRange);
        // modal.close()
        this.toastrService.success('Organization Data Added Successfully', "Organization Data Success!");
      },
      error: (err) => {
        this.toastrService.error(err.message, "Organization Data Error!");
        new Error(err);
      },
    });
    this.OrganisationForm.reset();
    this.getData()
    this.getOrganizationData()

  }
  OragnizationList(event: any) {
    if (event.target.value === 'Existing Oragnization') {
      this.getOrganizationData();
    }
  }
  OrganizationData: any = []
  getOrganizationData() {
    this._commonService.getDataByUrl(APIS.participantdata.getOrgnizationData).subscribe({
      next: (res: any) => {
        this.OrganizationData = res?.data
        // this.submitedData=res?.data?.data
        // this.advanceSearch(this.getSelDataRange);
        // modal.close()

      },
      error: (err) => {
        this.toastrService.error(err.message, "Organization Data Error!");
        new Error(err);
      },
    });
  }
}
