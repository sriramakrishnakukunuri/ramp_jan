import { Component, OnChanges, OnInit, SimpleChanges, } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from '@app/common_components/loader-service.service';
@Component({
  selector: 'app-sanctioned-amount',
  templateUrl: './sanctioned-amount.component.html',
  styleUrls: ['./sanctioned-amount.component.css']
})
export class SanctionedAmountComponent implements OnInit,OnChanges {

 constructor(
     private toastrService: ToastrService,
     private _commonService: CommonServiceService,
     private router: Router,
     private sanitizer: DomSanitizer,
     private loader:LoaderService
   ) { 
    //  this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
   }

   regId:any;
  ngOnInit(): void {
      this.regId = this._commonService.getSelectedRegistrationId();
  if (this.regId) {
    console.log('Received Registration ID:', this.regId);
    // Find the enterprise with this registrationId
    this.getNewApplications(1, 100); // Load enterpriseList first
    setTimeout(() => {
      const selected = this.enterpriseList.find(
        (e: { registrationId: any }) => e.registrationId == this.regId
      );
      if (selected) {
        this.selectedEnterprise = selected.registrationUsageId;
        this.onEnterpriseChange(this.selectedEnterprise);
      }
    }, 500); // Wait for enterpriseList to load
  }else{
    this.getNewApplications(1, 300);
     this.onTabChange('APPLICATIONS_RECEIVED')
  }

  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['selectedEnterprise']) {
    //   this.onEnterpriseChange(this.selectedEnterprise);
    // }
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
       this.loader.show()
        // this.activeTab='pendingApplications'
        // let url=APIS.tihclExecutive.getNewApplications+'?userId='+this.loginsessionDetails?.userId+'&pageNo=' + (pageNo-1) + '&pageSize=' + PageSize
        // let url=APIS.tihclExecutive.getNewApplications+'?userId='+this.loginsessionDetails?.userId
      let url=APIS.sanctionedAmount.getAppStatus
        this._commonService.getDataByUrl(url).subscribe({
        next: (dataList: any) => {
          this.loader.hide()
          if(dataList){
          this.enterpriseList = dataList.data;
          this.filteredEnterprise=dataList.data
            if(this.regId){
              this.selectedEnterprise=this.regId
            }else{
               this.selectedEnterprise=this.enterpriseList[0]?.registrationId;
            }

          this.onEnterpriseChange(this.selectedEnterprise)
          }else{
          this.enterpriseList = [];
          this.filteredEnterprise=[]
          }
          //  this.totalItems=dataList?.totalElements
          // this.reinitializeDataTable();
        },
        error: (error: any) => {
          this.loader.hide()
          this.toastrService.error(error.error.message);  
          this.enterpriseList = [];
          this.filteredEnterprise=[]
        }
      });
    }


apllictaionDataGlobal:any;
onEnterpriseChange(selectedId: any) {
  this.apllictaionDataGlobal = this.enterpriseList.find(
    (e: { registrationId: any }) => e.registrationId == selectedId
  );
  // this.getDataUnit()
  // this.getDataDiagnostic();
  // this.getDicData()
  // this.getRampCheckList()
  // this.getprimaryNoc();
  // this.getSanctionList();
  // this.getdisburseList()
  this.onTabChange(this.activeTab)

  console.log('Selected Enterprise:', this.apllictaionDataGlobal);
}

primaryLenderNoc:any=[];
getprimaryNoc(){
          this.loader.show();

 this._commonService.getDataByUrl(APIS.sanctionedAmount.primaryLender.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();

          if(res.data){
          this.primaryLenderNoc = res.data;
          }else{
          this.loader.hide();

            this.primaryLenderNoc={}
          }
        },
        error: (err: any) => {
          this.primaryLenderNoc = [];
        }
      });
}
sanctionLetterPreviewUrl: SafeResourceUrl | null = null;

sanctionList:any=[];
getSanctionList(){
          this.loader.show();

 this._commonService.getDataByUrl(APIS.sanctionedAmount.sanctionDetails.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();

          // if (res) {
        this.sanctionList = res;
        this.sanctionLetterPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.sanctionList?.sanctionLetterPath);
      // } else {
      //   this.sanctionList = {};
      // }
        },
        error: (err: any) => {
          this.loader.hide();

          this.sanctionList = [];
        }
      });
}
disburseList:any=[];
getdisburseList(){
          this.loader.show();

 this._commonService.getDataByUrl(APIS.sanctionedAmount.disbursementDetails.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();

          if(res){
          this.disburseList = res;
          }else{
            this.disburseList={}
          }
        },
        error: (err: any) => {
          this.loader.hide();

          this.disburseList = [];
        }
      });
}

rampCheckLIst:any=[];
getRampCheckList(){
          this.loader.show();

 this._commonService.getDataByUrl(APIS.sanctionedAmount.rampChecklist.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();

          if(res){
          this.rampCheckLIst = res;
          }else{
            this.rampCheckLIst={}
          }
        },
        error: (err: any) => {
          this.loader.hide();

          this.rampCheckLIst = [];
        }
      });
}

dicDataLIst:any=[]
getDicData(){
          this.loader.show();

    this._commonService.getDataByUrl(APIS.sanctionedAmount.dicConsent.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();

          if(res.data){
          this.dicDataLIst = res.data['dicNocFilePath'];
          }else{
            this.dicDataLIst=[]
          }
        },
        error: (err: any) => {
          this.loader.hide();

          this.dicDataLIst = [];
        }
      });
}


UnitDetails:any;
  getDataUnit(){
    this.loader.show();
     this._commonService.getDataByUrl(APIS.sanctionedAmount.unitVisit.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();
          this.UnitDetails = res.data;
        },
        error: (err: any) => {
          this.loader.hide()
          this.UnitDetails = null;
        }
      });
  }

  DiagnosticDetails:any;
  getDataDiagnostic(){
          this.loader.show();

     this._commonService.getDataByUrl(APIS.sanctionedAmount.diagnosticReport.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loader.hide();

          this.DiagnosticDetails = res.data;
        },
        error: (err: any) => {
          this.loader.hide();

          this.DiagnosticDetails = null;
        }
      });
  }


showCreditPreviewModal3 = false;
  
  safePreviewUrl3: any;
  openCreditPreviewModal3() {
    const path = this.rampCheckLIst?.creditApprasialPath
  
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

 openSanctionLetterPreview(path: string) {
  if (path) {
    const fullPath = path.startsWith('http') ? path : 'https://tihcl.s3.us-east-1.amazonaws.com' + path;
    this.sanctionLetterPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);
  }
  this.showSanctionLetterModal = true;
}
closeSanctionLetterModal() {
  this.showSanctionLetterModal = false;
  this.sanctionLetterPreviewUrl = null;
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
  
  
  // isImageFile(filePath: string): boolean {
  //   return /\.(jpg|jpeg|png|gif)$/i.test(filePath || '');
  // }
  
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

 

  // isPdfFile(path: string): boolean {
  //   return /\.pdf$/i.test(path);
  // }
formatTime(time: string): string {
  if (!time) return 'N/A';
  const [hour, minute] = time.split(':');
  const h = parseInt(hour, 10);
  const ampm = h < 12 ? 'AM' : 'PM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${minute} ${ampm}`;
}

// Check if file is an image
isImageFile(filePath: string): boolean {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filePath || '');
}

// Check if file is a PDF
isPdfFile(filePath: string): boolean {
  return /\.pdf$/i.test(filePath || '');
}

// Check if file is a video
isVideoFile(filePath: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(filePath || '');
}

// Check if file is a Word/Excel/Other document
isDocFile(filePath: string): boolean {
  return /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(filePath || '');
}

// Get SafeResourceUrl for preview
// getSafePreviewUrl(path: string): SafeResourceUrl {
//   return this.sanitizer.bypassSecurityTrustResourceUrl(path);
// }



    
     showCreditPreviewModalP = false;
safePreviewUrl2: any;

openCreditPreviewModal2(path: string) {
  
  if (path) {
    this.safePreviewUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
  this.showCreditPreviewModalP = true;
}

closeCreditPreviewModal2() {
  this.showCreditPreviewModalP = false;
}


showSanctionLetterModal = false;




// Unique file type checkers for sanction letter
isSanctionImageFile(filePath: any): boolean {
  if (!filePath) return false;
  const url = filePath.changingThisBreaksApplicationSecurity || filePath;
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
}
isSanctionPdfFile(filePath: any): boolean {
  if (!filePath) return false;
  const url = filePath.changingThisBreaksApplicationSecurity || filePath;
  return /\.pdf$/i.test(url);
}
isSanctionVideoFile(filePath: any): boolean {
  if (!filePath) return false;
  const url = filePath.changingThisBreaksApplicationSecurity || filePath;
  return /\.(mp4|webm|ogg)$/i.test(url);
}
isSanctionOtherFile(filePath: any): boolean {
  if (!filePath) return false;
  const url = filePath.changingThisBreaksApplicationSecurity || filePath;
  return !this.isSanctionImageFile(filePath) && !this.isSanctionPdfFile(filePath) && !this.isSanctionVideoFile(filePath);
}



// Common file preview variables
showCommonFilePreviewModal = false;
commonFilePreviewUrl: SafeResourceUrl | null = null;

// Open file preview modal (pass file path)
openCommonFilePreview(path: string | null) {
  if (path) {
    // If path is relative, prepend S3 base URL
    const fullPath = path.startsWith('http') ? path : 'https://tihcl.s3.us-east-1.amazonaws.com' + path;
    this.commonFilePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);
  } else {
    this.commonFilePreviewUrl = null;
  }
  this.showCommonFilePreviewModal = true;
}

// Close file preview modal
closeCommonFilePreview() {
  this.showCommonFilePreviewModal = false;
  this.commonFilePreviewUrl = null;
}

// Check if file is an image
isCommonImageFile(filePath: string | SafeResourceUrl): boolean {
  const url = typeof filePath === 'string' ? filePath : (filePath as any).changingThisBreaksApplicationSecurity || filePath;
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url || '');
}

// Check if file is a PDF
isCommonPdfFile(filePath: string | SafeResourceUrl): boolean {
  const url = typeof filePath === 'string' ? filePath : (filePath as any).changingThisBreaksApplicationSecurity || filePath;
  return /\.pdf$/i.test(url || '');
}

// Check if file is a video
isCommonVideoFile(filePath: string | SafeResourceUrl): boolean {
  const url = typeof filePath === 'string' ? filePath : (filePath as any).changingThisBreaksApplicationSecurity || filePath;
  return /\.(mp4|webm|ogg)$/i.test(url || '');
}

// Check if file is a Word/Excel/Other document
isCommonDocFile(filePath: string | SafeResourceUrl): boolean {
  const url = typeof filePath === 'string' ? filePath : (filePath as any).changingThisBreaksApplicationSecurity || filePath;
  return /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url || '');
}

// Check if file is other type (for download)
isCommonOtherFile(filePath: string | SafeResourceUrl): boolean {
  return !this.isCommonImageFile(filePath) && !this.isCommonPdfFile(filePath) && !this.isCommonVideoFile(filePath) && !this.isCommonDocFile(filePath);
}


}
