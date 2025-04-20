import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData:any
  @ViewChild('ModalProfile') ModalProfile!: ElementRef;
  constructor() { 
    this.userData = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
  }

  openModalProfile(): void {
    const modal = new bootstrap.Modal(this.ModalProfile.nativeElement);
    modal.show();
  }

}
