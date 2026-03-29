import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     // add auth header with jwt if user is logged in and request is to api url
    //     const user = this.authenticationService.userValue;
    //     const isLoggedIn = user?.token;
    //     const isApiUrl = request.url.startsWith(environment.apiUrl);
    //     if (isLoggedIn && isApiUrl) {
    //         request = request.clone({
    //             setHeaders: {
    //                 Authorization: `Bearer ${user.token}`
    //             }
    //         });
    //     }

    //     return next.handle(request);
    // }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const user = this.authenticationService.userValue;
  const token = user?.token;

  if (!token) return next.handle(request);

  const requestOrigin = new URL(request.url, window.location.origin).origin;
  const allowedOrigins = [
    new URL(environment.apiUrl).origin,
    new URL(environment.fileUrl).origin
  ];

  if (allowedOrigins.includes(requestOrigin)) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next.handle(request);
}
}