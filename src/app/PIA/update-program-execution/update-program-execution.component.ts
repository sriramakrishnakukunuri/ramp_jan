import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { CommonServiceService } from '@app/_services/common-service.service';
import { API_BASE_URL, APIS } from '@app/constants/constants';
declare var $: any;
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
  ) { 
    this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
  }

  ngOnInit(): void {
    this.getProgramsByAgency()
    this.mediaCoverageForm = this.fb.group({
      date: ['', Validators.required],
      mediaCoverageType: ['', Validators.required],
      mediaCoverageUrl: ['', Validators.required],
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

    const formData = new FormData();
    formData.append('programId', '1');
    formData.append('date', this.mediaCoverageForm.get('date')?.value);
    formData.append('mediaCoverageType', this.mediaCoverageForm.get('mediaCoverageType')?.value);
    formData.append('mediaCoverageUrl', this.mediaCoverageForm.get('mediaCoverageUrl')?.value);

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
    }
  }
}
