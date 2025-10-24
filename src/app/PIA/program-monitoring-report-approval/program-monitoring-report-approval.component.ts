import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var bootstrap: any;
import { APIS } from '@app/constants/constants';

import { CommonServiceService } from '@app/_services/common-service.service';

@Component({
  selector: 'app-program-monitoring-report-approval',
  templateUrl: './program-monitoring-report-approval.component.html',
  styleUrls: ['./program-monitoring-report-approval.component.css']
})
export class ProgramMonitoringReportApprovalComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _commonService: CommonServiceService,
    private toastrService: ToastrService
  ) { }

  agencyListFiltered: any;
  agencyList: any;
  selectedAgencyId: any;
  status:any=''
  remarks:any=''
  
  // Track collapse state for each section
  collapseState: { [key: string]: boolean } = {
    preEvent: false,
    audienceProfile: false,
    programDelivery1: false,
    programDelivery2: false,
    logisticsFacilities: false,
    participantsFeedback: false,
    feedbackOnSpeaker: false,
    additionalFields: false
  };
  
  // Track editable state for each section
  isEditable: { [key: string]: boolean } = { 
    preEvent: true, 
    audienceProfile: true, 
    programDelivery1: true,
    programDelivery2: true,
    logisticsFacilities: true,
    participantsFeedback: true,
    feedbackOnSpeaker: true,
    additionalFields: true
  };

  // Forms
  preEventForm!: FormGroup;
  audienceProfileForm!: FormGroup;
  programDeliveryForm1!: FormGroup;
  programDeliveryForm2!: FormGroup;
  logisticsFacilitiesForm!: FormGroup;
  participantsFeedbackForm!: FormGroup;
  feedbackOnSpeakerForm!: FormGroup;
  additionalFieldsForm!: FormGroup;
  
  // Form data from API
  formData: any = "";

  preEventQuestions = [
    { label: 'Program agenda circulated', controlName: 'programAgendaCirculated' },
    { label: 'Program as per schedule', controlName: 'programAsPerSchedule' },
    { label: 'Training material supplied', controlName: 'trainingMaterialSupplied' },
    { label: 'Seating arrangements made', controlName: 'seatingArrangementsMade' },
    { label: 'AV Projector available', controlName: 'avProjectorAvailable' }
  ];

  iaListLeft = ['CoI', 'IITH', 'RICH', 'WEHub', 'CIPET'];
  iaListRight = ['NIMSME', 'TGTPC', 'ALEAP', 'CITD'];
  selectedIAs: string[] = [];
  bestPracticesArray: string[] = ['', '', ''];
  loginData: any;

  ngOnInit(): void {
    const agencyDataGlobal = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.loginData = agencyDataGlobal;

    // Determine if the user is an admin
    const isAdmin = this.loginData?.userRole === 'ADMIN';

    // Set the editable state for all sections based on the user role
    Object.keys(this.isEditable).forEach(key => {
      this.isEditable[key] = isAdmin;
    });

    this.getAgenciesList();
    this.initializeForms();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      this.agencyListFiltered = this.agencyList;
      this.selectedAgencyId = this.agencyListFiltered[0]?.agencyId;
      this.getProgramsByAgency(this.selectedAgencyId);
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }
  saveApproal(){
    if(!this.selectedUserId){
      this.toastrService.error('No User Data Found' );
      return;
    }
    if(!this.status){
      this.toastrService.error('Please select status' );
      return;
    }
    if(!this.remarks){
      this.toastrService.error('Please enter remarks' );
      return;
    }
    const finalData={
        "programId": Number(this.selectedProgramId),
        "programMonitoringId": Number(this.selectedUserId),
        "agencyId": Number(this.selectedAgencyId),
        "status": this.status,
        "remarks": this.remarks
    }
    this._commonService.add(`${APIS.programFeedback.approvalFeedbackData}`, finalData).subscribe(
      (response: any) => {
        this.toastrService.success(`Status Updated successfully`);
        this.getAgenciesBasedUserList(this.selectedProgramId);
        this.status=''
        this.remarks=''
      },
      (error) => {
        this.toastrService.error(`Failed to update Report`);
      }
    );
  }
  programList: any;
  programListFiltered: any
  selectedProgramId: any;
   getProgramsByAgency(agencyId: any) {
   this.selectedAgencyId = agencyId;  
    this._commonService
      .getDataByUrl(`${APIS.programCreation.getNewProgramListByAgency + this.selectedAgencyId}?statuses=Participants%20Added&statuses=Attendance%20Marked&statuses=Program%20Execution%20Updated&statuses=Program%20Execution&statuses=Program%20Expenditure%20Updated`)
      .subscribe({
        next: (res: any) => {
          this.programList= res.data;
          this.programList = this.programList;
          this.programListFiltered = this.programList;
          this.selectedProgramId= this.programListFiltered[0]?.programId;
          if(res.data.length>0){
            this.getAgenciesBasedUserList(this.selectedProgramId);
          }
          
        },
        error: (err) => {
          
        },
      });
  }
  UserList:any=[]
  UserListFiltered:any=[]
  selectedUserId:any
  getAgenciesBasedUserList(user:any) {
     this.selectedProgramId = user;
    this.UserList = [];
    this._commonService.getDataByUrl(APIS.masterList.getUserBasedOnAgency+user).subscribe((res: any) => {
      this.UserList = res.data;
      this.UserListFiltered = this.UserList;
      this.selectedUserId= this.UserListFiltered[0]?.programMonitoringId;
      this.formData=[]
      if(res.data.length>0){
        this.fetchReportData(this.selectedUserId);

      }
      
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }

  onAgencyChange(value: any) {
    this.selectedUserId = value;
    // When agency is selected, fetch report data
    if (value) {
      this.fetchReportData(value);
    }
     this.fetchReportData(value);
  }

  fetchReportData(agencyId: any) {
    if(agencyId){
      this._commonService.getDataByUrl(`${APIS.programFeedback.getFeedbackData}${agencyId}`).subscribe(
      (response: any) => {
        this.formData = response.data;
        this.mapResponseToForms();
      },
      (error) => {
        this.toastrService.error('Failed to load report data');
      }
    );
    }
    else{
      this.toastrService.error('No User Data Found' );
    }
    
  }

  mapResponseToForms() {
    if (!this.formData) {
      // If there's no form data at all, ensure the array is reset for a fresh form
      this.bestPracticesArray = ['', '', ''];
      return;
    }

    // Map API data to forms
    this.preEventForm.patchValue(this.formData);
    this.audienceProfileForm.patchValue(this.formData);
    if (this.formData.noIAsParticipated) {
      this.selectedIAs = [...this.formData.noIAsParticipated];
    } else {
      this.selectedIAs = [];
    }
    this.programDeliveryForm1.patchValue(this.formData);
    this.programDeliveryForm2.patchValue(this.formData);
    this.logisticsFacilitiesForm.patchValue(this.formData);
    this.participantsFeedbackForm.patchValue(this.formData);
    this.feedbackOnSpeakerForm.patchValue(this.formData);
    this.additionalFieldsForm.patchValue(this.formData);
      
    // Correctly handle bestPracticesIdentified
    const practices = this.formData.bestPracticesIdentified || [];
    this.bestPracticesArray = [
      practices[0] || '',
      practices[1] || '',
      practices[2] || ''
    ];
  }

  initializeForms() {
    this.preEventForm = this.fb.group({
      programAgendaCirculated: [null, Validators.required],
      programAsPerSchedule: [null, Validators.required],
      trainingMaterialSupplied: [null, Validators.required],
      seatingArrangementsMade: [null, Validators.required],
      avProjectorAvailable: [null, Validators.required],
      howDidYouKnowAboutProgram: [null, Validators.required]
    });

    this.audienceProfileForm = this.fb.group({
      participantsMale: [null, Validators.required],
      participantsFemale: [null, Validators.required],
      participantsTransgender: [null, Validators.required],
      dicRegistrationParticipated: [null, Validators.required],
      shgRegistrationParticipated: [null, Validators.required],
      msmeRegistrationParticipated: [null, Validators.required],
      startupsRegistrationParticipated: [null, Validators.required],
      noIAsParticipated: [[]]
    });

    this.programDeliveryForm1 = this.fb.group({
      speaker1Name: [''],
      topicAsPerSessionPlan1: [null, Validators.required],
      timeTaken1: [null],
      audioVisualAidUsed1: [null, Validators.required],
      relevance1: [null, Validators.required],
      sessionContinuity1: [null, Validators.required],
      participantInteraction1: [null, Validators.required]
    });
    
    this.programDeliveryForm2 = this.fb.group({
      speaker2Name: [''],
      topicAsPerSessionPlan2: [null, Validators.required],
      timeTaken2: [null],
      audioVisualAidUsed2: [null, Validators.required],
      relevance2: [null, Validators.required],
      sessionContinuity2: [null, Validators.required],
      participantInteraction2: [null, Validators.required]
    });

    this.logisticsFacilitiesForm = this.fb.group({
      venueQuality: [null, Validators.required],
      accessibility: [null, Validators.required],
      teaSnacks: [null, Validators.required],
      lunch: [null, Validators.required],
      cannedWater: [null, Validators.required],
      toiletHygiene: [null, Validators.required],
      avEquipment: [null, Validators.required],
      stationary: [null, Validators.required]
    });

    this.participantsFeedbackForm = this.fb.group({
      relevant: [null, Validators.required],
      enthusiast: [null, Validators.required],
      feltUseful: [null, Validators.required],
      futureWillingToEngage: [null, Validators.required]
    });

    this.feedbackOnSpeakerForm = this.fb.group({
      qualified: [null, Validators.required],
      experienced: [null, Validators.required],
      certified: [null, Validators.required],
      deliveryMethodologyGood: [null, Validators.required],
      relevantExperience: [null, Validators.required]
    });

    this.additionalFieldsForm = this.fb.group({
      overallObservation: [''],
      bestPracticesIdentified: [[]]
    });
  }

  onIACheckboxChange(event: any, iaName: string) {
    if (event.target.checked) {
      this.selectedIAs.push(iaName);
    } else {
      const index = this.selectedIAs.indexOf(iaName);
      if (index > -1) {
        this.selectedIAs.splice(index, 1);
      }
    }
    this.audienceProfileForm.patchValue({
      noIAsParticipated: this.selectedIAs
    });
  }

  clearBestPractice(index: number) {
    this.bestPracticesArray[index] = '';
  }

  toggleCollapse(section: string) {
    this.collapseState[section] = !this.collapseState[section];
  }

  toggleEdit(section: string) {
    this.isEditable[section] = !this.isEditable[section];
    
    // If turning off edit mode, revert changes if no save was made
    if (!this.isEditable[section] && this.formData) {
      this.mapResponseToForms();
    }
  }

  updateSection(section: string) {
    let formData: any;
    
    switch(section) {
      case 'preEvent':
        formData = {...this.preEventForm.value, stepNumber: 1}
        break;
      case 'audienceProfile':
        formData = {...this.audienceProfileForm.value, stepNumber: 2}
        break;
      case 'programDelivery1':
        formData = {...this.programDeliveryForm1.value, stepNumber: 3}
        break;
      case 'programDelivery2':
        formData = {...this.programDeliveryForm2.value, stepNumber: 4}
        break;
      case 'logisticsFacilities':
        formData = {...this.logisticsFacilitiesForm.value, stepNumber: 5}
        break;
      case 'participantsFeedback':
        formData = {...this.participantsFeedbackForm.value, stepNumber: 6}
        break;
      case 'feedbackOnSpeaker':
        formData = {...this.feedbackOnSpeakerForm.value, stepNumber: 7}
        break;
      case 'additionalFields':
        // Filter out any empty strings before sending
        const nonEmptyPractices = this.bestPracticesArray.filter(p => p.trim() !== '');
        
        formData = {
          ...this.additionalFieldsForm.value, 
          stepNumber: 8,
          bestPracticesIdentified: nonEmptyPractices
        };
        break;
      default:
        return;
    }

    // Prepare final data with all required fields
    const finalData = {
      agencyId: Number(this.selectedAgencyId),
      district: '', // You might need to get this from somewhere
      programId: 0, // You might need to get this from somewhere
      userId: Number(this.selectedUserId), // Convert to number
      ...formData
    };
    if(!this.selectedUserId){
      this.toastrService.error('No User Data Found' );
      return;
    }
    this._commonService.add(`${APIS.programFeedback.updateFeedbackData}${this.selectedUserId?this.selectedUserId:1}`, finalData).subscribe(
      (response: any) => {
        this.toastrService.success(`${this.getSectionTitle(section)} updated successfully`);
        // this.isEditable[section] = false;
        this.fetchReportData(this.selectedUserId);
        
        // Update local data
        if (!this.formData) this.formData = {};
        this.formData[section] = formData;
      },
      (error) => {
        this.toastrService.error(`Failed to update ${this.getSectionTitle(section)}`);
      }
    );
  }

  // Add this new method
  updateBestPractice(event: any, index: number) {
    this.bestPracticesArray[index] = event.target.value;
  }

  getSectionTitle(section: string): string {
    switch(section) {
      case 'preEvent': 
        return 'Pre-Event Preparation';
      case 'audienceProfile':
        return 'Audience Profile';
      case 'programDelivery1':
        return 'Program Delivery - Session 1';
      case 'programDelivery2':
        return 'Program Delivery - Session 2';
      case 'logisticsFacilities':
        return 'Logistics / Facilities';
      case 'participantsFeedback':
        return 'Participants Feedback';
      case 'feedbackOnSpeaker':
        return 'Speaker Evaluation';
      case 'additionalFields':
        return 'Additional Information';
      default:
        return '';
    }
  }
}
