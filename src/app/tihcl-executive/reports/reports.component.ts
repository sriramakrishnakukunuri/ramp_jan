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

   constructor(
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
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
}
