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

  ngOnInit(): void {
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


         onAgencyChange(value:any){
          this.selectedAgencyId=value;
  }

}
