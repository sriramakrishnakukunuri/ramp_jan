import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { Role } from '@app/_models/role';

@Component({ templateUrl: 'login.component.html', })
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
     otpForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    loginType: string = 'team-member'; 
    phoneNumber: string = '';
    passwordshowConfirm: Boolean=false;
    captchaValue: string = '';
    captchaInput: string = '';
    captchaSvg: string = '';
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
         this.switchLoginType('team-member'); 
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
                    this.loginForm = this.formBuilder.group({
                        phone: ['', [Validators.required, Validators.pattern(/^[6789]\d{9}$/)]]
                    });
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
                         else if(res.userRole === Role.TIHCL_DIC){
                            this.router.navigateByUrl('/DIC-NOC');
                        }
                         else if(res.userRole === Role.TIHCL_COI){
                            this.router.navigateByUrl('/view-application');
                        }
                },
                error: error => {
                    this.error = 'Invalid credentials. Please try again.';
                    this.loading = false;
                }
            });
    }

// Captcha code added by -- 27th july
    defaultOTPScreen:boolean = false;
    Mobileerror:string = '';
    generateCaptcha() {
        // Generate a random 6-character alphanumeric string
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let value = '';
        for (let i = 0; i < 6; i++) {
            value += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.captchaValue = value;
        this.captchaSvg = this.renderCaptchaSvg(value);
        this.captchaInput = '';
    }

    renderCaptchaSvg(text: string): string {
        let svg = `<svg width='180' height='50' xmlns='http://www.w3.org/2000/svg'>`;
        let x = 10;
        for (let i = 0; i < text.length; i++) {
            const rotate = Math.floor(Math.random() * 40) - 20;
            const color = `hsl(${Math.random()*360},70%,40%)`;
            svg += `<text x='${x}' y='35' font-size='28' font-family='monospace' fill='${color}' transform='rotate(${rotate} ${x} 35)'>${text[i]}</text>`;
            x += 25;
        }
        for (let i = 0; i < 4; i++) {
            svg += `<line x1='${Math.random()*180}' y1='${Math.random()*50}' x2='${Math.random()*180}' y2='${Math.random()*50}' stroke='#bbb' stroke-width='2' />`;
        }
        svg += `</svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    OTPVerify(value?: any) {
        this.Mobileerror = '';
        this.error = '';
        // Use the phone value from the form for entrepreneur login
        let phone = this.loginType === 'entrepreneur' ? this.loginForm.get('phone')?.value : this.phoneNumber;
        if (value == 'BACK') {
            this.defaultOTPScreen = false;
            this.loginType = 'entrepreneur';
            this.switchLoginType('entrepreneur');
            return;
        }
        if (value == 'SUBMIT') {
            if (this.captchaInput && this.captchaInput.trim().toLowerCase() === this.captchaValue.toLowerCase()) {
                this.authenticationService.login('executive1@gmail.com', 'Password@123')
                    .pipe(first())
                    .subscribe({
                        next: (res) => {
                            if (res.status === 200) {
                                this.loading = false;
                            } else if (res.status === 400) {
                                this.error = res.message ? res.message : 'Invalid credentials. Please try again.';
                                this.loading = false;
                            }
                            this.getDataBasedOnMobile(phone);
                        },
                        error: error => {
                            this.error = 'Server Error. Please try again later.';
                            this.loading = false;
                        }
                    });
                return;
            } else {
                this.error = 'Incorrect captcha. Please try again.';
                this.generateCaptcha();
            }
        } else {
            if (phone && phone.toString().length == 10 && /^[6789]\d{9}$/.test(phone)) {
                this.defaultOTPScreen = true;
                this.generateCaptcha();
            } else {
                this.Mobileerror = 'Phone number must be 10 digits and start with 6, 7, 8, or 9';
                this.loading = false;
                return;
            }
            this.error = '';
            this.loading = false;
        }
        return;
    }



    // OTPVerify(value?:any) {
    //     this.Mobileerror = '';
    //     this.error=''
    //     if(value == 'BACK'){
    //          this.defaultOTPScreen = false;
    //          this.loginType='entrepreneur';
    //          this.switchLoginType('entrepreneur')
    //          return
    //     } 
    //     if(value == 'SUBMIT') {

    //       if(this.fOtp.otp.valid && this.fOtp.otp.value == '123456'){ 
    //           this.authenticationService.login('executive1@gmail.com', 'password123')
    //         .pipe(first())
    //         .subscribe({
    //             next: (res) => {
    //                 //  this.router.navigate(['/loan-application-process']);
    //                 //this.router.navigateByUrl('/program-creation');
    //                 if (res.status === 200) {
    //                     // get return url from query parameters or default to home page
    //                     this.loading = false;
                        
    //                 } else if (res.status === 400) {
    //                     this.error = res.message ? res.message : 'Invalid credentials. Please try again.';
    //                     this.loading = false;
    //                 }
    //                 this.getDataBasedOnMobile(this.phoneNumber)
    //             },
    //             error: error => {
    //                 this.error = 'Server Error. Please try again later.';
    //                 this.loading = false;
    //             }
    //         });
           
    //         return
    //     }
    //     else{
    //           this.error = 'Incorrect OTP. Please try again.';
    //     }
    //     }
    //     else{
    //         if(this.phoneNumber?.toString().length==10){
    //              this.otpForm = this.formBuilder.group({
    //                     otp: ['', Validators.required]
    //                 });
    //             this.defaultOTPScreen = true;
    //         }
    //         else{
    //             this.Mobileerror = 'Phone number must be 10 digits';
    //             this.loading = false;
    //             return;
    //         }
    //         this.error = '';
    //         this.loading = false;
    //     }

        
    //     return
    // }


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
                    sessionStorage.setItem('enterpreneur', JSON.stringify({contactNumber: mobile}));
                    this.router.navigate(['/loan-application-process']);
                    this.error = 'Server Error. Please try again later.';
                    this.loading = false;
                }
            });
    }
}
