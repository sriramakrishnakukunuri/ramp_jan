import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appDisableFutureDates]'
})
export class DisableFutureDatesDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const maxDate = `${year}-${month}-${day}`;
    this.el.nativeElement.max = maxDate;
  }
}