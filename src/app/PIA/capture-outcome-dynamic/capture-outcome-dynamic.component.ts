import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ToastrService } from 'ngx-toastr';
import { APIS } from '@app/constants/constants';
@Component({
  selector: 'app-capture-outcome-dynamic',
  templateUrl: './capture-outcome-dynamic.component.html',
  styleUrls: ['./capture-outcome-dynamic.component.css']
})
export class CaptureOutcomeDynamicComponent implements OnInit {
  MobileNumber:any
  ListOfOutCome:any=[]
  ParticipantData:any={}
  ListOfDynamicFormData:any=[]
  formData:any={}
  agencyId: any;
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    }

  ngOnInit(): void {
    this.GetOutComes()
    this.formDetails()
  }
  OutComeForm!:FormGroup
  
  get f2(){
    return this.OutComeForm.controls
  }
  formDetails(){
    this.OutComeForm=new FormGroup({outcomesName:new FormControl('',[Validators.required])})
  }
  GetParticipantByMobile(mobile:any){
    this._commonService.getById(APIS.captureOutcome.getParticipantData,mobile).subscribe({
      next: (res: any) => {
        this.ParticipantData = res?.data
      },
      error: (err) => {
        new Error(err);
      }
    })
  }
  // OutComes data
  
  GetOutComes(){
    this._commonService.getDataByUrl(APIS.captureOutcome.getOutcomelistData).subscribe({
      next: (res: any) => {
        this.ListOfOutCome = res?.data
      },
      error: (err) => {
        new Error(err);
      }
    })
  }
  getDynamicFormBasedOnOutCome(Outcome:any){
    this.formData={}
    this.OutComeForm=new FormGroup({outcomesName:new FormControl('',[Validators.required])})
    this.OutComeForm.patchValue({outcomesName:Outcome})
    this._commonService.getById(APIS.captureOutcome.getDynamicFormDataBasedOnOutCome,Outcome).subscribe({
      next: (res: any) => {
        let object:any
        this.ListOfDynamicFormData = res?.data?.columns;
        res.data?.columns?.map((item:any)=>{
          this.OutComeForm.addControl( item?.fieldName, new FormControl('',[Validators.required]))
        })
      },
      error: (err) => {
        new Error(err);
      }
    })
  }
  SubmitOutCome(){
    if(Object.keys(this.ParticipantData)?.length){
      console.log(this.OutComeForm.value,this.ParticipantData)
    // {"ondcRegistrationDate": "01-01-2025","ondcRegistrationNo": "ONDC123","participantId": 1,"organizationId": 1,"agencyId": 1}
    let formData = new FormData();
    let payload:any={}
    Object?.keys(this.OutComeForm.value)?.map((item:any)=>{
      if(item!='outcomesName'){
        payload[item]=this.OutComeForm.value[item]
      }
      
    })
    formData.set("data", JSON.stringify({...payload,
      participantId:this.ParticipantData?.participantId,
      organizationId:this.ParticipantData?.organizationId,
      agencyId:this.agencyId}));
      this._commonService.add(APIS.captureOutcome.saveOutComes+this.OutComeForm.value?.outcomesName,formData).subscribe({
        next: (res: any) => {
          this.toastrService.success('Capture Program Outcome Created Successfully', "Capture Program Outcome Success!");
        this.OutComeForm.reset()
        },
        error: (err) => {
          new Error(err);
        }
      })
    }
    else{
      this.toastrService.warning('You can not Able to Sumbit without Participant Details.Please Add Partipant Details', "Capture Program Outcome!");
    } 
    

  }
 
}
