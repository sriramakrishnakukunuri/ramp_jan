import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private http: HttpClient) { }
  private formatErrors(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  public add(URL: any, payload: any): Observable<any> {
    return this.http.post(URL, payload).pipe(catchError(this.formatErrors));
  }
 
  public update(URL: any, payload: any, id: number | string): Observable<any> {
    return this.http.put(URL + id, payload).pipe(catchError(this.formatErrors));
  }
  public updatedata(URL: any, payload: any,): Observable<any> {
    return this.http.put(URL, payload).pipe(catchError(this.formatErrors));
  }
}
