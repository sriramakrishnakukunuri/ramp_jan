import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import DataTable from 'datatables.net-dt';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
@Component({
  selector: 'app-msme-councellor-registeration',
  templateUrl: './msme-councellor-registeration.component.html',
  styleUrls: ['./msme-councellor-registeration.component.css']
})
export class MsmeCouncellorRegisterationComponent implements OnInit {
  agencyId: any;
  CounsellerForm!:FormGroup
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    }

  ngOnInit(): void {
    this.formDetails()
    this.getAllDistricts()
  }
  allDistricts:any
  getAllDistricts(){
    this.allDistricts = []
    this._commonService.getDataByUrl(APIS.masterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    })
  }
  formDetails() {
    this.CounsellerForm = new FormGroup(
    {
      "dateOfRegistration": new FormControl("", [Validators.required,]),
      "nameOfCounsellor": new FormControl("", [Validators.required,]),
      "dateOfBirth": new FormControl("", [Validators.required,]),
      "gender": new FormControl("", [Validators.required,]),
      "socialCategory":new FormControl("", [Validators.required,]),
      "educationalQualification": new FormControl("", [Validators.required,]),
      "districtId": new FormControl("", [Validators.required,]),
      "mandalId": new FormControl("", [Validators.required,]),
      "village": new FormControl("", [Validators.required,]),
      "houseNo":new FormControl("", [Validators.required,]),
      "streetName": new FormControl("", [Validators.required,]),
      "pincode": new FormControl("", [Validators.required,Validators.pattern(/^[0-9]{6}$/)]),
      "landmark": new FormControl("", [Validators.required,]),
      "expriance": new FormControl("", [Validators.required,]),
      "designation": new FormControl("", [Validators.required,]),
      "specialzation": new FormControl("", [Validators.required,]),
      // "contactNo": new FormControl("", [Validators.required,]),
      "contactNo": new FormControl("", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      "altContactNo":new FormControl("", [Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      "emailId": new FormControl("", [Validators.required,]),
      "allortedDistrictId": new FormControl("",),
      "allortedMandalId": new FormControl("", ),
      "dateOfSelection": new FormControl("", ),
    }
  );
  }
  get f2() {
    return this.CounsellerForm.controls;
  }
  submitForm() {
   
    this._commonService .add(APIS.counsellerData.add, {...this.CounsellerForm.value,dateOfRegistration:moment(this.CounsellerForm.value.dateOfRegistration).format('DD-MM-YYYY'),dateOfBirth:moment(this.CounsellerForm.value.dateOfBirth).format('DD-MM-YYYY')}).subscribe({
        next: (data: any) => {
         
          this.CounsellerForm.reset()
      
          this.toastrService.success('Counseller Data Added Successfully', "Counseller Data Success!");
        },
        error: (err) => {
          this.CounsellerForm.reset()
          
          this.toastrService.error(err.message, "Counseller Data Error!");
          new Error(err);
        },
      });
    //this.getData()  
  }
  
}
