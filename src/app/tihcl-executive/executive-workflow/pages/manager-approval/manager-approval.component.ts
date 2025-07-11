import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-approval',
  templateUrl: './manager-approval.component.html',
  styleUrls: ['./manager-approval.component.css']
})
export class ManagerApprovalComponent implements OnInit {
  assessmentForm!: FormGroup;
applicationData:any
  constructor(private fb: FormBuilder,private toastrService: ToastrService,
      private _commonService: CommonServiceService,) { 
    const applicationData = JSON.parse(sessionStorage.getItem('ApplicationData') || '{}');
    this.applicationData=applicationData
    this.getDtataByUrl(APIS.tihclExecutive.registerData + (applicationData.registrationUsageId? applicationData?.registrationUsageId:applicationData?.registrationId))
  }

  ngOnInit(): void {
  }
  managrData:any
   getDtataByUrl(url: string) {
      this._commonService.getDataByUrl(url).subscribe({
        next: (dataList: any) => {
         this.managrData=dataList?.data
        },
        error: (error: any) => {
          this.toastrService.error(error.error.message);
        }
      });
    }
}
