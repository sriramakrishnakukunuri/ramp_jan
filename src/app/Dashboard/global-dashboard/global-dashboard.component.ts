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
    this.url = this.sanitizer
    .bypassSecurityTrustResourceUrl('https://lookerstudio.google.com/embed/reporting/e52e2113-3d3a-4941-a7f3-57d9971064c4/page/rwZEF?cache=' + this.cacheBuster);
  }

}
