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
    programDelivery2: false
  };
  
  // Track editable state for each section
  isEditable: { [key: string]: boolean } = { 
    preEvent: false, 
    audienceProfile: false, 
    programDelivery1: false,
    programDelivery2: false 
  };

  // Forms
  preEventForm!: FormGroup;
  audienceProfileForm!: FormGroup;
  programDeliveryForm1!: FormGroup;
  programDeliveryForm2!: FormGroup;
  
  // Form data from API
  formData: any = "";

  preEventQuestions = [
    { label: 'Program agenda circulated', controlName: 'agendaCirculated' },
    { label: 'Program as per schedule', controlName: 'asPerSchedule' },
    { label: 'Training material supplied', controlName: 'materialSupplied' },
    { label: 'Seating arrangements made', controlName: 'seatingArrangements' },
    { label: 'AV Projector available', controlName: 'avProjector' }
  ];

  iaListLeft = ['CoI', 'IITH', 'RICH', 'WEHub', 'CIPET'];
  iaListRight = ['NIMSME', 'TGTPC', 'ALEAP', 'CITD'];

  ngOnInit(): void {
    this.getAgenciesList();
    this.initializeForms();
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

  onAgencyChange(value: any) {
    this.selectedAgencyId = value;
    // When agency is selected, fetch report data
    if (value) {
      this.fetchReportData(value);
    }
  }

  fetchReportData(agencyId: string) {
    // This is a placeholder for your actual API call
    // Replace with actual implementation
    this._commonService.getDataByUrl(`${APIS.Attendance.getDeatails}/${agencyId}`).subscribe(
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
    if (this.formData.preEvent) {
      this.preEventForm.patchValue(this.formData.preEvent);
    }
    
    if (this.formData.audienceProfile) {
      this.audienceProfileForm.patchValue(this.formData.audienceProfile);
    }
    
    if (this.formData.programDelivery && this.formData.programDelivery.length > 0) {
      if (this.formData.programDelivery[0]) {
        this.programDeliveryForm1.patchValue(this.formData.programDelivery[0]);
      }
      
      if (this.formData.programDelivery[1]) {
        this.programDeliveryForm2.patchValue(this.formData.programDelivery[1]);
      }
    }
  }

  initializeForms() {
    this.preEventForm = this.fb.group({
      agendaCirculated: [null, Validators.required],
      asPerSchedule: [null, Validators.required],
      materialSupplied: [null, Validators.required],
      seatingArrangements: [null, Validators.required],
      avProjector: [null, Validators.required],
      participantSource: [null, Validators.required]
    });

    this.audienceProfileForm = this.fb.group({
      maleRepresentation: [null, Validators.required],
      femaleRepresentation: [null, Validators.required],
      transgenderRepresentation: [null, Validators.required],
      dicRepresentatives: [null, Validators.required],
      shgRepresentatives: [null, Validators.required],
      msmeRepresentatives: [null, Validators.required],
      startupRepresentatives: [null, Validators.required],
      CoI: [false],
      IITH: [false],
      RICH: [false],
      WEHub: [false],
      CIPET: [false],
      NIMSME: [false],
      TGTPC: [false],
      ALEAP: [false],
      CITD: [false]
    });

    this.programDeliveryForm1 = this.fb.group({
      speakerName: [''],
      topicsAsPerSessionPlan: [null, Validators.required],
      timeTaken: [''],
      audioVisualAidUsed: [null, Validators.required],
      relevance: [null, Validators.required],
      sessionContinuity: [null, Validators.required],
      participantsInteraction: [null, Validators.required]
    });
    
    this.programDeliveryForm2 = this.fb.group({
      speakerName: [''],
      topicsAsPerSessionPlan: [null, Validators.required],
      timeTaken: [''],
      audioVisualAidUsed: [null, Validators.required],
      relevance: [null, Validators.required],
      sessionContinuity: [null, Validators.required],
      participantsInteraction: [null, Validators.required]
    });
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
    let formData:any;
    
    switch(section) {
      case 'preEvent':
        formData = this.preEventForm.value;
        break;
      case 'audienceProfile':
        formData = this.audienceProfileForm.value;
        break;
      case 'programDelivery1':
        formData = this.programDeliveryForm1.value;
        break;
      case 'programDelivery2':
        formData = this.programDeliveryForm2.value;
        break;
      default:
        return;
    }

    // This is a placeholder for your actual API call
    // Replace with actual implementation
    this._commonService.getById(`${APIS.Attendance.getDeatails}/${section}`, formData).subscribe(
      (response: any) => {
        this.toastrService.success(`${this.getSectionTitle(section)} updated successfully`);
        this.isEditable[section] = false;
        
        // Update local data
        if (!this.formData) this.formData = {};
        if (section === 'programDelivery1' || section === 'programDelivery2') {
          if (!this.formData.programDelivery) this.formData.programDelivery = [];
          this.formData.programDelivery[section === 'programDelivery1' ? 0 : 1] = formData;
        } else {
          this.formData[section] = formData;
        }
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
      default:
        return '';
    }
  }
}
