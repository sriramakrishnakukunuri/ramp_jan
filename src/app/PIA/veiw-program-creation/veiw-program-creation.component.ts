import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { API_BASE_URL, APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;

@Component({
  selector: 'app-veiw-program-creation',
  templateUrl: './veiw-program-creation.component.html',
  styleUrls: ['./veiw-program-creation.component.css']
})
export class VeiwProgramCreationComponent implements OnInit, AfterViewInit {
  localStorageData: any;
  sessionDetailsList: any;
  tableList: any;
  dataTable: any;
  agencyList: any = [];
  loginsessionDetails: any;
  constructor(
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,
  ) { 
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
  }

  ngOnInit(): void {
    console.log(this.loginsessionDetails);
    if(this.loginsessionDetails.userRole == 'ADMIN') {
      this.getAgenciesList()
    }
    else{
      this.getProgramDetails();
    }
    
  }

  ngAfterViewInit() {
    this.initializeDataTable();
  }
  GetProgramsByAgency(event:any){
    this._commonService.getDataByUrl(APIS.programCreation.getProgramsListByAgency+event).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data;
        this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }

  getProgramDetails(): any {
    this.tableList = '';
    this._commonService.getDataByUrl(APIS.programCreation.getProgramsListByAgency+this.loginsessionDetails.agencyId).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList.data;
        this.reinitializeDataTable();
      },
      error: (error: any) => {
        this.toastrService.error(error.error.message);
      }
    });
  }

  sessionDetails(dataList: any): any {
    this.sessionDetailsList = dataList.programSessionList;
  }

  editProgram(dataList: any): any {
    this.router.navigateByUrl('/program-creation-edit/' + dataList.programId);
  }

  editSession(dataList: any): any {
    this.router.navigateByUrl('/program-sessions-edit/' + dataList.programId);
  }

  initializeDataTable() {
    this.dataTable = new DataTable('#view-table-program', {
      scrollY: "415px",
      scrollX: true,
      scrollCollapse: true,
      autoWidth: true,
      paging: false,
      info: false,
      searching: false,
      destroy: true,
    });
  }

  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      this.initializeDataTable();
    }, 0);
  }

  getAgenciesList() {
    this.agencyList = [];
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      this.GetProgramsByAgency(res.data[0].agencyId);
    }, (error) => {
      this.toastrService.error(error.error.message);
    });
  }

  previewData:any;    
  async showPreviewPopup(dataList: any) {
    this.previewData = ''
    let url = `${API_BASE_URL}/program/file/download/${dataList.programSessionFileId}`
    this.previewData = url
  }

  getFileIcon(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'fas fa-file-pdf';
      case 'doc':
      case 'docx': return 'fas fa-file-word';
      case 'xls':
      case 'xlsx': return 'fas fa-file-excel';
      case 'ppt':
      case 'pptx': return 'fas fa-file-powerpoint';
      default: return 'fas fa-file';
    }
  }
  
  getIconColor(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '#e74c3c';
      case 'doc':
      case 'docx': return '#3498db';
      case 'xls':
      case 'xlsx': return '#2ecc71';
      case 'ppt':
      case 'pptx': return '#e67e22';
      default: return '#7f8c8d';
    }
  }
  
  getFileName(filePath: string): string {
    return filePath.split('/').pop() || 'Download';
  }
  
  collapseStates: { [key: number]: boolean } = {};

  toggleIcon(index: number): void {
    this.collapseStates[index] = !this.collapseStates[index];
  }
    
}
