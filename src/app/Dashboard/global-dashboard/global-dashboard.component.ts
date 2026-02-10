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
  constructor(
    private sanitizer: DomSanitizer
  ) { }

 
  loginsessionDetails: any;
 

  ngOnInit(): void {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
    console.log(this.loginsessionDetails);
    //console.log('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/page/p_iqwy179urd')
    // this.url = this.sanitizer
    // .bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/page/p_iqwy179urd?cache=' + this.cacheBuster);
    this.setDashboardUrl();
  }


  setDashboardUrl(): void {
    if(this.loginsessionDetails && this.loginsessionDetails.userRole=='"EXECUTIVE_MANAGER"') {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://lookerstudio.google.com/embed/reporting/52880037-9096-4a97-9068-aeefbb359054/page/PAGE_7_ID?params=%7B%22id%22%3A%22'+this.loginsessionDetails.userId+'5%22%7D'
      );
    }
    else{
        switch (this.loginsessionDetails.userId) {   
        //  Manager Login --- Feb 10th 2026
      case 'b3ca0091-d2e6-4716-9c72-f4f3889d36ca':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://lookerstudio.google.com/embed/reporting/c3cfbbe8-992b-43a0-9e29-6a0e34c81dd2/page/VgMUF'
        );
        break;
      case 'e3d08054-e5cb-4231-9eb0-432ac2c569a8':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://lookerstudio.google.com/embed/reporting/480e6275-7aac-4c37-856f-a6f5fcde3f21/page/VgMUF'
        );
        break;
        // Executive Login --- Feb 10th 2026
         case '1145be0e-fbbb-47d2-b67d-030c95d1f369':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://lookerstudio.google.com/embed/reporting/8f3200a9-5c2f-425f-b89e-71a880d1550a/page/p_p68byoxbvd'
        );
        break;
         case '21d35a88-bb51-4ed0-be36-2fa7b3a500d5':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/be915832-9da4-422d-8ea1-3a64b5dca0e1/page/p_p68byoxbvd'
        );
        break;
         case '5bea8a43-db75-4292-8f51-1e85ba44111a':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/f877f566-5fd6-4c9b-9f09-299ae94fa768/page/p_p68byoxbvd'
        );
        break;
         case '756edb90-97ac-4b30-9ba6-74509788cda6':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/74368c36-2e1c-4ddd-8691-e6b57c4fa200/page/p_p68byoxbvd'
        );
        break;
         case 'bc1ac718-4d6e-4a86-9ec0-a9b1748f2a49':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/643d2038-ec80-40f8-afee-704cd8e3a1e1/page/p_p68byoxbvd'
        );
        break;
        case 'c7c4df33-38c4-43a0-86a3-b12baf093640':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/b966437e-860b-4080-8a8d-c213cf9329ee/page/p_p68byoxbvd'
        );
        break;
        case 'cc071924-5d3a-4cd3-9287-37da92485855':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/7b94d358-96f5-499d-8187-8291038cc449/page/p_p68byoxbvd'
        );
        break;
        case '9c99aff3-f2e5-4785-8b74-81836f774a9e':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/643d2038-ec80-40f8-afee-704cd8e3a1e1/page/p_p68byoxbvd'
        );
        break;
        // DIC  login ---Jan 28th 2026
         case 'f2b8f2aa-9259-467c-926d-b296504401ea':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/52581a80-1cbb-4ef1-bb4c-6aa2900243ae/page/KkgmF'
        );
        break;
        // COI Login  ---Jan 28th 2026
        case '173440de-f39a-4d13-b6bd-dd23d5ab1ea6':
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/d5ce2fe0-2a54-48d2-b30e-21371b1d8af4/page/VgMUF'
        );
        break;

      default:
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
           'https://lookerstudio.google.com/embed/reporting/7b94d358-96f5-499d-8187-8291038cc449/page/p_p68byoxbvd'
        );
    }
    }
  
  }

}
