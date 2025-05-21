import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData:any
  @ViewChild('ModalProfile') ModalProfile!: ElementRef;
  RegisterForm!: FormGroup;
  agencyList: any = [];
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
  ) { 
    //this.userData = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    this.formDetails();
    this.getAgenciesList()
    this.getUserDetails()
  }

  openModalProfile(): void {
    const modal = new bootstrap.Modal(this.ModalProfile.nativeElement);
    modal.show();
  }

  get f2() {
    return this.RegisterForm.controls;
  }

  formDetails() {
    this.RegisterForm  = new FormGroup({
      // date: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("",[Validators.required,]),
      email: new FormControl("", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
      // noOfDays: new FormControl("", [Validators.required,]),        
      mobile: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]),
      userRole: new FormControl("",[Validators.required,]),
      department: new FormControl(""),
      gender: new FormControl("",[Validators.required,]),
    });

    this.RegisterForm.get('userRole')?.valueChanges.subscribe(value => {
      this.onUserRoleChange(value);
    });
  }

  onUserRoleChange(value: string) {
    const departmentControl = this.RegisterForm.get('department');
    if (value === 'ADMIN' || value === 'CALL_CENTER' || value === 'DEPARTMENT') {
      departmentControl?.setValue('Commissionarate of Industries');
      departmentControl?.disable();
    } else if (value === 'AGENCY_MANAGER' || value === 'AGENCY_EXECUTOR') {
      departmentControl?.setValue('');
      departmentControl?.enable();
    } else if (value === 'SPIU') {
      departmentControl?.setValue('GT');
      departmentControl?.disable();
    }else {
      departmentControl?.setValue('');
      departmentControl?.disable();
    }
  }

  onModalSubmitRegister(){
    if(this.RegisterForm.invalid){
      return;
    }
    
    let url = '';
    let payload = {};
    url = APIS.userRegistration.editProfile;
    let userDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    payload = {
      "mobileNo": this.RegisterForm.value.mobile,
      "email": userDetails.email,
      "firstName": this.RegisterForm.value.firstName,
      "lastName": this.RegisterForm.value.lastName,
      "gender": this.RegisterForm.value.gender,
    }
    this._commonService.userUpdateById(url+'/'+userDetails.email, payload).subscribe((res: any) => {
      this.RegisterForm.reset();
      this.toastrService.success('User Details Updated Successfully', 'Success');
      this.getUserDetails()
    }, (error) => {
      this.toastrService.error('Error while updating user details', 'User Profile');
    });
  }

  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }

  getUserDetails() {
    this.userData = {}
    let userDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    this._commonService.getUserById(APIS.userRegistration.getUserById, userDetails.userId).subscribe((res: any) => {
      this.userData = res;
      this.RegisterForm.patchValue({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        mobile: res.mobileNo,
        userRole: res.userRole,
        department: res.agencyId,
        gender: res.gender
      });
      
      this.RegisterForm.get('email')?.disable();
    }), (error:any) => {
      this.toastrService.error('Error while fetching user details', 'User Profile');
    }
  }
}
