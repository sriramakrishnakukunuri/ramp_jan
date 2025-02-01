import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIS } from '@app/constants/constants';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';

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
  public getById(URL: any, id: any,): Observable<any> {
    return this.http.get(URL+id).pipe(catchError(this.formatErrors));
  }

  uploadImage(formData:any): Observable<any> {
    const url = APIS.programCreation.addSessions;
    return this.http.post(url, formData);
  }

  public getDataByUrl(URL: any): Observable<any> {
    return this.http.get(URL).pipe(catchError(this.formatErrors));
  }
  requestDataFromMultipleSources( url1:any, url2:any, fileData:any,sessionData:any): Observable<any[]> {    
    let response1 = this.http.post(url1, fileData).pipe(catchError(this.formatErrors));
    let response2=this.http.post(url2, sessionData).pipe(catchError(this.formatErrors));
    // sessionData.map((data:any)=>{ 
    //   console.log(data)
    //   let formData = new FormData();
    //   console.log(data.uploaFile,uploadFiles)
    //   // formData.set("files",data);
    //   if(uploadFiles.length==1){
    //     formData.append("files", uploadFiles);
    //   }
    //   else{
    //     uploadFiles.forEach((file:any) => {
    //       formData.append("files", file);
    //     })
    //   }
     
    //   delete data.uploaFile;
    //   formData.set("data", data);
    //   console.log(formData)
    //   response2 = this.http.post(url2,formData).pipe(catchError(this.formatErrors));
    // })
    
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2]);
  }
}
