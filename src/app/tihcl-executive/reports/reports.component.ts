import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ToastrService } from 'ngx-toastr';
import { API_BASE_URL, APIS } from '@app/constants/constants';
import { Role } from '@app/_models';
import { LoaderService } from '@app/common_components/loader-service.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  loginsessionDetails:any
  activeTab:any='pendingApplications';
   constructor(
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {
     this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    this.getAllDistricts();
    this.getallExecutives();
     this.getDataBasedOnFilters(1, 10);
  }
  showReportSection: boolean = true;
  toggleReportSection(){
    this.showReportSection = !this.showReportSection;
  }
  DownloadExcelOverView(reportType: string) {
    let url = '';
    let fileName = '';
    if (reportType === '1' || reportType === 'Overview Excel') {
      url = `${API_BASE_URL}${APIS.tihclReports.EXECUTIVE_DOWNLOAD_OVERVIEW_REPORT_EXCEL}`;
      fileName = 'OverView_Report.xlsx';
    } 
    else if( reportType === '2' || reportType === 'Status Excel') {
      fileName = 'Status_Report.xlsx';
      url = `${API_BASE_URL}${APIS.tihclReports.EXECUTIVE_DOWNLOAD_PARTICIPANT_STATUS_REPORT_EXCEL}`;
    }
    else if( reportType === 'Stress Score Excel') {
      fileName = 'Stress_Score_Report.xlsx';
      url = `${API_BASE_URL}${APIS.tihclReports.EXECUTIVE_STRESS_SCORE_REPORT_EXCEL}`;
    }
    else if( reportType === 'Sanctioned Details Excel') {
      fileName = 'Sanctioned_Details_Report.xlsx';
      url = `${API_BASE_URL}${APIS.tihclReports.EXECUTIVE_STRESS_SANCTIONED_DETAILS_REPORT_EXCEL}`;
    }
    else if( reportType === 'Fee Collection Details Excel') {
      fileName = 'Fee_Collection_Details_Report.xlsx';
      url = `${API_BASE_URL}${APIS.tihclReports.EXECUTIVE_STRESS_FEE_COLLECTION_DETAILS_REPORT_EXCEL}`;
    }
    
    this.downloadFile(url, fileName);
  }

   isDownloading: boolean = false;
  downloadFile(url: string, fileName: string) {
    this.isDownloading = true;
    this.loaderService.show('Downloading file...');
    console.log('Downloading file from URL:', url);
    // this._commonService.downloadFile(url,fileName)
    this._commonService.downloadFileExcelOrPdf(url).subscribe({
      next: (response: Blob) => {
        console.log(response)
        this.loaderService.hide();
        this.isDownloading = false;
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.toastrService.success('File downloaded successfully.');
      },
      error: (err) => {
        this.loaderService.hide();
        this.isDownloading = false;
        this.toastrService.error(err.error?.message || 'Failed to download file.');
      },
    });
  }
  districtName:any=''
   allDistricts:any=[]
   filterallDistricts:any=[]
  getAllDistricts(){
    this.allDistricts = []
    this._commonService.getDataByUrl(APIS.masterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
        this.districtName=data.data[0]?.districtName
        this.filterallDistricts=this.allDistricts.slice()
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    })
  }
   allExecutives:any=''
   executiveName:any=''
   filterallExecutives:any=[]
  getallExecutives(){
    this.allExecutives = []
    console.log(this.loginsessionDetails)
    this._commonService.getDataByUrl(APIS.masterList.getExecutivesList+this.loginsessionDetails?.userRole).subscribe({
      next: (data: any) => {
        this.allExecutives = data.data;
         this.executiveName=data.data[0]?.userId
        this.filterallExecutives=this.allExecutives.slice()
      },
      error: (err: any) => {
        this.allExecutives = [];
      }
    })
  }
   allCategory:any=''
   category:any='Manufacturing'
  // getallCategory(){
  //   this.allCategory = []
  //   this._commonService.getDataByUrl(APIS.masterList.getDistricts).subscribe({
  //     next: (data: any) => {
  //       this.allCategory = data.data;
  //     },
  //     error: (err: any) => {
  //       this.allCategory = [];
  //     }
  //   })
  // }
  // pagination variables
  currentPage = 1;
  pageSize = 10;
  totalItems = 100;
  pagedData: any[] = [];
  onPageChange(event: {page: number, pageSize: number}): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
     this.getDataBasedOnFilters(this.currentPage,  this.pageSize);
  }
  DownloadApplicationReport(id:any){
    this.downloadFile(APIS.tihclReports.DownloadPdfBasedId+id, 'Application_Report.pdf');
  }
  GetDataByFilter(event:any){
    this.currentPage=1
    this.pageSize=10
    this.getDataBasedOnFilters(this.currentPage,  this.pageSize);
  }
  tableList:any
  getDataBasedOnFilters(pageNo:any,PageSize:any): any {

    // Implement data fetching logic based on filters here
    let parameter:any=''
    if(this.executiveName && this.category && this.districtName){
        parameter=`&userId=${this.executiveName}&enterpriseCategory=${this.category}&district=${this.districtName}`
    }
    else if(this.executiveName && this.category){
        parameter=`&userId=${this.executiveName}&enterpriseCategory=${this.category}`
    }
    else if(this.executiveName && this.districtName){
        parameter=`&userId=${this.executiveName}&district=${this.districtName}`
    }
    else if( this.category && this.districtName){
        parameter=`&enterpriseCategory=${this.category}&districtName=${this.districtName}`
    }
    else if(this.executiveName){
        parameter=`&userId=${this.executiveName}`
    }
    else if(this.category){
        parameter=`&enterpriseCategory=${this.category}`
    }
    else if(this.districtName){
        parameter=`&district=${this.districtName}`
    }
    this.loaderService.show();
    this.tableList = '';
     this._commonService.getDataByUrl(APIS.tihclReports.getData+'?page=' + (pageNo-1) + '&size=' + PageSize+parameter).subscribe({
        next: (dataList: any) => {
          this.loaderService.hide()
          this.tableList = dataList?.data;
          this.totalItems=dataList?.totalElements
        },
        error: (error: any) => {
          this.loaderService.hide()

          this.toastrService.error(error.error.message);
        }
      });

  }

}
