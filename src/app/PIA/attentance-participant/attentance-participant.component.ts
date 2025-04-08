import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-attentance-participant',
  templateUrl: './attentance-participant.component.html',
  styleUrls: ['./attentance-participant.component.css']
})
export class AttentanceParticipantComponent implements OnInit,AfterViewInit {
  loginsessionDetails: any;
  agencyId: any;
  programIds:any
  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService, private router: Router,) { 
      this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
    }

    ngOnInit(): void {
      this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
      this.getProgramsByAgency()
    }

    ngAfterViewInit(): void {
      
    }

    agencyProgramList: any;
    getProgramsByAgency() {
      this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency+'/'+(this.loginsessionDetails.agencyId?this.loginsessionDetails.agencyId:this.agencyId)}`).subscribe({
        next: (res: any) => {
          this.agencyProgramList = res?.data
          this.programIds = this.agencyProgramList[0].programId
          this.getData()
        },
        error: (err) => {
          new Error(err);
        }
      })
    }
    dropdownProgramsList(event: any, type: any) {
      this.ParticipantAttendanceData = ''
      this.programIds = event.target.value
      if (type == 'table' && event.target.value) {
        this.getData()
      }
    }
    ParticipantAttendanceData:any
    getData() {
      this.ParticipantAttendanceData = ''
     
      this._commonService.getById(APIS.Attendance.getDeatails, this.programIds).subscribe({
        next: (res: any) => {          
          this.ParticipantAttendanceData = res?.data   
          //this.reinitializeDataTable();    
             
          // this.advanceSearch(this.getSelDataRange);
          // modal.close()
  
        },
        error: (err) => {
          this.toastrService.error(err.message, "Participant Data Error!");
          new Error(err);
        },
      });
      // console.log(this.ParticipantAttentance)
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
      this.dataTable = new DataTable('#attendance-table', {        
        scrollY: "415px",
        scrollX: true,
        scrollCollapse: true,
        autoWidth: true,
        paging: false,
        info: false,
        searching: false,
        destroy: true, // Ensure reinitialization doesn't cause issues        
      });
      if (this.dataTable) {
        setTimeout(() => {
            this.dataTable.columns.adjust();
        }, 0);
      }
    }

    // Add this method to your component
    getAttendanceHeaders() {
      if (this.ParticipantAttendanceData?.participantAttendanceList?.length) {
          return this.ParticipantAttendanceData.participantAttendanceList[0]?.attendanceData || [];
      }
      return [];
    }
}
