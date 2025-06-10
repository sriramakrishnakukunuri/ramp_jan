import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-oauth-redirect',
  template: `<p>Signing in with Google...</p>`
})
export class OauthRedirectComponent implements OnInit {
  private userSubject: BehaviorSubject<User | null> | undefined;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private AuthenticationService:AuthenticationService
  ) {    
  }

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (code) {
      // Exchange the code with your backend
      this.http.get('http://localhost:8086/api/oauth2/google_token', { params: { code } }).subscribe({
        next: (res: any) => {
          console.log('Google OAuth response:', res);
          let User:any = {
            userId: '',
            email: '',
            firstName: '',
            lastName: '',
            username: '',
            userRole: '',
            mobileNo: '',
            token: ''
          }
          sessionStorage.setItem('user', JSON.stringify(User));
          if (this.userSubject) {
            this.userSubject.next(User);
          }
          this.router.navigateByUrl('/global-dashboard');
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
