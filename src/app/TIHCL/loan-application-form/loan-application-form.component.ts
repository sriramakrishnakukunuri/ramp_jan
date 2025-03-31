import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-loan-application-form',
  templateUrl: './loan-application-form.component.html',
  styleUrls: ['./loan-application-form.component.css']
})
export class LoanApplicationFormComponent implements OnInit {

  constructor(private toastrService: ToastrService,) { }

  ngOnInit(): void {
  }

  submitForm(){
    this.toastrService.success('Application Form submitted successfully!');
  }

}
