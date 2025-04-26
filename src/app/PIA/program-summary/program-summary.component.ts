import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
@Component({
  selector: 'app-program-summary',
  templateUrl: './program-summary.component.html',
  styleUrls: ['./program-summary.component.css']
})
export class ProgramSummaryComponent implements OnInit {
  loginsessionDetails: any;
  agencyId: any;
  programIds:any
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService, private router: Router,) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    }

    ngOnInit(): void {
      this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
      if(this.loginsessionDetails.userRole == 'ADMIN') {
        this.getAgenciesList()
      }
      else{
        this.getProgramsByAgency( this.agencyId )
      }  
      
    }
    agencyList: any;  
    getAgenciesList() {
      this.agencyList = [];
      this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
        this.agencyList = res.data;
        this.getProgramsByAgency(res.data[0].agencyId);
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
    }
    agencyProgramList: any;
      getProgramsByAgency(agency:any) {
        this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency+(agency?agency:this.loginsessionDetails.agencyId)}`).subscribe({
          next: (res: any) => {
            this.PrigramSummaryData = {}
            this.agencyProgramList = res?.data
            if(res.data?.length){
              this.programIds = this.agencyProgramList[0].programId
              this.getData()
            }
          
          },
          error: (err) => {
            new Error(err);
          }
        })
      }
      PrigramSummaryData:any
      dropdownProgramsList(event: any, type: any) {
        this.PrigramSummaryData = {}
        this.programIds = event.target.value
        if (type == 'table' && event.target.value) {
          this.getData()
        }
      }
      getData() {
        this.PrigramSummaryData ={
          "programName": "Sample Program1234",
          "agencyName": "TiHCL_05",
          "participant": 5,
          "startDate": "01-01-2025",
          "endDate": "10-01-2025",
          "sc": 0,
          "st": 1,
          "obc": 0,
          "oc": 4,
          "minorities": 0,
          "male": 1,
          "female": 1,
          "transgender": 3,
          "physicallyChallenge": 4,
          "noOfSHGs": 2,
          "noOfMSMEs": 0,
          "noOfStartups": 0,
          "noOfAspirants": 0
      }
       
        this._commonService.getById(APIS.programSummary.getProramData, this.programIds).subscribe({
          next: (res: any) => {          
            // this.PrigramSummaryData = res?.data   
          console.log( this.PrigramSummaryData)
          this.PrigramSummaryData = res?.data
          this.PrigramSummaryData['scPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['sc'])
          this.PrigramSummaryData['stPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['st'])
          this.PrigramSummaryData['obcPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['obc'])
          this.PrigramSummaryData['ocPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['oc'])
          this.PrigramSummaryData['minoritiesPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['minorities'])
          this.PrigramSummaryData['malePercentage']=this.CalculateGenderPercentage(this.PrigramSummaryData,this.PrigramSummaryData['male'])
          this.PrigramSummaryData['femalePercentage']=this.CalculateGenderPercentage(this.PrigramSummaryData,this.PrigramSummaryData['female'])
          this.PrigramSummaryData['transeGenderPercentage']=this.CalculateGenderPercentage(this.PrigramSummaryData,this.PrigramSummaryData['transgender'])
          this.PrigramSummaryData['noOfSHGsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfSHGs'])
          this.PrigramSummaryData['noOfMSMEsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfMSMEs'])
          this.PrigramSummaryData['noOfStartupsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfStartups'])
          this.PrigramSummaryData['noOfAspirantsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfAspirants'])
          this.PrigramSummaryData['disabilityPercentage']= ((this.PrigramSummaryData['physicallyChallenge'] / this.PrigramSummaryData['participant']) * 100).toFixed(2);
            
          },
          error: (err) => {
            this.toastrService.error('Data Not Available', "Participant Data Error!");
            new Error(err);
          },
        });
        // console.log(this.ParticipantAttentance)
      }
      CalculatePercentage(Data: any,val:any) {
        let total = Data.sc + Data.st + Data.obc + Data.oc + Data.minorities;
        let percentage:any = ((val / total) * 100).toFixed(2);
        return isNaN(percentage) ? 0 : percentage

      }
      CalculateGenderPercentage(Data: any,val:any) {
        let total = Data.male + Data.female + Data.transgender;
        let percentage:any = ((val / total) * 100).toFixed(2);
        return isNaN(percentage) ? 0 : percentage

      }
      CalculateOragnizationPercentage(Data: any,val:any) {
        let total = Data.noOfSHGs + Data.noOfMSMEs + Data.noOfStartups+ Data.noOfAspirants;
        let percentage:any = ((val / total) * 100).toFixed(2);
        console.log(percentage,total,val)
        
        return isNaN(percentage) ? 0 : percentage

      }
}
