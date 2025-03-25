import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import DataTable from 'datatables.net-dt';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-msme-councellor-data',
  templateUrl: './view-msme-councellor-data.component.html',
  styleUrls: ['./view-msme-councellor-data.component.css']
})
export class ViewMsmeCouncellorDataComponent implements OnInit {

  agencyId: any;
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    }

  ngOnInit(): void {
    this.getData()
  }
  submitedData:any
  getData() {
    this.submitedData = ''
   
    this._commonService.getDataByUrl(APIS.counsellerData.getData).subscribe({
      next: (res: any) => {
        this.submitedData = res?.data
        this.reinitializeDataTable();
        // this.advanceSearch(this.getSelDataRange);
        // modal.close()

      },
      error: (err) => {
        this.toastrService.error(err.message, "Participant Data Error!");
        new Error(err);
      },
    });
    // console.log(this.submitedData)
  }
  dataTable: any;
  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      this.initializeDataTable();
    }, 0);
  }

  initializeDataTable() {
    this.dataTable = new DataTable('#view-table-Counseller', {
      // scrollX: true,
      // scrollCollapse: true,    
      // responsive: true,    
      // paging: true,
      // searching: true,
      // ordering: true,
      scrollY: "415px",
      scrollX: true,
      scrollCollapse: true,
      autoWidth: true,
      paging: false,
      info: false,
      searching: false,
      destroy: true, // Ensure reinitialization doesn't cause issues
    });
  }

}
