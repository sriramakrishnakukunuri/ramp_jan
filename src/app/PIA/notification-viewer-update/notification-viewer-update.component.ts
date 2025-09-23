import { Component, OnInit,OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var bootstrap: any;
import { Router, NavigationEnd } from '@angular/router'; // Import Router and NavigationEnd
import { LoaderService } from '@app/common_components/loader-service.service';

interface NotificationData {
  id: number;
  dateOfNotification: string;
  dateOfFirstNotification: string | null;
  callCenterAgentName: string;
  agencyName: string;
  participantName: string;
  programName: string;
  status: string;
  dateOfFix: string | null;
  dateOfClosure: string | null;
  recipientType: string;
  remarksByAgency: string[];
  remarksByCallCenter: string[];
}

@Component({
  selector: 'app-notification-viewer-update',
  templateUrl: './notification-viewer-update.component.html',
  styleUrls: ['./notification-viewer-update.component.css']
})
export class NotificationViewerUpdateComponent implements OnInit ,OnChanges{
  activeNotifications: any = [];
  closedNotifications: any = [];
  loading = false;
  error: string | null = null;

  constructor(private commonService: CommonServiceService,
     private toastrService: ToastrService,private router: Router,
    private loader:LoaderService
    ) {}
  userDetails: any;
  ngOnInit() {
    this.formDeatials()
     this.userDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log(this.userDetails);
    if (this.userDetails && this.userDetails.userId) {
      // this.getNotifications();
      this.loadNotifications();
    }
    // Listen for refresh events from service
  this.commonService.refresh$.subscribe(() => {
    this.loadNotifications();
  });

     // Listen for navigation events to reload notifications
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadNotifications();
      }
    });
    
  }

  ngOnChanges() {
      // Listen for navigation events to reload notifications
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadNotifications();
      }
    });
  }

  loadNotifications() {
    this.loader.show();
    this.loading = true;
    this.error = null;
     this.activeNotifications=[]
      this.closedNotifications=[]
     let url:any= ''
        if(this.userDetails.userRole=='AGENCY_MANAGER' || this.userDetails.userRole=='AGENCY_EXECUTOR'){ 
            url=APIS.notificationDisplay.getNotificationByAgency + this.userDetails.agencyId
        }
        else{
            url=APIS.notificationDisplay.getNotificationByCallCenter+this.userDetails.userId;
        }
    
    this.commonService.getDataByUrl(url+'?statuses=OPEN&statuses=IN_PROGRESS&statuses=Completed').subscribe({
      next: (data) => {
        this.loader.hide();
         this.activeNotifications=data
        //  this.reinitializeDataTable();
        this.loading = false;
      },
      error: (err) => {
        this.loader.hide();

        this.error = 'Failed to load notifications';
        this.loading = false;
        console.error('Error loading notifications:', err);
      }
    });
     this.commonService.getDataByUrl(url+'?statuses=CLOSED').subscribe({
      next: (data) => {
       
        this.closedNotifications=data
        // this.reinitializeDataTable();
        // this.separateNotifications(data);
        this.loading = false;
      },
      error: (err) => {
         this.activeNotifications=[]
        this.error = 'Failed to load notifications';
        this.loading = false;
        console.error('Error loading notifications:', err);
      }
    });
  }
   dataTable: any;
    // reinitializeDataTable() {
    //   if (this.dataTable) {
    //     this.dataTable.destroy();
    //   }
    //   setTimeout(() => {
    //     this.initializeDataTable();
    //     this.initializeDataTable1();
    //   }, 0);
    // }
        // initializeDataTable() {
        //     this.dataTable = new DataTable('#view-table-participant1', {
        //       // scrollX: true,
        //       // scrollCollapse: true,    
        //       // responsive: true,    
        //       // paging: true,
        //       // searching: true,
        //       // ordering: true,
        //       scrollY: "415px",
        //       scrollX: true,
        //       scrollCollapse: true,
        //       autoWidth: true,
        //       paging: true,
        //       info: false,
        //       searching: false,
        //       destroy: true, // Ensure reinitialization doesn't cause issues
        //     });
        //   }
        //    initializeDataTable1() {
        //     this.dataTable = new DataTable('#view-table-participant2', {
        //       // scrollX: true,
        //       // scrollCollapse: true,    
        //       // responsive: true,    
        //       // paging: true,
        //       // searching: true,
        //       // ordering: true,
        //       scrollY: "415px",
        //       scrollX: true,
        //       scrollCollapse: true,
        //       autoWidth: true,
        //       paging: true,
        //       info: false,
        //       searching: false,
        //       destroy: true, // Ensure reinitialization doesn't cause issues
        //     });
        //   }
  separateNotifications(data: NotificationData[]) {
    this.activeNotifications = data.filter(notification => 
      ['OPEN', 'IN_PROGRESS'].includes(notification.status)
    );
    this.closedNotifications = data.filter(notification => 
      ['COMPLETED', 'CLOSED'].includes(notification.status)
    );
  }

  refreshData() {
    this.loadNotifications();
  }
  updateForm!:FormGroup
  formDeatials(){
    this.updateForm = new FormGroup({
      notificationId: new FormControl(''),
      status: new FormControl('',[Validators.required]),
      remark: new FormControl('',[Validators.required, ]),
      remarkBy: new FormControl('')
    });
  }
  openModel(data:any){
    this.updateForm.patchValue({
      notificationId: data.id,
      status: data.status,
      remark: '',
      remarkBy: data.recipientType || 'AGENCY'
    });
      const modalElement = document.getElementById('updateNotificationModal');
      if (modalElement && modalElement.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
      }
      const modal1 = new bootstrap.Modal(modalElement);
      modal1.show();
  }
  cloaseModal(){
      // Remove focus from any element inside the modal before hiding
      const modalElement = document.getElementById('updateNotificationModal');
      if (modalElement && modalElement.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur();
      }
      const modal1 = new bootstrap.Modal(modalElement);
      modal1.hide();
  }
  submitUpdate(){
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }
    const payload={
      notificationId:this.updateForm.value.notificationId,
      status:this.updateForm.value.status,
      remark:this.updateForm.value.remark,
      remarkBy:this.updateForm.value.remarkBy
    }
    console.log(payload);
    this.commonService.updatebyPatch(APIS.notificationDisplay.updateData, payload).subscribe({
      next: (res) => {
        this.toastrService.success('Notification updated successfully!', 'Success');
        console.log('Notification updated successfully', res);
        this.cloaseModal()
        this.loadNotifications();
      },
      error: (err) => {
          this.cloaseModal()
          this.toastrService.error('Failed to update notification.', 'Error');
        console.error('Error updating notification:', err);
      }
    });
}
}