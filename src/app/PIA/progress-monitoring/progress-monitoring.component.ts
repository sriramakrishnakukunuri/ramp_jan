import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-progress-monitoring',
  templateUrl: './progress-monitoring.component.html',
  styleUrls: ['./progress-monitoring.component.css']
})
export class ProgressMonitoringComponent implements OnInit {
localStorageData: any;
  sessionDetailsList: any;
  tableList: any;
  dataTable: any;
  agencyList: any = [];
  loginsessionDetails: any;
  agencyId: any;

 constructor(
     private toastrService: ToastrService,
     private _commonService: CommonServiceService,
     private router: Router,
   ) { 
     this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
     this.selectedAgencyId = this.loginsessionDetails.agencyId;
   }
 

  ngOnInit(): void {
    this.getAgenciesList()
  }
 selectedAgencyId: any;
  agencyListFiltered: any;
  getAgenciesList() {
      this.agencyList = [];
      this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
        this.agencyList = res.data;
        this.agencyListFiltered=this.agencyList;
        this.selectedAgencyId = res.data[0].agencyId;
        this.GetProgramsByAgency(this.selectedAgencyId);
      }, (error) => {
        // this.toastrService.error(error.message);
      });
    }
    tableheaderList:any
        GetProgramsByAgency(value?: any) {
          this.tableList = []
          this.tableheaderList = []
          
          // Initialize with sample data structure
          this.tableList = {
              "trainingPrograms": [
                {
                  "trainingActivity": "Leadership Development Training",
                  "trainingSubActivity": "Self Help Group Leadership",
                  "physicalTarget": 500,
                  "physicalAchievement": 375,
                  "applicable": "75.00%",
                  "financialTarget": 2.5,
                  "financialExpenditure": 187500,
                  "percentage": 75
                },
                {
                  "trainingActivity": "Entrepreneurship Development Program",
                  "trainingSubActivity": "Business Skills Training",
                  "physicalTarget": 300,
                  "physicalAchievement": 225,
                  "applicable": "75.00%",
                  "financialTarget": 1.8,
                  "financialExpenditure": 135000,
                  "percentage": 75
                }
              ],
              "nonTrainingPrograms": [
                {
                  "nonTrainingActivity": "Preliminary survey for selection of potential SHGs",
                  "nonTrainingSubActivity": null,
                  "physicalTarget": 1,
                  "physicalAchievement": "Not Initiated",
                  "applicable": "Not Applicable",
                  "financialTarget": 0.04,
                  "financialExpenditure": 50000,
                  "percentage": 12.5
                },
                {
                  "nonTrainingActivity": "Dashboard/ Central Management System",
                  "nonTrainingSubActivity": null,
                  "physicalTarget": 1,
                  "physicalAchievement": "Not Initiated",
                  "applicable": "Not Applicable",
                  "financialTarget": 0.12,
                  "financialExpenditure": null,
                  "percentage": null
                },
                {
                  "nonTrainingActivity": "Handholding support for enterprise creation of 2000 members",
                  "nonTrainingSubActivity": null,
                  "physicalTarget": 2000,
                  "physicalAchievement": null,
                  "applicable": "100.00%",
                  "financialTarget": 1.5,
                  "financialExpenditure": null,
                  "percentage": null
                },
                {
                  "nonTrainingActivity": "Raw material support ",
                  "nonTrainingSubActivity": null,
                  "physicalTarget": 1,
                  "physicalAchievement": "Not Initiated",
                  "applicable": "Not Applicable",
                  "financialTarget": 0.04,
                  "financialExpenditure": 360000,
                  "percentage": 90
                },
                {
                  "nonTrainingActivity": "Contingency fund ",
                  "nonTrainingSubActivity": null,
                  "physicalTarget": 1,
                  "physicalAchievement": "Not Initiated",
                  "applicable": "Not Applicable",
                  "financialTarget": 0.31,
                  "financialExpenditure": null,
                  "percentage": null
                }
              ]
          }
          
          // Make API call to get actual data
          this._commonService.getDataByUrl(APIS.progressMonitoring.getTrainigAndNonTraining+"?agencyId="+value).subscribe({
            next: (dataListResponse: any) => {
              if(dataListResponse && dataListResponse) {
                  this.tableList = dataListResponse;
              }
           
             console.log('Progress Monitoring Data:', this.tableList);
            },
            error: (error: any) => {
             console.error('Error fetching progress monitoring data:', error);
            }
          });
        }
}
