import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sanctioned-amount',
  templateUrl: './sanctioned-amount.component.html',
  styleUrls: ['./sanctioned-amount.component.css']
})
export class SanctionedAmountComponent implements OnInit {

 constructor(
     private toastrService: ToastrService,
     private _commonService: CommonServiceService,
     private router: Router,
     private sanitizer: DomSanitizer,
   ) { 
    //  this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
   }

  ngOnInit(): void {
    this.getNewApplications(1, 100);
     this.onTabChange('APPLICATIONS_RECEIVED')


  }

activeTab:any='APPLICATIONS_RECEIVED';
   onTabChange(activeTab:any){
    this.activeTab = activeTab;
    if(activeTab=='APPLICATIONS_RECEIVED' ) { 
    
    }
    if(activeTab=='APPLICATIONS_UNDER_PROCESS') {
      console.log(activeTab)
        this.getDataUnit()

    
    }
    else if(activeTab=='APPLICATIONS_WITH_DIC') {
        this.getDataDiagnostic();

    }
    else if(activeTab=='APPLICATIONS_SANCTIONED') { 
    this.getDicData()

    }
    else if(activeTab=='APPLICATIONS_NOT_CONSIDERED') { 
   this.getRampCheckList()
    }else if(activeTab=='PRIMARY_LENDER_NOC') {
     this.getprimaryNoc();
    }else if(activeTab=='SANCTIONED_DETAILS') {
  this.getSanctionList();

    }else if(activeTab=='DISBURSEMENT_DETAILS') {
  this.getdisburseList()

    }
  }
loginsessionDetails:any
filteredEnterprise:any=[]
enterpriseList:any=[]
selectedEnterprise:any
  getNewApplications(pageNo:any,PageSize:any): any {
      this.enterpriseList=[]
       
        // this.activeTab='pendingApplications'
         this._commonService.getDataByUrl(APIS.tihclExecutive.getNewApplications+'?userId='+this.loginsessionDetails?.userId+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize).subscribe({
        next: (dataList: any) => {
          if(dataList){
          this.enterpriseList = dataList.data;
          this.filteredEnterprise=dataList.data
          this.selectedEnterprise=this.enterpriseList[0]?.registrationUsageId;
          this.onEnterpriseChange(this.selectedEnterprise)
          }else{
          this.enterpriseList = [];
          this.filteredEnterprise=[]
          }
          //  this.totalItems=dataList?.totalElements
          // this.reinitializeDataTable();
        },
        error: (error: any) => {
          this.toastrService.error(error.error.message);  
          this.enterpriseList = [];
          this.filteredEnterprise=[]
        }
      });
    }


apllictaionDataGlobal:any;
onEnterpriseChange(selectedId: any) {
  this.apllictaionDataGlobal = this.enterpriseList.find(
    (e: { registrationUsageId: any }) => e.registrationUsageId == selectedId
  );
  this.getDataUnit()
  this.getDataDiagnostic();
  this.getDicData()
  this.getRampCheckList()
  this.getprimaryNoc();
  this.getSanctionList();
  this.getdisburseList()

  console.log('Selected Enterprise:', this.apllictaionDataGlobal);
}

primaryLenderNoc:any=[];
getprimaryNoc(){
 this._commonService.getDataByUrl(APIS.sanctionedAmount.primaryLender.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          if(res.data){
          this.primaryLenderNoc = res.data;
          }else{
            this.primaryLenderNoc=[]
          }
        },
        error: (err: any) => {
          this.primaryLenderNoc = [];
        }
      });
}
sanctionList:any=[];
getSanctionList(){
 this._commonService.getDataByUrl(APIS.sanctionedAmount.sanctionDetails.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          if(res.data){
          this.sanctionList = res.data;
          }else{
            this.sanctionList=[]
          }
        },
        error: (err: any) => {
          this.sanctionList = [];
        }
      });
}
disburseList:any=[];
getdisburseList(){
 this._commonService.getDataByUrl(APIS.sanctionedAmount.disbursementDetails.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          if(res.data){
          this.disburseList = res.data;
          }else{
            this.disburseList=[]
          }
        },
        error: (err: any) => {
          this.disburseList = [];
        }
      });
}

rampCheckLIst:any=[];
getRampCheckList(){
 this._commonService.getDataByUrl(APIS.sanctionedAmount.rampChecklist.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          if(res.data){
          this.rampCheckLIst = res.data;
          }else{
            this.rampCheckLIst=[]
          }
        },
        error: (err: any) => {
          this.rampCheckLIst = [];
        }
      });
}

dicDataLIst:any=[]
getDicData(){
    this._commonService.getDataByUrl(APIS.sanctionedAmount.unitVisit.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          if(res.data){
          this.dicDataLIst = res.data;
          }else{
            this.dicDataLIst=[]
          }
        },
        error: (err: any) => {
          this.dicDataLIst = [];
        }
      });
}


UnitDetails:any;
  getDataUnit(){
     this._commonService.getDataByUrl(APIS.sanctionedAmount.unitVisit.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.UnitDetails = res.data;
        },
        error: (err: any) => {
          this.UnitDetails = null;
        }
      });
  }

  DiagnosticDetails:any;
  getDataDiagnostic(){
     this._commonService.getDataByUrl(APIS.sanctionedAmount.diagnosticReport.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.DiagnosticDetails = res.data;
        },
        error: (err: any) => {
          this.DiagnosticDetails = null;
        }
      });
  }


showCreditPreviewModal3 = false;
  
  safePreviewUrl3: any;
  openCreditPreviewModal3() {
    const path = this.DiagnosticDetails[0]?.urlForDiagnosticFile;
  
    if (path) {
      // only create SafeResourceUrl once
      this.safePreviewUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
  
    this.showCreditPreviewModal3 = true;
  }

    closeCreditPreviewModal3() {
    this.showCreditPreviewModal3 = false;
  }

getSafePreviewUrl2(path: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }

  

    showCreditPreviewModal = false;
  
  safePreviewUrl: any;
  
  openCreditPreviewModal() {
    const path = this.DiagnosticDetails[0]?.urlForDiagnosticFile;
  
    if (path) {
      // only create SafeResourceUrl once
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
  
    this.showCreditPreviewModal = true;
  }
  
  closeCreditPreviewModal() {
    this.showCreditPreviewModal = false;
  }
  
  
  isImageFile(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(filePath || '');
  }
  
   getSafePreviewUrl(): SafeResourceUrl {
      const url = this.DiagnosticDetails[0]?.urlForDiagnosticFile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

sanctionLetterUrl: string | null = null;
    openSanctionLetter(filePath: string | null) {
    this.sanctionLetterUrl = filePath;
    const modal = document.getElementById('sanctionLetterModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }

 

  isPdfFile(path: string): boolean {
    return /\.pdf$/i.test(path);
  }

}
