import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var bootstrap: any;
import { APIS } from '@app/constants/constants';

import { CommonServiceService } from '@app/_services/common-service.service';
@Component({
  selector: 'app-progress-monitoring-report',
  templateUrl: './progress-monitoring-report.component.html',
  styleUrls: ['./progress-monitoring-report.component.css']
})
export class ProgressMonitoringReportComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _commonService: CommonServiceService,
    private toastrService: ToastrService
  ) { }

  agencyListFiltered: any;
  agencyList: any;
  selectedAgencyId: any;
  
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
    preEvent: false, 
    audienceProfile: false, 
    programDelivery1: false,
    programDelivery2: false,
    logisticsFacilities: false,
    participantsFeedback: false,
    feedbackOnSpeaker: false,
    additionalFields: false
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
  bestPracticesList: string[] = [];

  ngOnInit(): void {
    this.getAgenciesList();
    this.initializeForms();
     this.fetchReportData(1);
  }

  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      this.agencyListFiltered = this.agencyList;
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }
  UserList:any=[]
  UserListFiltered:any=[]
  selectedUserId:any
  getAgenciesBasedUserList(user:any) {
     this.selectedAgencyId = user;
    this.UserList = [];
    this._commonService.getDataByUrl(APIS.masterList.getUserBasedOnAgency+user).subscribe((res: any) => {
      this.UserList = res.data;
      this.UserListFiltered = this.UserList;
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
    this._commonService.getDataByUrl(`${APIS.programFeedback.getFeedbackData}${agencyId?agencyId:1}`).subscribe(
      (response: any) => {
        this.formData = response.data;
        this.mapResponseToForms();
      },
      (error) => {
        this.toastrService.error('Failed to load report data');
      }
    );
  }

  mapResponseToForms() {
    if (!this.formData) return;

    // Map API data to forms
    if (this.formData) {
      this.preEventForm.patchValue(this.formData);
    }
    
    if (this.formData) {
      this.audienceProfileForm.patchValue(this.formData);
      
      // Handle IA checkboxes
      if (this.formData) {
        this.selectedIAs = [...this.formData.noIAsParticipated];
      }
    }
       if (this.formData) {
        this.programDeliveryForm1.patchValue(this.formData);
      }
       if (this.formData) {
        this.programDeliveryForm2.patchValue(this.formData);
      }
   

    if (this.formData) {
      this.logisticsFacilitiesForm.patchValue(this.formData);
    }

    if (this.formData) {
      this.participantsFeedbackForm.patchValue(this.formData);
    }

    if (this.formData) {
      this.feedbackOnSpeakerForm.patchValue(this.formData);
    }

    if (this.formData) {
      this.additionalFieldsForm.patchValue(this.formData);
      if (this.formData.bestPracticesIdentified) {
        this.bestPracticesList = [...this.formData.bestPracticesIdentified];
      }
    }
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

  addBestPractice(input: HTMLInputElement) {
    const practice = input.value.trim();
    if (practice && !this.bestPracticesList.includes(practice)) {
      this.bestPracticesList.push(practice);
      this.additionalFieldsForm.patchValue({
        bestPracticesIdentified: this.bestPracticesList
      });
      input.value = '';
    }
  }

  removeBestPractice(practice: string) {
    const index = this.bestPracticesList.indexOf(practice);
    if (index > -1) {
      this.bestPracticesList.splice(index, 1);
      this.additionalFieldsForm.patchValue({
        bestPracticesIdentified: this.bestPracticesList
      });
    }
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
        formData = {...this.additionalFieldsForm.value, stepNumber: 8}
        break;
      default:
        return;
    }

    // Prepare final data with all required fields
    const finalData = {
      agencyId: Number(this.selectedAgencyId),
      district: '', // You might need to get this from somewhere
      programId: 0, // You might need to get this from somewhere
      userId: 'string', // You might need to get this from authentication // You might need to set this appropriately
      ...formData
    };

    this._commonService.add(`${APIS.programFeedback.updateFeedbackData}${this.selectedUserId?this.selectedUserId:1}`, finalData).subscribe(
      (response: any) => {
        this.toastrService.success(`${this.getSectionTitle(section)} updated successfully`);
        this.isEditable[section] = false;
        
        // Update local data
        if (!this.formData) this.formData = {};
        this.formData[section] = formData;
      },
      (error) => {
        this.toastrService.error(`Failed to update ${this.getSectionTitle(section)}`);
      }
    );
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