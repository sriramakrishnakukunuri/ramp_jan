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

  ngOnInit(): void {
    console.log('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/page/p_iqwy179urd')
    this.url = this.sanitizer
    .bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/page/p_iqwy179urd?cache=' + this.cacheBuster);
  }

  // this.url = this.sanitizer
  //   .bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b/pages/p_iqwy179urd?cache=' + this.cacheBuster);
  
  //https://lookerstudio.google.com/embed/reporting/e52e2113-3d3a-4941-a7f3-57d9971064c4/page/rwZEF
  //https://lookerstudio.google.com/reporting/fcab1a0e-f906-4487-85fa-8097553cbc4b

}
