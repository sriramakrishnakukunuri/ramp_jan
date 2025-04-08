import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-all-participants-verification',
  templateUrl: './all-participants-verification.component.html',
  styleUrls: ['./all-participants-verification.component.css']
})
export class AllParticipantsVerificationComponent implements OnInit {

  verificationForm!: FormGroup;
  showQuestions: boolean = false;
  agencies: any[] = [];
  programs: any[] = [];
  participants: any[] = [];
  selectedAgency: string = '';
  selectedProgram: any = '';
  showTable: boolean = false;
  dataTable: any;
  constructor(
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {
    this.verificationForm=new FormGroup({verificationStatusId:new FormControl('',[Validators.required])})
    // this.verificationForm = this.fb.group({
    //   verificationStatusId: ['', Validators.required],
    //   attendedProgram: [''],
    //   morningSession: [false],
    //   afternoonSession: [false],
    //   programUseful: [''],
    //   programSource: [''],
    //   foodQuality: [''],
    //   trainerQuality: [''],
    //   contactForPrograms: ['']
    // });
  }

  onVerificationStatusChange(status: string): void {
    this.showQuestions = status === 'Verified';
  }
 
  submitVerification() {
    console.log(this.verificationForm.value,'srk');
    let payload:any={
      "programId": this.programData.programId,
      "participantId": this.getParticipantByUpdate?.participantId,
      "verifiedBy": "cc@gmail.com",
      "verificationDate": "2025-04-06",
      "verificationStatusId": this.verificationForm.value?.verificationStatusId?this.verificationForm.value?.verificationStatusId:7,
      "questionAnswerList": [
        {
          "questionId": 1,
          "answers": ["Bad"]
        },
        {
          "questionId": 2,
          "answers": ["Bad", ]
        },
      ]
    }
    let questionAnswerListdata:any=[]
    Object.entries(this.verificationForm.value)?.forEach(([key, value], index: any) => {
      if(key!='verificationStatusId'){
        questionAnswerListdata.push({questionId:key,answers:value})
      }
     
   
    })

   
    this._commonService.add(APIS.callCenter.saveVeriaficationStatus,payload).subscribe({
      next: (data: any) => {
        this.agencies = data.data;
      },
      error: (err) => {
        console.error('Error loading agencies:', err);
      }
    });
    // if (this.verificationForm.valid) {
    //   console.log(this.verificationForm.value);
    //   // Handle form submission logic here
    // } else {
    //   console.error('Form is invalid');
    // }
    this.toastrService.success('Participant Verification Updated Successfully', 'Success');
  }

  ngOnInit(): void {
    this.loadAgencies();
  }

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
  getParticipantByUpdate:any
  ParticpantdataBYTable(data:any){
    this.getParticipantByUpdate=data
    this.getQuestionBySubactivityId()
  }
  verificationStatus:any=[]
  loadVerisationStatus() {
    // this.verificationStatus=[]
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

  onProgramChange(): void {
    this.participants = [];
    this.showTable = false;   
  }

  showParticipants(): void {
    this.showTable = true;
    this.participants = [];
    if (this.selectedProgram) {
     
      this._commonService.getDataByUrl(`${APIS.callCenter.getParticipantVerificationById}/${this.selectedProgram}`).subscribe({
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
      this.loadVerisationStatus()
      this.getProgramDetailsById(this.selectedProgram)
    }
  }
 // get program details 
 programData:any
 getProgramDetailsById(ProgrmId:any){
   this._commonService.getById(APIS.programCreation.getSingleProgramsList, ProgrmId).subscribe({
     next: (data: any) => {
      this.programData = data?.data;
      this.getQuestionBySubactivityId()
     },
     error: (err: any) => {
      this.programData={}
       this.toastrService.error(err.message, "Error fetching program details!");
     }
   });
 }
 GetQuestion:any=[]
 getQuestionBySubactivityId(){
  this.GetQuestion={}
  this.verificationForm=new FormGroup({verificationStatusId:new FormControl('',[Validators.required]),attendedProgram:new FormControl('',[Validators.required])})
  // this.verificationForm=this.fb.group({
  //   verificationStatusId:new FormControl('',[Validators.required]),
  //   Q1:new FormControl('',[Validators.required]),
  //   Q2:new FormControl('',[Validators.required]),

  // });
  this._commonService.getById(APIS.callCenter.getQuestionById, this.programData?.subActivityId).subscribe({
    next: (data: any) => {
      
      data.data.map((item:any,index:any)=>{
        item.answers= item.answers.split(',')
        item['formValue']='Question_'+(index+1)
        this.verificationForm.addControl('Question_'+(index+1), new FormControl(''))
      })
      
      console.log(data.data,'datalll')
      this.GetQuestion = data.data;
    },
    error: (err: any) => {
      this.toastrService.error(err.message, "Error fetching Questions details!");
    }
  });
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
  getdata(va:any){
    console.log(va)
  }

}
