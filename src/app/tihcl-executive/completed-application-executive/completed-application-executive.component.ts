import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-completed-application-executive',
  templateUrl: './completed-application-executive.component.html',
  styleUrls: ['./completed-application-executive.component.css']
})
export class CompletedApplicationExecutiveComponent implements OnInit {
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  tableList: any[] = [];
  searchType: any = '';
  searchText: any = '';
  activeTab = 'completedApplications';
  loginsessionDetails: any;

  constructor(
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
    private router: Router,
  ) {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    this.getCompletedApplications(1, 10);
  }

  onPageChange(event: { page: number, pageSize: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.getCompletedApplications(this.currentPage, this.pageSize);
  }

  getCompletedApplications(pageNo: any, pageSize: any): void {
    this.tableList = [];
    let url = APIS.tihclExecutive.getCompletedApplications + '?userId=' + this.loginsessionDetails?.userId + '&pageNo=' + (pageNo - 1) + '&pageSize=' + pageSize;
    if (this.searchType && this.searchText) {
      url += '&' + this.searchType + '=' + this.searchText;
    }
    this._commonService.getDataByUrl(url).subscribe({
      next: (dataList: any) => {
        this.tableList = dataList?.data || [];
        this.totalItems = dataList?.totalElements || 0;
      },
      error: (error: any) => {
        this.totalItems = 0;
        this.toastrService.error(error?.error?.message);
      }
    });
  }

  filterTable(): void {
    this.currentPage = 1;
    this.getCompletedApplications(1, this.pageSize);
  }

  selectApplication(item: any): void {
    sessionStorage.setItem('ApplicationData', JSON.stringify(item));
    this.router.navigate(['/executive-workflow']);
  }
}
