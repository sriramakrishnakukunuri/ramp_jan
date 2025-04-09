import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import moment from 'moment';

@Component({
  selector: 'app-verification-participant',
  templateUrl: './verification-participant.component.html',
  styleUrls: ['./verification-participant.component.css']
})
export class VerificationParticipantComponent implements OnInit {
  verificationForm!: FormGroup;
  showQuestions: boolean = false;
  agencies: any[] = [];
  programs: any[] = [];
  participants: any[] = [];
  selectedAgency: string = '';
  selectedProgram: string = '';
  showTable: boolean = false;
  dataTable: any;
  agencyId:any;
  constructor(
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {
    this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').email;
    console.log(this.agencyId,'agency')
    this.verificationForm=new FormGroup({verificationStatusId:new FormControl('',[Validators.required])})
  }

  ngOnInit(): void {
    this.loadAgencies();
    this.loadVerisationStatus()
  }
  get fVerf(){
   return this.verificationForm.controls;
  }
  onVerificationStatusChange(status: string,id:any): void {

    this.showQuestions = status === 'Verified';
    // this.verificationForm.reset()
    // this.fVerf['verificationStatusId'].setValue(id)
    // this.verificationForm.get('verificationStatusId')?.setValue(id)

  }
  getParticipantByUpdate:any
  ParticpantdataBYTable(data:any){
    this.getParticipantByUpdate=data
    console.log(data)
    // this.verificationForm.reset();
    this.verificationForm.get('verificationStatusId')?.setValue(data?.ccVerificationStatusId)
    // this.fVerf['verificationStatusId'].patchValue(data?.ccVerificationStatusId)

  }
  // Load Agencies
  loadAgencies(): void {
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe({
      next: (data: any) => {
        this.agencies = data.data;
      },
      error: (err) => {
        console.error('Error loading agencies:', err);
      }
    });
  }
  // Load Programs
  onAgencyChange(): void {
    this.programs = [];
    this.selectedProgram = '';
    if (this.selectedAgency) {
      this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency}/${this.selectedAgency}`).subscribe({
        next: (data: any) => {
          this.programs = data.data;
        },
        error: (err) => {
          console.error('Error loading programs:', err);
        }
      });
    }
  }
  // Change Program
  onProgramChange(): void {
    this.participants = [];
    this.showTable = false;   
    this.getProgramDetailsById(this.selectedProgram)
  }
  // Show Participant
  showParticipants(): void {
    this.showTable = true;
    this.participants = [];
    if (this.selectedProgram) {
      this._commonService.getDataByUrl(`${APIS.callCenter.getDataByProgramVerificationId}/${this.selectedProgram}`).subscribe({
        next: (data: any) => {
          if(data.data.length === 0){
            this.toastrService.success('No Records Found', 'Success');
          }else{
            this.participants = data.data;
          
          
            this.reinitializeDataTable()
          }
          
        },
        error: (err) => {
          console.error('Error loading participants:', err);
        }
      });
    }
  }
  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      this.initializeDataTable();
    }, 0);
  }

  initializeDataTable() {
    this.dataTable = new DataTable('#view-table-callcenter', {
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

  // get Verification Status Fields
  verificationStatus:any=[]
  loadVerisationStatus() {
    this.verificationStatus=[]
    this._commonService.getDataByUrl(APIS.callCenter.getVeriaficationStatus).subscribe({
      next: (data: any) => {
        this.verificationStatus = data.data;
      },
      error: (err) => {
        this.verificationStatus=[]
        console.error('Error loading agencies:', err);
      }
    });
  }
  programData:any={}
  getProgramDetailsById(ProgrmId:any){
    this._commonService.getById(APIS.programCreation.getSingleProgramsList, ProgrmId)?.subscribe({
      next: (data: any) => {
       if(data?.data){
         this.programData = data?.data;
         this.getQuestionBySubactivityId()
       }
       
        
      },
      error: (err: any) => {
        this.toastrService.error(err.message, "Error fetching program details!");
      }
    });
  }
  GetQuestion:any=[]
 getQuestionBySubactivityId(){
  this.GetQuestion={}
  this.verificationForm=new FormGroup({verificationStatusId:new FormControl('',[Validators.required])})
  this._commonService.getById(APIS.callCenter.getQuestionById,this.programData.subActivityId).subscribe({
    next: (data: any) => {
      this.verificationForm = this.fb.group({verificationStatusId:new FormControl('',[Validators.required])});
      this.GetQuestion = data.data;
    this.GetQuestion.forEach((question:any) => {
      if (question.questionType === 'RadioButton') {
        // For radio buttons, we'll store the selected value
        this.verificationForm.addControl(`question_${question.questionId}`, new FormControl(''));
      } else if (question.questionType === 'checkBox') {
        // For checkboxes, we'll create a FormArray
        const answers = question.answers.split(',').map((item:any) => item.trim());
        const checkboxControls = answers.map(() => new FormControl(false));
        this.verificationForm.addControl(`question_${question.questionId}`, new FormArray(checkboxControls));
      }
      else{
          // For Text or any thing buttons, we'll store the selected value
          this.verificationForm.addControl(`question_${question.questionId}`, new FormControl(''));
      }
    });
     
      // this.GetQuestion.map((item:any,index:any)=>{
      //   item.answers= item.answers.split(',')
      //   item['formValue']='Q'+(index+1)
      //   this.verificationForm.addControl('Q'+(index+1), new FormControl(''))
      // })
      
    },
    error: (err: any) => {
      this.toastrService.error(err.message, "Error fetching Questions details!");
    }
  });
 }
  // Fixed method with proper typing
  getCheckboxControl(questionId: number, index: number): FormControl {
    const formArray = this.verificationForm.get(`question_${questionId}`) as FormArray;
    return formArray.at(index) as FormControl;
  }

  getAnswersArray(answersString: string): string[] {
    return answersString.split(',').map(item => item.trim());
  }

  // update 
  submitVerification() {
    let payload:any={
      "programId": this.programData.programId,
      "participantId": this.getParticipantByUpdate?.participantId,
      "verifiedBy": this.agencyId,
      "verificationDate": moment().format('yyyy-MM-DD'),
      "verificationStatusId": this.verificationForm.value?.verificationStatusId?Number(this.verificationForm.value?.verificationStatusId):7,
      "questionAnswerList": this.prepareQuestionAnswers(this.verificationForm.value)
    }
    console.log(payload,'srk')
    this._commonService
      .add(APIS.callCenter.add, payload).subscribe({
        next: (data: any) => {
         this.showParticipants()
         this.toastrService.success('Participant Verification Updated Successfully', 'Success');
        },
        error: (err) => {

          this.toastrService.error(err.message, "Participant Data Error!");
          new Error(err);
        },
      });
  
  }
  prepareQuestionAnswers(formData: any): any[] {
    return this.GetQuestion.map((question:any) => {
      const questionKey = `question_${question.questionId}`;
      const formValue = formData[questionKey];

      if (question.questionType === 'RadioButton') {
        return {
          questionId: question.questionId,
          answers: [formValue] // Radio button returns single value as array
        };
      } else if (question.questionType === 'checkBox') {
        const answers = this.getAnswersArray(question.answers);
        const selectedAnswers = answers.filter((_, index) => formValue[index]);
        return {
          questionId: question.questionId,
          answers: selectedAnswers
        };
      }
      return null;
    }).filter((item:any) => item !== null);
  }
}
