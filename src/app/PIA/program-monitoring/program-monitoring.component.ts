import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LogisticsEvaluation, PreEventChecklist, ProgramDeliveryDetail } from './pages/models';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from '@app/_services/common-service.service';
import { Router } from '@angular/router';
import { APIS } from '@app/constants/constants';

@Component({
  selector: 'app-program-monitoring',
  templateUrl: './program-monitoring.component.html',
  styleUrls: ['./program-monitoring.component.css']
})
export class ProgramMonitoringComponent implements OnInit {
  programForm!: FormGroup;
  programDeliveryDetailsForm!: FormGroup;
  currentStep = 1;
  totalSteps = 11;
  agencyId: any;
  programIds:any
  loginsessionDetails: any;
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService, private router: Router,) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
      this.createForm();
      this.addProgramDeliveryDetail()
      this.loadProgramFeedback(2);
    }
 

  ngOnInit(): void {
    // Load data if editing (example with ID 152)
    // this.loadProgramFeedback(152);
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
    
      this.getProgramsByAgency( this.agencyId )
  }
  agencyProgramList: any;
  getProgramsByAgency(agency:any) {
    this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgencyStatus+'/'+(this.loginsessionDetails.agencyId?this.loginsessionDetails.agencyId:this.agencyId)+'/status?status=Program Scheduled'}`).subscribe({
      next: (res: any) => {
        this.agencyProgramList = res?.data
        if(res.data?.length){
          this.programIds = this.agencyProgramList[0].programId
          this.loadProgramFeedback(this.programIds);
        }
      
      },
      error: (err) => {
        new Error(err);
      }
    })
  }
  checklistItems = [
    { name: 'Program Agenda Circulated', key: 'programAgendaCirculated' },
    { name: 'Speaker Confirmations', key: 'speakerConfirmations' },
    { name: 'Training Materials Printed', key: 'trainingMaterialsPrinted' },
    { name: 'Invitations Sent', key: 'invitationsSent' },
    { name: 'Seating Arrangements Ready', key: 'seatingArrangementsReady' },
    { name: 'AV/Projector Tested', key: 'avProjectorTested' }
  ];
  evaluationItems = [
    { parameter: 'Venue Quality', key: 'venueQuality' },
    { parameter: 'Venue Accessibility for the persons with Disabilities', key: 'venueAccessibility' },
    { parameter: 'Food Quality (Lunch / Tea / Snacks)', key: 'foodQuality' },
    { parameter: 'Drinking Water Facility', key: 'drinkingWater' },
    { parameter: 'Toilet Hygiene', key: 'toiletHygiene' },
    { parameter: 'Projector / AV Equipment', key: 'avEquipment' },
    { parameter: 'Stationary Availability', key: 'stationary' },
    { parameter: 'Speaker Accommodation', key: 'speakerAccommodation' },
    { parameter: 'Speaker Travel Arrangements', key: 'travelArrangements' }
  ];
  get fMon(){
    return this.programForm.controls;
  }
  addProgramDeliveryDetail(item?: ProgramDeliveryDetail): void {
    this.programDeliveryDetailsForm=this.fb.group({
      speakerName: ['', Validators.required],
      topicDelivered: ['', Validators.required],
      timeTaken: ['', [Validators.required, Validators.min(1)]],
      audioVisualUsed: [false],
      relevance: ['', ],
      speakerEffectiveness: [1, [ Validators.min(1), Validators.max(5)]]
    });
  }
  createForm():any {
    this.programForm = this.fb.group({
      // Step 1: Basic Information
      state: ['', Validators.required],
      district: ['', Validators.required],
      dateOfMonitoring: ['', Validators.required],
      agencyName: ['', Validators.required],
      programType: ['', Validators.required],
      programName: ['', Validators.required],
      venueName: ['', Validators.required],
      hostingAgencyName: ['', Validators.required],
      spocName: ['', Validators.required],
      spocContact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      inTime: ['', Validators.required],
      outTime: ['', Validators.required],

      // Step 2: Audience Profile
      maleParticipants: [0, Validators.min(0)],
      femaleParticipants: [0, Validators.min(0)],
      transGenderParticipants: [0, Validators.min(0)],
      totalParticipants: [0, Validators.min(0)],
      noOfSHG: [0, Validators.min(0)],
      noOfMSME: [0, Validators.min(0)],
      noOfStartup: [0, Validators.min(0)],
      noOfDIC: [0, Validators.min(0)],
      noOfIAs: [0, Validators.min(0)],
      noOfOthers: [0, Validators.min(0)],
      noOfSC: [0, Validators.min(0)],
      noOfST: [0, Validators.min(0)],
      noOfOC: [0, Validators.min(0)],
      noOfBC: [0, Validators.min(0)],
      noOfMinority: [0, Validators.min(0)],

      // Step 3: Pre-Event Preparation
      preEventChecklists: this.fb.array([]),

      // Step 4: Program Delivery Details
      programDeliveryDetails: this.fb.array([]),

      // Step 5: Program Execution
      timingPunctuality: [''],
      sessionContinuity: [''],
      participantInterestLevel: [''],
      overallEnergyEngagement: [''],
      unforeseenIssues: [''],

      // Step 6: Logistics & Facilities Evaluation
      logisticsEvaluations: this.fb.array([]),

      // Step 7: Post-Training Assessment
      participantsFeedbackCollected: [false],
      resourceFeedbackCollected: [false],
      prePostTestsConducted: [false],
      learningHighlights: [''],

      // Step 8: Document Checklist
      attendanceSheet: [false],
      registrationForms: [false],
      participantFeedBack: [false],
      speakerFeedBack: [false],
      photographsAttached: [false],
      summaryReportPrepared: [false],

      // Step 9: Observations, Challenges, Best Practices
      observedPractices: [''],
      challengesFaced: [''],
      issuesAndCorrections: [''],

      // Step 10: Overall Program Rating
      overallProgramOrganization: [0, [Validators.min(1), Validators.max(5)]],
      qualityOfSessions: [0, [Validators.min(1), Validators.max(5)]],
      participantsSatisfaction: [0, [Validators.min(1), Validators.max(5)]],
      impactPotential: [0, [Validators.min(1), Validators.max(5)]],

      // Step 11: Additional Remarks
      additionalRemarks: ['']
    });

    // Initialize dynamic form arrays
    this.addPreEventChecklist();
    this.createdynamiclogisticsEvaluations();
    // this.addLogisticsEvaluation();
  }
  convertToISOFormat(date: string): string {
    console.log(date)
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Convert to yyyy-MM-dd format
  }
  loadProgramFeedback(id: number): void {
    if(this.currentStep==1){
      this._commonService.getDataByUrl(APIS.programMonitoring.getProgramMonitoringById+id).subscribe
      ({
        next: (data) => {
          console.log(data,'resp')
          // this.programForm.reset();
          this.programForm.patchValue({
            ...data.data,
            dateOfMonitoring: this.convertToISOFormat(data.data.dateOfMonitoring)
          });
        },
        error: (err) => {
          this.toastrService.error(err.message, "Location Creation Error!");
          new Error(err);
        },
      });
    }
    else{
      this._commonService.getDataByUrl(APIS.programMonitoring.getProgramMonitoringByIdUpdated+id).subscribe
      ({
        next: (data) => {
          console.log(data,'resp')
          // this.currentStep=data.data[0]?.stepNumber+1 
          console.log(this.currentStep)
          this.programForm.reset();
          this.createForm()
          console.log(data.data[0], this.programForm.value)
          this.programForm.patchValue({
            ...data.data[0],
            dateOfMonitoring:data.data[0]?.dateOfMonitoring?this.convertToISOFormat(data.data[0].dateOfMonitoring): null
          });
        
    
          // Clear existing arrays
          // this.preEventChecklists.clear();
          // // this.programDeliveryDetails.clear();
          // this.logisticsEvaluations.clear();
    
          // Add items to arrays
          // if(data.data[0]?.preEventChecklists?.length){
          //   data.data[0]?.preEventChecklists?.forEach((item:any) => this.addPreEventChecklist(item));
          // }
          // else{
          //   this.checklistItems.map((checklist) => {
          //     this.preEventChecklists.push(this.createChecklistGroup(checklist));
          //   })
          // }
          // console.log(  this.preEventChecklists)
          // if(data.data[0]?.logisticsEvaluations?.length){
          //   data.data[0]?.preEventChecklists?.forEach((item:any) => this.addLogisticsEvaluation(item));
          // }
          // else{
          //   this.evaluationItems.map((checklist:any) => {this.addLogisticsEvaluation(checklist)
          //     console.log(checklist)
          //   })
          // }
          // data.programDeliveryDetails.forEach((item:any) => this.addProgramDeliveryDetail(item));
         
        },
        error: (err) => {
          this.toastrService.error(err.message, "Location Creation Error!");
          new Error(err);
        },
      });
    }

  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Form Array Getters
  get preEventChecklists(): FormArray {
    return this.programForm.get('preEventChecklists') as FormArray;
  }

  // get programDeliveryDetails(): FormArray {
  //   return this.programForm.get('programDeliveryDetails') as FormArray;
  // }

  get logisticsEvaluations(): FormArray {
    return this.programForm.get('logisticsEvaluations') as FormArray;
  }

  // Dynamic Form Controls
  addPreEventChecklist(item?: PreEventChecklist): void {
    this.checklistItems.map((checklist) => {
      this.preEventChecklists.push(this.createChecklistGroup(checklist));
    })
    console.log(this.preEventChecklists.value,this.preEventChecklists.controls)
  }
  

  createChecklistGroup(item: any): FormGroup {
    return this.fb.group({
      name: [item.name],
      status: [false], // Initialize with null for unselected state
      remarks: ['']
    });
  }


  createdynamiclogisticsEvaluations(){
    console.log(this.logisticsEvaluations.value,this.evaluationItems)
    this.evaluationItems.map((checklist:any) => {
      this.addLogisticsEvaluation(checklist)
        })
  }
  addLogisticsEvaluation(item?: LogisticsEvaluation): void {
    this.logisticsEvaluations.push(this.fb.group({
      parameter: [item?.parameter || '', Validators.required],
      rating: [item?.rating || 1, [ Validators.min(1), Validators.max(5)]],
      remarks: [item?.remarks || '']
    }));
    console.log(this.logisticsEvaluations.value)
  }

  // Step Navigation
  nextStep(): void {
    if(this.currentStep==1){
      // this.programForm.get('programName')?.setValue(this.programIds)
      this.saveProgramData('save')
    }
    else{
      this.saveProgramData('update');
    }
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateProgressBar();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgressBar();
    }
  }
  saveProgramData(type:any){
    if(type=='update'){
      let Payload:any={...this.programForm.value,stepNumber:this.currentStep,logisticsEvaluations:this.programForm.value?.logisticsEvaluations?this.programForm.value?.logisticsEvaluations:[],programDeliveryDetails:this.programForm.value?.programDeliveryDetails?this.programForm.value?.programDeliveryDetails:[],preEventChecklists:this.programForm.value?.preEventChecklists?this.programForm.value?.preEventChecklists:[]}
      console.log(this.programForm.value,this.programForm.value?.preEventChecklists)
      if(this.currentStep==3){
        Payload={stepNumber:this.currentStep,progpreEventChecklists:this.programForm.value?.preEventChecklists?this.programForm.value?.preEventChecklists:[],programId:2,programDeliveryDetails:[],logisticsEvaluations:[]}
      }
      else if(this.currentStep==4){
        Payload={stepNumber:this.currentStep,programId:2,programDeliveryDetails:this.programForm.value?.programDeliveryDetails?this.programForm.value?.programDeliveryDetails:[],preEventChecklists:[],logisticsEvaluations:[]}
      }
      else if(this.currentStep==5){
        Payload={stepNumber:this.currentStep,programId:2,timingPunctuality:this.programForm.value?.timingPunctuality?this.programForm.value?.timingPunctuality:'',sessionContinuity:this.programForm.value?.sessionContinuity?this.programForm.value?.sessionContinuity:'',participantInterestLevel:this.programForm.value?.participantInterestLevel?this.programForm.value?.participantInterestLevel:'',overallEnergyEngagement:this.programForm.value?.overallEnergyEngagement?this.programForm.value?.overallEnergyEngagement:'',unforeseenIssues:this.programForm.value?.unforeseenIssues?this.programForm.value?.unforeseenIssues:''}
      }
      else if(this.currentStep==6){
        Payload={stepNumber:this.currentStep,programId:2,logisticsEvaluations:this.programForm.value?.logisticsEvaluations?this.programForm.value?.logisticsEvaluations:[],preEventChecklists:[],programDeliveryDetails:[]}
      }
      else{
        Payload={...this.programForm.value,stepNumber:this.currentStep,logisticsEvaluations:this.programForm.value?.logisticsEvaluations?this.programForm.value?.logisticsEvaluations:[],programDeliveryDetails:this.programForm.value?.programDeliveryDetails?this.programForm.value?.programDeliveryDetails:[],preEventChecklists:this.programForm.value?.preEventChecklists?this.programForm.value?.preEventChecklists:[]}
      }

     
    this._commonService.add(APIS.programMonitoring.updateProgramMonitoring+2, Payload).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.loadProgramFeedback(2)
        // Show success message
      },
      error: (error) => {
        console.error('Error:', error);
        // Show error message
      }
    });
    }
    else{
      let Payload:any={...this.programForm.value,stepNumber:this.currentStep,logisticsEvaluations:[],programDeliveryDetails:[],preEventChecklists:[],programId:1}
    this._commonService.add(APIS.programMonitoring.saveProgramMonitoring, Payload).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.loadProgramFeedback(2)
        // Show success message
      },
      error: (error) => {
        console.error('Error:', error);
        // Show error message
      }
    });
    }
    
  }
  updateProgressBar(): void {
    const progress = (this.currentStep / this.totalSteps) * 100;
    // Update your progress bar here (implementation depends on your UI)
  }

  // onSubmit(): void {
  //   if (this.programForm.valid) {
  //     const formData = this.programForm.value;
  //     // Format date if needed
  //     formData.dateOfMonitoring = new Date(formData.dateOfMonitoring).toISOString().split('T')[0];

  //     this.programFeedbackService.updateProgramFeedback(152, formData).subscribe({
  //       next: (response) => {
  //         console.log('Success:', response);
  //         // Show success message
  //       },
  //       error: (error) => {
  //         console.error('Error:', error);
  //         // Show error message
  //       }
  //     });
  //   } else {
  //     // Mark all fields as touched to show validation messages
  //     this.markFormGroupTouched(this.programForm);
  //   }
  // }

  markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // Form Submission
  submit(){

    console.log(this.programForm.value,this.programDeliveryDetailsForm.value)

    // this.fMon['programDeliveryDetails'](this.fMon['programDeliveryDetails'].value,this.programDeliveryDetailsForm.value)
    const deliveryDetailsArray = this.programForm.get('programDeliveryDetails') as FormArray;
    
    // Push the new form group
    deliveryDetailsArray.push(this.fb.group(this.programDeliveryDetailsForm.value));

    this.programDeliveryDetailsForm.reset();
  }
}
