import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { CommonServiceService } from '@app/_services/common-service.service';
  import { APIS } from '@app/constants/constants';
  import { ToastrService } from 'ngx-toastr';
  import DataTable from 'datatables.net-dt';
  import 'datatables.net-buttons-dt';
  import 'datatables.net-responsive-dt';
  declare var bootstrap: any;

@Component({
  selector: 'app-output-progress',
  templateUrl: './output-progress.component.html',
  styleUrls: ['./output-progress.component.css']
})
export class OutputProgressComponent implements OnInit {

  loginsessionDetails: any;
      agencyId: any;
      programIds:any
      constructor(private fb: FormBuilder,
        private toastrService: ToastrService,
        private _commonService: CommonServiceService, private router: Router,) { 
          // sessionStorage.removeItem('selectAgecytoOutpuAchievements');
          this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
        }
    
      ngOnInit(): void {
        this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
        if(this.loginsessionDetails.userRole == 'ADMIN') {
          this.getAgenciesList()
          this.getOutcomes()
        }
        else{
          // this.getProgramsByAgency()
        }
        setTimeout(() => {
          this.getDataBasedOnAgencyOutcome()
        }, 100);
        
       
      }
      selectedAgencyId:any='-1';
      agencyList:any;
      agencyListFiltered:any;
    getAgenciesList() {
      this.agencyList = [];
      this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
        this.agencyList = res.data;
        this.agencyListFiltered = this.agencyList;
         if(Number(sessionStorage.getItem('selectAgecytoOutpuAchievements'))){
          this.selectedAgencyId=Number(sessionStorage.getItem('selectAgecytoOutpuAchievements'))
          this.selectedAgencyId=this.selectedAgencyId==-1?'-1':this.selectedAgencyId
         }
        else{
         this.selectedAgencyId = '-1'
        }
        
        // this.getProgramsByAgencyAdmin(this.selectedAgencyId)
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
    }
    agencyOutcomesListFiltered:any
    agencyOutcomesList:any;
    outcomeIds:any='-1'
      getOutcomes() {
      this.agencyOutcomesListFiltered = [];
      this.agencyOutcomesList = [];
      this._commonService.getDataByUrl(APIS.captureOutcome.getOutcomelistData).subscribe((res: any) => {
        this.agencyOutcomesList = res.data;
        this.agencyOutcomesListFiltered = this.agencyOutcomesList;
        this.outcomeIds = '-1'
        // this.getProgramsByAgencyAdmin(this.selectedAgencyId)
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
    }
getagencynamebyid(id:any){
  let agencyname=this.agencyList.find((a:any)=>a.agencyId==id)
  return agencyname?agencyname.agencyName:''
}
getoutcomenamebyid(id:any){
  let outcomename=this.agencyOutcomesList.find((a:any)=>a.outcomeTableId==id)
  return outcomename?outcomename.outcomeTableDisplayName:''
}
getDataByAgencyOutcome:any=[]
allagencyOutcomedata:any=[]
headers:any=[]
 getDataBasedOnAgencyOutcome(){
  this.getDataByAgencyOutcome=[]
  this.allagencyOutcomedata=[]
  if(this.selectedAgencyId==-1 && this.outcomeIds==-1){
    this._commonService.getDataByUrl(APIS.captureOutcome.getOutputProgressData+this.selectedAgencyId+'?outcomeId='+this.outcomeIds).subscribe((res: any) => {
        this.getDataByAgencyOutcome = res.data;
         if(Object.keys(this.getDataByAgencyOutcome).length==0){
          this.toastrService.info('No data found for the selected Agency and Outcome.');
        }
        else{
          this.headers = this.getDataByAgencyOutcome[Object.keys(this.getDataByAgencyOutcome)[0]];
          this.allagencyOutcomedata=Object.keys(this.getDataByAgencyOutcome)
          
          
            console.log(this.getDataByAgencyOutcome, this.headers,this.allagencyOutcomedata)
        }
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
  }
  else{
    this._commonService.getDataByUrl(APIS.captureOutcome.getOutputProgressData+this.selectedAgencyId+'?outcomeId='+this.outcomeIds).subscribe((res: any) => {
        this.getDataByAgencyOutcome = res.data;
        if(this.getDataByAgencyOutcome.length==0){
          this.toastrService.info('No data found for the selected Agency and Outcome.');
        }
        else{
          this.getDataByAgencyOutcome = this.getDataByAgencyOutcome.flat().filter((item: any) => Object.keys(item).length > 0);
            console.log(this.getDataByAgencyOutcome)
        }
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
  }
     
 }
 redirectAchievements(){
  console.log(this.selectedAgencyId,'selectedAgencyId');
          sessionStorage.setItem('selectAgecytoOutpuAchievements',this.selectedAgencyId)
          this.router.navigate(['/financial-targets'])
        }

}
