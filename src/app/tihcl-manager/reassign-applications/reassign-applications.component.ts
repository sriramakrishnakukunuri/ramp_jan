import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '../../constants/constants';
import { LoaderService } from '@app/common_components/loader-service.service';

@Component({
  selector: 'app-reassign-applications',
  templateUrl: './reassign-applications.component.html',
  styleUrls: ['./reassign-applications.component.css']
})
export class ReassignApplicationsComponent implements OnInit {
  executives: any[] = [];
  selectedExecutiveId: string = '';
  applications: any[] = [];
  loadingApps = false;
  selectedAppNos: string[] = [];
  selectAll: boolean = false;
  showAssignPopup = false;
  assignToExecutiveId = '';
  assignExecutives: any[] = [];
  showConfirmPopup = false;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  activeTab = 'pendingApplications';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _commonService: CommonServiceService,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.fetchExecutives();
  }

  fetchExecutives() {
    this.executives = [];
    this._commonService.getDataByUrl(APIS.masterList.getExecutivesList + 'EXECUTIVE_MANAGER')
      .subscribe((data) => {
        this.executives = data?.data || [];
      });
  }

  onExecutiveChange(event: any) {
    this.selectedExecutiveId = event.target.value;
    // this.openAssignPopup()
    if (this.selectedExecutiveId) {
      this.currentPage = 1;
      this.fetchApplications(this.selectedExecutiveId, this.currentPage, this.pageSize);
    } else {
      this.applications = [];
      this.totalItems = 0;
    }
  }

  fetchApplications(userId: string, pageNo: number, pageSize: number) {
    this.loadingApps = true;
    this.loader.show();
    this._commonService.getDataByUrl(`${APIS.tihclExecutive.getPendingApplications}?pageSize=${pageSize}&pageNo=${pageNo-1}&userId=${userId}`)
      .subscribe((data) => {
        this.applications = data?.data || [];
        this.totalItems = data?.totalElements || 0;
        this.loadingApps = false;
        this.loader.hide();
      }, () => {
        this.applications = [];
        this.totalItems = 0;
        this.loadingApps = false;
        this.loader.hide();
      });
  }

  onSelectAllChange(event: any) {
    this.selectAll = event.target.checked;
    if (this.selectAll) {
      this.selectedAppNos = this.applications.map(app => app.applicationNo);
    } else {
      this.selectedAppNos = [];
    }
  }

  onAppCheckboxChange(appNo: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedAppNos.includes(appNo)) {
        this.selectedAppNos.push(appNo);
      }
    } else {
      this.selectedAppNos = this.selectedAppNos.filter(no => no !== appNo);
      this.selectAll = false;
    }
  }

  openAssignPopup() {
    this.showAssignPopup = true;
     this.assignExecutives=[]
    this._commonService.getDataByUrl(APIS.masterList.getExecutivesList + 'EXECUTIVE_MANAGER')
      .subscribe((data) => {
        this.assignExecutives = (data.data || []).filter((exec: any) => exec.userId !== this.selectedExecutiveId);
      });
  }

  closeAssignPopup() {
    this.showAssignPopup = false;
    this.assignToExecutiveId = '';
  }

  confirmAssign() {
    this.showConfirmPopup = true;
  }

  closeConfirmPopup() {
    this.showConfirmPopup = false;
  }

  submitTransfer() {
    if (!this.assignToExecutiveId || this.selectedAppNos.length === 0) return;
    const params = this.selectedAppNos.map(appNo => `appNos=${appNo}`).join('&') + `&userId=${this.assignToExecutiveId}`;
    this._commonService.updatedata(
      `${APIS.tihclManager.reassignApplication}?${params}`,
      {}
    ).subscribe(
      (res) => {
        this.toastr.success('Applications transferred successfully!');
        this.closeConfirmPopup();
        this.closeAssignPopup();
        this.selectedAppNos = [];
        this.selectAll = false;
         this.currentPage = 1;
      this.fetchApplications(this.selectedExecutiveId, this.currentPage, this.pageSize);
      },
      (err) => {
        this.toastr.error('Transfer failed!');
      }
    );
  }

  onPageChange(event: {page: number, pageSize: number}): void {
     if (this.selectedAppNos.length > 0) {
      this.toastr.warning('Please complete the reassignment before changing pages.');
      return;
    }
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    if (this.selectedExecutiveId) {
      this.fetchApplications(this.selectedExecutiveId, this.currentPage, this.pageSize);
    }
  }
}
