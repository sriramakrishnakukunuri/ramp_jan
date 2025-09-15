import { Component, OnInit, HostListener } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';

@Component({
  selector: 'app-notification-display',
  templateUrl: './notification-display.component.html',
  styleUrls: ['./notification-display.component.css']
})
export class NotificationDisplayComponent implements OnInit {
  userDetails: any;
  notificationsList: any[] = [];
  notificationCount: number = 0;
  panelOpen = false;

  constructor(private commonService: CommonServiceService) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.userDetails && this.userDetails.userId) {
      this.getNotifications();
    }
  }
togglePanel() {
  if (!this.panelOpen) {
    this.panelOpen = true;
    this.markAllAsRead();
  } else {
    this.panelOpen = false;
  }
}
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-bell-container') && !target.closest('.notification-popup')) {
      this.panelOpen = false;
    }
  }

  getNotifications() {
    let url = APIS.notificationDisplay.getNotifications + "?userId=" + this.userDetails.userId;
    this.commonService.getDataByUrl(url)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this.notificationsList = res;
          this.notificationCount = this.notificationsList.length;
        } else {
          this.notificationsList = [];
          this.notificationCount = 0;
        }
      }, (err: any) => {
        console.log(err);
      });
  }

  markAllAsRead() {
    
    const recipientIds = this.notificationsList.map(n => n.id);
    const objArray = recipientIds.map(id => ({ id }));
    // this.notificationsList.forEach(n => n.readRecipients = true);
    this.notificationCount = 0;
    let url= APIS.notificationDisplay.markAsRead;
    this.commonService.patchData(url, objArray)
      .subscribe((res: any) => {
        this.notificationCount = 0;
        console.log('All notifications marked as read',res);
      }, (err: any) => {
        console.log(err);
      });
    
  }
}
