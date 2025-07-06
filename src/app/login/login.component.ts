import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { Role } from '@app/_models/role';

@Component({ templateUrl: 'login.component.html', 
    })
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
     otpForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    loginType: string = 'team-member'; 
    phoneNumber: string = '';
    passwordshowConfirm: Boolean=false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.userValue) {
            this.router.navigate(['/program-creation']);
        }
    }

    ngOnInit() {
        this.switchLoginType('team-member'); 
     
    }
        switchLoginType(type: string) {
                this.loginType = type;
                this.defaultOTPScreen = false;
                const teamMember:any = document.getElementById('team-member');
                const entrepreneur:any = document.getElementById('entrepreneur');
                if (type === 'team-member') {
                       this.loginForm = this.formBuilder.group({
                        identifier: ['', Validators.required],
                        password: ['', Validators.required]
                    });
                    this.defaultOTPScreen = false;
                    teamMember?.classList.add('active');
                    entrepreneur?.classList.remove('active');
                } else {
                    entrepreneur?.classList.add('active');
                    teamMember?.classList.remove('active');
                }
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    get fOtp() { return this.otpForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.identifier.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: (res) => {
                      this.loading = false;
                        if(res.userRole === Role.Admin){
                            this.router.navigateByUrl('/veiw-program-creation');
                        }else if(res.userRole === Role.TIHCL_MANAGER ){
                            this.router.navigateByUrl('/Manager-approval-1');
                        }  
                        else if(res.userRole === Role.TIHCL_EXECUTOR){
                            this.router.navigateByUrl('/new-application');
                        }
                },
                error: error => {
                    this.error = 'Invalid credentials. Please try again.';
                    this.loading = false;
                }
            });
    }

    defaultOTPScreen:boolean = false;
    Mobileerror:string = '';
    OTPVerify(value?:any) {
        this.Mobileerror = '';
        this.error=''
        if(value == 'BACK') return this.defaultOTPScreen = false;
        if(value == 'SUBMIT') {

          if(this.fOtp.otp.valid && this.fOtp.otp.value == '123456'){ 
              this.authenticationService.login('executive1@gmail.com', 'password123')
            .pipe(first())
            .subscribe({
                next: (res) => {
                    //  this.router.navigate(['/loan-application-process']);
                    //this.router.navigateByUrl('/program-creation');
                    if (res.status === 200) {
                        // get return url from query parameters or default to home page
                        this.loading = false;
                        
                    } else if (res.status === 400) {
                        this.error = res.message ? res.message : 'Invalid credentials. Please try again.';
                        this.loading = false;
                    }
                    this.getDataBasedOnMobile(this.phoneNumber)
                },
                error: error => {
                    this.error = 'Server Error. Please try again later.';
                    this.loading = false;
                }
            });
           
            return
        }
        else{
              this.error = 'Incorrect OTP. Please try again.';
        }
        }
        else{
            if(this.phoneNumber?.toString().length==10){
                 this.otpForm = this.formBuilder.group({
                        otp: ['', Validators.required]
                    });
                this.defaultOTPScreen = true;
            }
            else{
                this.Mobileerror = 'Phone number must be 10 digits';
                this.loading = false;
                return;
            }
            this.error = '';
            this.loading = false;
        }

        
        return
    }

    getDataBasedOnMobile(mobile: string) {
         this.authenticationService.getDataBasedMobile(mobile)
            .pipe(first())
            .subscribe({
                next: (res) => {
                    if(res.status === 200) {
                    sessionStorage.setItem('enterpreneur', JSON.stringify(res.data));
                     this.router.navigate(['/loan-application-process']);
                    }
                    else{
                        sessionStorage.setItem('enterpreneur', JSON.stringify({contactNumber: mobile}));
                        this.router.navigate(['/loan-application-process']);
                        
                    }
                },
                error: error => {
                    this.router.navigate(['/loan-application-process']);
                    this.error = 'Server Error. Please try again later.';
                    this.loading = false;
                }
            });
    }
}
