import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { Role } from '@app/_models/role';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
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
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: (res) => {
                    //this.router.navigateByUrl('/program-creation');
                    if (res.status === 200) {
                        // get return url from query parameters or default to home page
                        this.loading = false;
                        if(res.data.userRole === Role.Admin){
                            this.router.navigateByUrl('/veiw-program');
                        }else if(res.data.userRole === Role.AGENCY_MANAGER
                            || res.data.userRole === Role.AGENCY_EXECUTOR
                        ){
                            this.router.navigateByUrl('/program-creation');
                        }else if(res.data.userRole === Role.CALL_CENTER
                        ) {
                            this.router.navigateByUrl('/global-dashboard');
                        }
                        
                    } else if (res.status === 400) {
                        this.error = res.message ? res.message : 'Invalid credentials. Please try again.';
                        this.loading = false;
                    }
                },
                error: error => {
                    this.error = 'Server Error. Please try again later.';
                    this.loading = false;
                }
            });
    }

    clientId = '211431254491-4tp9r0cakfnr4u7946bmh0ncmsb407lj.apps.googleusercontent.com';
    redirectUri = 'http://localhost:4200/oauth2/redirect'; // Adjust as needed
    backendTokenExchangeUrl = 'http://localhost:8086/api/oauth2/access_token'; // Your backend API

    loginAsGuest() {
        const scope = encodeURIComponent('openid profile email');
        const responseType = 'code';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    }
}
