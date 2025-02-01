
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;
@Component({
  selector: 'app-add-participant-data',
  templateUrl: './add-participant-data.component.html',
  styleUrls: ['./add-participant-data.component.css']
})
export class AddParticipantDataComponent implements OnInit {
    ParticipantDataForm!: FormGroup;
    OrganisationForm!: FormGroup;
    submitedData:any=[]
    OragnizationType:any='SHG'
    // udyamYesOrNo:any='No'
    programIds:any='1'
    constructor(private fb: FormBuilder,
      private toastrService: ToastrService,
      private _commonService: CommonServiceService) { }
  
    ngOnInit(): void {
  
      this.formDetails();
      this.formDetailsOrganization();
      this.getData()
      this.getOrganizationData()

      this.fOrg['udyamYesOrNo'].value.setValue('No')
    }
    ngAfterViewInit() {
      setTimeout(() => {
        new DataTable('#creation-table', {              
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
        destroy: true, // Ensure reinitialization doesn't cause issues
        });
      }, 500);
    }
    get f2() {
      return this.ParticipantDataForm.controls;
    }
    get fOrg() {
      return this.OrganisationForm.controls;
    }
    formDetails() {
      this.ParticipantDataForm  = new FormGroup({
        // date: new FormControl("", [Validators.required]),
        AspirantData: new FormControl("Aspirant", [Validators.required]),
        organizationId: new FormControl("",[Validators.required,]),
        participantName: new FormControl("", [Validators.required]), //Validators.required
        gender: new FormControl("",[Validators.required,]),
        disability: new FormControl("", [Validators.required]),
        // noOfDays: new FormControl("", [Validators.required,]),
        category: new FormControl("",[Validators.required]),
        aadharNo: new FormControl("",[Validators.required,Validators.pattern(/^[0-9]{12}$/)]),
        mobileNo: new FormControl("",[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
        email: new FormControl("",[Validators.required]),
        designation: new FormControl("",[Validators.required,]),
        isParticipatedBefore: new FormControl("",[Validators.required,]),
        previousParticipationDetails: new FormControl("",[Validators.required,]),
        preTrainingAssessmentConducted: new FormControl("",[Validators.required,]),
        postTrainingAssessmentConducted: new FormControl("",[Validators.required,]),
        isCertificateIssued: new FormControl("",[Validators.required,]),
        certificateIssueDate: new FormControl("",),
        needAssessmentMethodology: new FormControl("",[Validators.required,]),
        // TargetSector: new FormControl("",[Validators.required,]),
        // targetAudience: new FormControl("",[Validators.required,]),
        // targetNoOfParticipants: new FormControl("",[Validators.required,]),
      });
    }
    formDetailsOrganization() {
      this.OrganisationForm  = new FormGroup({
        // date: new FormControl("", [Validators.required]),
       "organizationName": new FormControl("",[Validators.required,]),
      "organizationCategory": new FormControl("",[Validators.required,]),
      "organizationType": new FormControl("",[Validators.required,]),
      "udyamregistrationNo": new FormControl("",[Validators.required,]),
      "udyamYesOrNo": new FormControl("",[Validators.required,]),
      "dateOfRegistration": new FormControl("",[Validators.required,]),
      "startupCertificateNo": new FormControl("",[Validators.required,]),
      "natureOfStartup": new FormControl("",[Validators.required,]),
      "areasOfWorking": new FormControl("",[Validators.required,]),
      "incorporationDate": new FormControl("",[Validators.required,]),
      "dateOfIssue": new FormControl("",[Validators.required,]),
      "validUpto": new FormControl("",[Validators.required,]),
      "stateId": new FormControl("",[Validators.required,]),
      "distId": new FormControl("",[Validators.required,]),
      "mandal": new FormControl("",[Validators.required,]),
      "town": new FormControl("",[Validators.required,]),
      "streetNo":new FormControl("",[Validators.required,]),
      "houseNo": new FormControl("",[Validators.required,]),
      "latitude": new FormControl("",[Validators.required,]),
      "longitude":new FormControl("",[Validators.required,]),
      "contactNo": new FormControl("",[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      "email": new FormControl("",[Validators.required,]),
      "website": new FormControl("",[Validators.required,]),
      "ownerName": new FormControl("",[Validators.required,]),
      "ownerContactNo": new FormControl("",[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      "ownerEmail":new FormControl("",[Validators.required,]),
      "ownerAddress": new FormControl("",[Validators.required,]),
      "nameOfTheSHG": new FormControl("",[Validators.required,]),
      "nameOfTheVO": new FormControl("",[Validators.required,]),
      "gramaPanchayat":new FormControl("",[Validators.required,])
      });
    }
    getData(){
      this.submitedData=[]
        // sessionStorage.getItem('ParticipantData')
        // let resList = sessionStorage.getItem('ParticipantData') || ''
        // // let resList = sessionStorage.getItem('ParticipantData') || ''   
        // console.log(resList) 
        // if(resList){
        //   this.submitedData=JSON.parse(resList)
        // }
        this._commonService.getById(APIS.participantdata.getDataByProgramId,this.programIds).subscribe({
          next: (res:any) => {
            this.submitedData=res?.data
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
    Submitform(){
     
   
    delete this.ParticipantDataForm.value['AspirantData'];
      this.submitedData.push(this.ParticipantDataForm.value)
      // sessionStorage.setItem('ParticipantData', this.submitedData)
       sessionStorage.setItem('ParticipantData', JSON.stringify(this.submitedData)); 
       this._commonService
      .add(APIS.participantdata.add,{...this.ParticipantDataForm.value,"programIds": ["1"],"organizationId":"1" }).subscribe({
        next: (data:any) => {
          // this.advanceSearch(this.getSelDataRange);
          // modal.close()
          this.toastrService.success('Participant Data Added Successfully', "Participant Data Success!");
        },
        error: (err) => {
          this.toastrService.error(err.message, "Participant Data Error!");
          new Error(err);
        },
      });
      this.getData()
      this.ParticipantDataForm.reset()
      
  
    }
    deleteRow(item:any,i:number){
    //  this.submitedData.pop(i)
     this.submitedData.splice(i, 1)
      console.log( this.submitedData)
      // this.submitedData.push(this.ParticipantDataForm.value)
      // sessionStorage.setItem('ParticipantData', this.submitedData)
       sessionStorage.setItem('ParticipantData', JSON.stringify(this.submitedData)); 
       this.getData()
    }
    editRow(item:any,i:any){
      this.ParticipantDataForm.patchValue({...item})
    }
    typeOragnization(event:any){
      console.log(event.target.value)
      this.OragnizationType=event.target.value
    }
    SubmitformOrganization(){
      console.log(this.OrganisationForm.value)
         this._commonService.add(APIS.participantdata.saveOrgnization,{...this.OrganisationForm.value}).subscribe({
          next: (data:any) => {
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
      OrganizationData:any=[]
      getOrganizationData(){
        this._commonService.getDataByUrl(APIS.participantdata.getOrgnizationData).subscribe({
          next: (res:any) => {
            this.OrganizationData=res?.data
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
