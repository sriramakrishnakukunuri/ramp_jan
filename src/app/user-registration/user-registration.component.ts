import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  constructor( private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,) { }

    RegisterForm!: FormGroup;
    ngOnInit(): void {
      this.formDetails();
    }
    get f2() {
      return this.RegisterForm.controls;
    }
    formDetails() {
      this.RegisterForm  = new FormGroup({
        // date: new FormControl("", [Validators.required]),
        firstName: new FormControl("", [Validators.required]),
        lastName: new FormControl("",[Validators.required,]),
        email: new FormControl("", [Validators.required]),
        // noOfDays: new FormControl("", [Validators.required,]),
        mobile: new FormControl("",[Validators.required,Validators.pattern(/^[0-9][0-9]*$/)]),
        userRole: new FormControl("",[Validators.required,]),
      });
    }
    onModalSubmitRegister(){
      if(this.RegisterForm.invalid){
        return;
      }
      console.log(this.RegisterForm.value);
      this._commonService.add(APIS.userRegistration.add, this.RegisterForm.value).subscribe((res: any) => {
        this.RegisterForm.reset();
        this.toastrService.success('User Registered Successfully', 'Success');
        
        // this.router.navigate(['/user-registration']);
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
    }

}
