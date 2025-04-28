import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { CommonServiceService } from '@app/_services/common-service.service';
import { API_BASE_URL, APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import moment from "moment";
declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'app-update-program-execution',
  templateUrl: './update-program-execution.component.html',
  styleUrls: ['./update-program-execution.component.css']
})
export class UpdateProgramExecutionComponent implements OnInit {

  mediaCoverageForm!: FormGroup;
  isEditMode = false;
  // Store files separately
  selectedFiles: { [key: string]: File } = {};
  agencyId: any
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
  ) { 
    this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
  }

  ngOnInit(): void {
    this.getProgramsByAgency()
    this.mediaCoverageForm = this.fb.group({
      date: ['', Validators.required],
      mediaCoverageType: ['', Validators.required],
      mediaCoverageUrl: ['', Validators.required],
      programId: [''],
    });
  }

  agencyProgramList: any;
    programId: any = ''
    getProgramsByAgency() {
      this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency + this.agencyId}`).subscribe({
        next: (res: any) => {
          this.agencyProgramList = res?.data
        },
        error: (err) => {
          new Error(err);
        }
      })
  }

  dropdownProgramsList(event: any, type: any) {
    if (event.target.value) {
      this.programId = event.target.value
      this.getProgramDetailsById(this.programId);
    }else {
      this.programId = ''
      this.ProgramData = ''
    }
  }

  ProgramData: any
    getProgramDetailsById(programId: string) {
      this.ProgramData = ''
      this._commonService.getById(APIS.programCreation.getSingleProgramsList, programId).subscribe({
        next: (data: any) => {
          this.ProgramData = data.data;
        }
        , error: (err: any) => {
          new Error(err);
        }
      })
    }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   new DataTable('#creation-table', {              
    //   // scrollX: true,
    //   // scrollCollapse: true,    
    //   // responsive: true,    
    //   // paging: true,
    //   // searching: true,
    //   // ordering: true,
    //   scrollY: "415px",     
    //   scrollX:        true,
    //   scrollCollapse: true,
    //   autoWidth:         true,  
    //   paging:         false,  
    //   info: false,   
    //   searching: false,  
    //   destroy: true, // Ensure reinitialization doesn't cause issues
    //   });
    // }, 500);
  }
  submitRedirect(){
    this.router.navigateByUrl('/veiw-program-creation');
  }

  onFileChange(event: any, field: string) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles[field] = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.mediaCoverageForm.invalid) return;
    this.mediaCoverageForm.value.programId = Number(this.programId)
    let objectnew: any = [this.mediaCoverageForm.value]
    const formData = new FormData();
    const API_ADD_URL = APIS.programExecutions.saveMediaCoverage;
    const apiCalls = objectnew.map((element: any, index: any) => { 
      element['date'] = moment(element['date']).format('DD-MM-YYYY');     
      formData.set("data", JSON.stringify(element));
      return this._commonService.uploadImageResource(API_ADD_URL,formData);
    })
    
    // Append images
    if (this.selectedFiles['image1']) {
      formData.append('image1', this.selectedFiles['image1']);
    }
    if (this.selectedFiles['image2']) {
      formData.append('image2', this.selectedFiles['image2']);
    }
    if (this.selectedFiles['image3']) {
      formData.append('image3', this.selectedFiles['image3']);
    }

    if (this.isEditMode) {
      console.log('Edit FormData:', formData);
      // Call your update API with formData
    } else {
      console.log('Add FormData:', formData);
      // Call your create API with formData
      forkJoin(apiCalls).subscribe({
        next: (results) => {
          this.closeModal();
          this.toastrService.success('Session Details Created Successfully', "Session Creation Success!");
          this.getProgramDetailsById(this.programId);          
        },
        error: (err) => {
          this.closeModal();
          this.toastrService.error(err, "Session Creation Error!");        
        },
      });
    }
  }

  @ViewChild('sessionFormMediaModal') sessionFormMediaModal!: ElementRef;
    closeModal(): void {
      const modal = bootstrap.Modal.getInstance(this.sessionFormMediaModal.nativeElement);
      modal.hide();   
  }

  showSessionEditModal(session?: any) {
    if(!this.ProgramData?.programId) {
      this.toastrService.error("Please Select atleast one Program to add Media Coverage", "Program Error");
      return;
    }

    if (!session) {
      
      const editSessionModal = document.getElementById('sessionFormMediaModal');
      if (editSessionModal) {
        const modalInstance = new bootstrap.Modal(editSessionModal);
        modalInstance.show();
      }
      
      return;
    }
  }
}
