import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit,AfterViewInit {

  constructor( private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,) { }

    RegisterForm!: FormGroup;
    ngOnInit(): void {
      this.formDetails();
    }
    ngAfterViewInit() {
      setTimeout(() => {
        new DataTable('#view-table', {              
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
        gender: new FormControl("",[Validators.required,]),
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
