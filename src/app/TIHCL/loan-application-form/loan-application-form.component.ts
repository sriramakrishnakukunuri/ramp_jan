import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var bootstrap: any;
declare var $: any;
@Component({
  selector: 'app-loan-application-form',
  templateUrl: './loan-application-form.component.html',
  styleUrls: ['./loan-application-form.component.css']
})
export class LoanApplicationFormComponent implements OnInit {

  @ViewChild('exampleModal') exampleModal!: ElementRef;
  constructor(private toastrService: ToastrService, private router: Router) { }

  ngOnInit(): void {
    var currentStep = 1;
    var updateProgressBar = function() {
      var progressPercentage = ((currentStep - 1) / 2) * 100;
      $(".progress-bar").css("width", progressPercentage + "%");
    }

    $(document).ready(function() {
      $('#multi-step-form').find('.step').slice(1).hide();
  
      $(".next-step").click(function() {
      if (currentStep < 3) {
          $(".step-" + currentStep).addClass("animate__animated animate__fadeIn");
          currentStep++;
          setTimeout(function() {
          $(".step").removeClass("animate__animated animate__fadeIn").hide();
          $(".step-" + currentStep).show().addClass("animate__animated animate__fadeIn");
          updateProgressBar();
          }, 500);
      }
      });

      $(".prev-step").click(function() {
      if (currentStep > 1) {
          $(".step-" + currentStep).addClass("animate__animated animate__fadeIn");
          currentStep--;
          setTimeout(function() {
          $(".step").removeClass("animate__animated animate__fadeIn").hide();
          $(".step-" + currentStep).show().addClass("animate__animated animate__fadeIn");
          updateProgressBar();
          }, 500);
      }
      });

      updateProgressBar = function() {
      var progressPercentage = ((currentStep - 1) / 2) * 100;
      $(".progress-bar").css("width", progressPercentage + "%");
      }
  });
 
  }

  submitForm(){
    this.toastrService.success('Application Form submitted successfully!');
  }

  logout() {
    this.router.navigate(['/login']);
  }

  checkValidate(value: string): void {
    if (value === 'yes') {
      const modal = bootstrap.Modal.getInstance(this.exampleModal.nativeElement);
      modal.hide();      
      this.router.navigate(['/login']);
    } else {
      const modal = bootstrap.Modal.getInstance(this.exampleModal.nativeElement);
      modal.hide();
    }
  }

  validateEnterpriseCategory(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'Medium' || selectedValue === 'Large') {
      const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
      modal.show();      
    }
  }

  validateNatureOfActivity(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'Services' || selectedValue === 'Trading') {
      const modal = new bootstrap.Modal(this.exampleModal.nativeElement);
      modal.show();
    }
  }

  showApplicationMenu:boolean = false;
  showApplicationStatus(value: string): void {
    if (value === 'yes') {
      this.showApplicationMenu = true;
    } else {
      this.showApplicationMenu = false;
    }
  }

}
