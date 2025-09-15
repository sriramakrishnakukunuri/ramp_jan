import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
declare var bootstrap: any;
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-question-assignment',
  templateUrl: './question-assignment.component.html',
  styleUrls: ['./question-assignment.component.css']
})
export class QuestionAssignmentComponent implements OnInit {
  
  questionForm!: FormGroup;
  isSubmitted = false;
  isEditMode = false;
  currentEditId: number | null = null;
  
  // Sample data arrays (replace with actual API calls)
  agencies: any[] = [
    { agencyId: 1, agencyName: 'Agency 1' },
    { agencyId: 2, agencyName: 'Agency 2' },
    { agencyId: 3, agencyName: 'Agency 3' }
  ];
  
  activities: any[] = [
    { activityId: 1, activityName: 'Activity 1' },
    { activityId: 2, activityName: 'Activity 2' },
    { activityId: 3, activityName: 'Activity 3' }
  ];
  
  subActivities: any[] = [
    { subActivityId: 1, subActivityName: 'Sub Activity 1' },
    { subActivityId: 2, subActivityName: 'Sub Activity 2' },
    { subActivityId: 3, subActivityName: 'Sub Activity 3' }
  ];
  
  questionTypes = [
    { value: 'RadioButton', label: 'Radio Button' },
    { value: 'CheckBox', label: 'Check Box' },
    { value: 'TextBox', label: 'Text Box' }
  ];
  
  questions: any[] = [];


  
  selectedAgency: string = '';
  selectedActivity: string = '';
  selectedSubActivity: string = '';

  constructor(private fb: FormBuilder,

    private _commonService: CommonServiceService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getAgenciesList()
    this.getQuestionsList();
  }
agencyListFiltered:any;
agencyList:any;
selectedAgencyId:any;
   getAgenciesList() {
        this.agencyList = [];
        this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
          this.agencyList = res.data;
          this.agencyListFiltered=this.agencyList;
          // this.selectedAgencyId =-1
          // this.GetProgramsByAgency(-1);
        }, (error) => {
          this.toastrService.error(error.error.message);
        });
      }

       activityList:any
  subActivitiesList:any
  selectedActivityId:any
  selectedSubActivityId:any
  onAgencyChange(value:any){
    this.selectedAgencyId=value;
    this.subActivitiesList = []
    this._commonService.getById(APIS.programCreation.getActivityListbyId,this.selectedAgencyId).subscribe({
      next: (data: any) => {
        this.activityList = data.data;
      },
      error: (err: any) => {
        this.activityList = [];
      }
    })
  }
   getSubActivitiesList(activityId: any){
    this.selectedSubActivityId=activityId
    this._commonService.getDataByUrl(`${APIS.programCreation.getSubActivityListByActivity+'/'+activityId}`).subscribe({
      next: (data: any) => {
        this.subActivitiesList = data.data.subActivities;
        this.selectedSubActivityId=this.subActivitiesList.length>0?this.subActivitiesList[0].subActivityId:'';
        
        this.getQuestionsBySubActivityId()
      },
      error: (err: any) => {
        this.toastrService.error(err.message ? err.message : "Something went wrong", "Error");
      }
    })
  }
  initializeForm(): void {
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required]],
      questionFieldType: ['', [Validators.required]],
       options: this.fb.array([], [Validators.required])
   });
  }

  // Add a getter for easy access to the options FormArray in the template
  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }
 newOptionControl = this.fb.control('');
  // Method to add a new option to the FormArray
  addOption(): void {
    const optionValue = this.newOptionControl.value?.trim();
    if (optionValue) {
      // Add the new option as a new FormControl in the FormArray
      this.optionsArray.push(this.fb.control(optionValue));
      // Clear the input field
      this.newOptionControl.reset();
    }
  }

  // Method to remove an option from the FormArray by its index
  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  
selectedQuestion:any=[];
questionsFiltered:any=[]
  getQuestionsList(){
    let url=APIS.questionsApis.getAllQuestions
    this._commonService.getDataByUrl(url).subscribe({
      next: (data: any) => {
        if(data.data.length>0){
          this.questions = data.data;
          this.questionsFiltered = data.data;
        }
      },
      error: (err: any) => {
        this.questions = [];
        this.questionsFiltered=[]
      }

    })
  }


   isFormValid(): boolean {
    return !!(
      this.selectedAgencyId && 
      this.selectedActivityId && 
      this.selectedSubActivityId && 
      this.selectedQuestion && 
      this.selectedQuestion.length > 0
    );
  }

  get displayedOptions(): any[] {
    // Get the full objects for the currently selected question values.
    const selectedObjects = this.questions.filter(q => this.selectedQuestion.includes(q.questionId));

    // Create a new Set from the currently filtered list to handle duplicates easily.
    const filteredSet = new Set(this.questionsFiltered.map((q:any) => q.questionId));

    // Add the selected objects to the filtered list, but only if they aren't already there.
    const combined = [...this.questionsFiltered];
    selectedObjects.forEach(selectedObj => {
      if (!filteredSet.has(selectedObj.questionId)) {
        combined.push(selectedObj);
      }
    });

    return combined;
  }

  questionList:any=[]
  getQuestionsBySubActivityId(){
this.questionList=[]
    if(this.selectedSubActivityId){
    this._commonService.getById(APIS.questionsApis.getQuestionsById,this.selectedSubActivityId).subscribe({
      next: (data: any) => {
        if(data.data){
          this.questionList = data.data;
          // this.selectedQuestion = this.questionList.map((q: any) => q.questionId);
          // this.questionsFiltered = this.questions.filter(q => this.selectedQuestion.includes(q.questionId));
        }else{

          this.questionList = [];
          // this.toastrService.error(data.message);
        }
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message);
        this.questionList = [];
       
      }

    })  
  }


  }

  onSubActivityChanged(){
this.getQuestionsBySubActivityId()
  }


  onQuestionSave(){

    let payload={
      "subActivityId": this.selectedSubActivityId,
      "questions": this.selectedQuestion
    }
    this._commonService.add(APIS.questionsApis.saveActivityQuestions,payload).subscribe({
      next: (data: any) => {
        this.selectedQuestion=[]
        if(data.status){
          this.toastrService.success(data.message);
        }else{
          this.toastrService.error(data.message);
        }
      },
      error: (err: any) => {
        this.selectedQuestion=[]

        this.toastrService.error(err.error.message);
      }

    })

  }
  
  // Open modal for add/edit
  openQuestionModal(mode: string, item?: any): void {
    this.isEditMode = mode === 'edit';
    this.isSubmitted = false;
    
    if (this.isEditMode && item) {
      this.currentEditId = item.id;
      // Clear the form array before patching
      this.optionsArray.clear();
      // If existing options are a string, split them. If it's an array, use it directly.
      const options = Array.isArray(item.options) ? item.options : item.options.split(',');
      options.forEach((option: string) => this.optionsArray.push(this.fb.control(option)));

      this.questionForm.patchValue({
        questionText: item.questionText,
        questionFieldType: item.questionFieldType,
        // options are already set above
      });
    } else {
      this.resetForm();
    }
  
    
    // Open Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('addQuestionModal'));
    modal.show();
  }
  

  
  // Submit form
  onSubmit(): void {
    this.isSubmitted = true;
    
    if (this.questionForm.valid) {
      const formData = this.questionForm.value;
      
      if (!this.isEditMode) {
        
        let url=APIS.questionsApis.saveQuestion
        let payload={
          questionId: this.selectedSubActivityId,
          question: formData.questionText,
          questionFieldType: formData.questionFieldType,
          options: formData.options
        }
        this._commonService.add(url,payload).subscribe({
          next: (data: any) => {
            if(data.status){
              this.toastrService.success(data.message);
              this.getQuestionsList();
            }else{
              this.toastrService.error(data.message);
            }
          },
          error: (err: any) => {
            this.toastrService.error(err.error.message);
          }

        })


      } else {
       
      }
      
      this.closeModal();
    }
  }
  
  // Delete question
  deleteQuestion(id: number): void {
    this.questions = this.questions.filter(q => q.id !== id);
  }
  
  // Reset form
  resetForm(): void {
     this.questionForm.reset();
    // Make sure to clear all items from the FormArray
    this.optionsArray.clear();
    this.newOptionControl.reset();
    this.isSubmitted = false;
  }
  
  // Close modal
  closeModal(): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addQuestionModal'));
    if (modal) {
      modal.hide();
    }
    this.resetForm();
  }
  
  // Filter handlers
  // onAgencyChange(agencyId: string): void {
  //   this.selectedAgency = agencyId;
  //   // Load activities based on agency
  // }
  
  onActivityChange(activityId: string): void {
    this.selectedActivity = activityId;
    // Load sub-activities based on activity
  }
  
  onSubActivityChange(subActivityId: string): void {
    this.selectedSubActivity = subActivityId;
  }
}

