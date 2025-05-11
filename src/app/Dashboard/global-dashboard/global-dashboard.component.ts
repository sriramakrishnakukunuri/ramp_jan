import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-global-dashboard',
  templateUrl: './global-dashboard.component.html',
  styleUrls: ['./global-dashboard.component.css']
})
export class GlobalDashboardComponent implements OnInit {

  url:any
  cacheBuster = new Date().getTime();
  loginsessionDetails: any;
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
    //console.log('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/page/p_iqwy179urd')
    // this.url = this.sanitizer
    // .bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/page/p_iqwy179urd?cache=' + this.cacheBuster);
    this.setDashboardUrl();
  }


  setDashboardUrl(): void {
    switch (this.loginsessionDetails.agencyName) {      
      case 'ALEAP':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://lookerstudio.google.com/embed/reporting/e52e2113-3d3a-4941-a7f3-57d9971064c4/page/rwZEF?cache=' + this.cacheBuster
        );
        break;
      case 'WeHub':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://lookerstudio.google.com/embed/reporting/98604721-c7de-42b5-9fb0-966ef782aa10/page/RJ1JF?cache=' + this.cacheBuster
        );
        break;
      default:
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://lookerstudio.google.com/embed/reporting/609011ae-c72d-4c66-805f-2468db0fd392/page/8ewJF?cache=' + this.cacheBuster
        );
    }
  }
  // this.url = this.sanitizer
  //   .bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/pages/p_iqwy179urd?cache=' + this.cacheBuster);
  
  //https://lookerstudio.google.com/embed/reporting/e52e2113-3d3a-4941-a7f3-57d9971064c4/page/rwZEF
  //https://lookerstudio.google.com/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b

}
