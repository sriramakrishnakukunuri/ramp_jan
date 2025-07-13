import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS,UploadPath } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-di-concern-letter',
  templateUrl: './di-concern-letter.component.html',
  styleUrls: ['./di-concern-letter.component.css']
})
export class DiConcernLetterComponent implements OnInit {

  assessmentForm!: FormGroup;
applicationData:any
 @Output() progressBarStatusUpdate:any = new EventEmitter();
  constructor(private fb: FormBuilder,private toastrService: ToastrService,
      private _commonService: CommonServiceService,private http: HttpClient) { 
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
    DownloadDic(){
      // dicNocFilePath
      console.log(this.managrData?.dicNocFilePath)
      // let  s3BaseUrl = 'https://tihcl.s3.us-east-1.amazonaws.com';
      // this._commonService.downloadFile(s3BaseUrl,this.managrData?.dicNocFilePath)
      let linkUrl =   this.managrData?.dicNocFilePath
        const link = document.createElement("a");
        link.setAttribute("download", linkUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("href", linkUrl);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
  
    Approved(){
        // https://tihcl.com/tihcl/api/registrations/status/updation/TH647249?appStatus=MANAGER_APPROVAL_1&reasonForRejection=null
        this._commonService.updatedataByUrl(APIS.tihclManager.approveLevelOne+this.applicationData?.applicationNo+'?appStatus=DIC_NOC&reasonForRejection=null').subscribe({
          next: (response) => {
            this.progressBarStatusUpdate.emit({"update":true})
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
}
