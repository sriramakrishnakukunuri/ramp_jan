import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-program-summary',
  templateUrl: './program-summary.component.html',
  styleUrls: ['./program-summary.component.css']
})
export class ProgramSummaryComponent implements OnInit {
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
      if(this.loginsessionDetails.userRole == 'ADMIN') {
        this.getAgenciesList()
      }
      else{
        this.getProgramsByAgency( this.agencyId )
      }  
      
    }
    agencyList: any;  
    getAgenciesList() {
      this.agencyList = [];
      this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe((res: any) => {
        this.agencyList = res.data;
        this.getProgramsByAgency(res.data[0].agencyId);
      }, (error) => {
        this.toastrService.error(error.error.message);
      });
    }
    agencyProgramList: any;
      getProgramsByAgency(agency:any) {
        this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency+(agency?agency:this.loginsessionDetails.agencyId)}`).subscribe({
          next: (res: any) => {
            this.PrigramSummaryData = {}
            this.agencyProgramList = res?.data
            if(res.data?.length){
              this.programIds = this.agencyProgramList[0].programId;
              this.getParticipantsByProgramID(this.programIds)
              this.getData()
            }
          
          },
          error: (err) => {
            new Error(err);
          }
        })
        
      }
      PrigramSummaryData:any
      dropdownProgramsList(event: any, type: any) {
        this.PrigramSummaryData = {}
        this.programIds = event.target.value;
        this.getParticipantsByProgramID(this.programIds);
        if (type == 'table' && event.target.value) {
          this.getData()
        }
      }
      getData() {
        this.PrigramSummaryData ={}
        this._commonService.getById(APIS.programSummary.getProramData, this.programIds).subscribe({
          next: (res: any) => {          
            // this.PrigramSummaryData = res?.data   
          console.log( this.PrigramSummaryData)
          this.PrigramSummaryData = res?.data
          this.PrigramSummaryData['scPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['sc'])
          this.PrigramSummaryData['stPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['st'])
          this.PrigramSummaryData['obcPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['obc'])
          this.PrigramSummaryData['ocPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['oc'])
          this.PrigramSummaryData['bcPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['bc'])
          this.PrigramSummaryData['minoritiesPercentage'] = this.CalculatePercentage(this.PrigramSummaryData, this.PrigramSummaryData['minorities'])
          this.PrigramSummaryData['malePercentage']=this.CalculateGenderPercentage(this.PrigramSummaryData,this.PrigramSummaryData['male'])
          this.PrigramSummaryData['femalePercentage']=this.CalculateGenderPercentage(this.PrigramSummaryData,this.PrigramSummaryData['female'])
          this.PrigramSummaryData['transeGenderPercentage']=this.CalculateGenderPercentage(this.PrigramSummaryData,this.PrigramSummaryData['transgender'])
          this.PrigramSummaryData['noOfSHGsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfSHGs'])
          this.PrigramSummaryData['noOfMSMEsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfMSMEs'])
          this.PrigramSummaryData['noOfStartupsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfStartups'])
          this.PrigramSummaryData['noOfAspirantsPercentage'] = this.CalculateOragnizationPercentage(this.PrigramSummaryData, this.PrigramSummaryData['noOfAspirants'])
          this.PrigramSummaryData['disabilityPercentage']= ((this.PrigramSummaryData['physicallyChallenge'] / this.PrigramSummaryData['participant']) * 100).toFixed(2);
            
          },
          error: (err) => {
            this.toastrService.error('Data Not Available', "Participant Data Error!");
            new Error(err);
          },
        });
        // console.log(this.ParticipantAttentance)
      }
      CalculatePercentage(Data: any,val:any) {
        let total = Data.sc + Data.st + Data.bc + Data.oc + Data.minorities;
        let percentage:any = ((val / total) * 100).toFixed(2);
        return isNaN(percentage) ? 0 : percentage

      }
      CalculateGenderPercentage(Data: any,val:any) {
        let total = Data.male + Data.female + Data.transgender;
        let percentage:any = ((val / total) * 100).toFixed(2);
        return isNaN(percentage) ? 0 : percentage

      }
      CalculateOragnizationPercentage(Data: any,val:any) {
        let total = Data.noOfSHGs + Data.noOfMSMEs + Data.noOfStartups+ Data.noOfAspirants;
        let percentage:any = ((val / total) * 100).toFixed(2);
        console.log(percentage,total,val)
        
        return isNaN(percentage) ? 0 : percentage

      }

      // Download PDF
      handleDownloadPDF() {
        const downloadButton = document.getElementById('pdf-download-button');
        const summaryEl = document.getElementById('program-summary-container');
        const imageEl = document.getElementById('spring-image');
        const detailsEl = document.getElementById('participant-details');
      
        if (!summaryEl || !imageEl || !detailsEl) return;
      
        // Hide button and prepare content
        if (downloadButton) downloadButton.style.display = 'none';
        this.showPagination = false;
        const originalPosts = [...this.paginatedPosts];
        this.paginatedPosts = [...this.posts];
        this.showAllRows = true;
      
        setTimeout(async () => {
          const pdf = new jsPDF('p', 'pt', 'a4');
          const marginX = 30;
          const marginY = 30;
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
      
          let currentY = marginY;
      
          // Render first section (program-summary-container)
          const summaryCanvas = await html2canvas(summaryEl, { scale: 2, useCORS: true });
          const summaryWidth = pageWidth - 2 * marginX;
          const summaryHeight = (summaryWidth / summaryCanvas.width) * summaryCanvas.height;
          const summaryData = summaryCanvas.toDataURL('image/png');
      
          if (summaryHeight + currentY > pageHeight - marginY) {
            pdf.addPage();
            currentY = marginY;
          }
          pdf.addImage(summaryData, 'PNG', marginX, currentY, summaryWidth, summaryHeight);
          currentY += summaryHeight + 20; // Add spacing
      
          // Render second section (spring-image) with 10% increased size
          const imageCanvas = await html2canvas(imageEl, { scale: 2, useCORS: true });
          let imageWidth = pageWidth - 2 * marginX;
          let imageHeight = (imageWidth / imageCanvas.width) * imageCanvas.height;
      
          // Increase image dimensions by 10%
          imageWidth *= 1.1;
          imageHeight *= 1.1;
      
          // Adjust X position to center the image
          let imageX = marginX - ((imageWidth - (pageWidth - 2 * marginX)) / 2);
          if (imageX < 0) imageX = 0;
      
          const imageData = imageCanvas.toDataURL('image/png');
      
          if (imageHeight + currentY > pageHeight - marginY) {
            pdf.addPage();
            currentY = marginY;
          }
      
          pdf.addImage(imageData, 'PNG', imageX, currentY, imageWidth, imageHeight);
      
          // Render third section (participant-details) on a new page
          pdf.addPage();
          const detailsCanvas = await html2canvas(detailsEl, { scale: 2, useCORS: true });
          const detailsWidth = pageWidth - 2 * marginX;
          const detailsHeight = (detailsWidth / detailsCanvas.width) * detailsCanvas.height;
          const detailsData = detailsCanvas.toDataURL('image/png');
      
          pdf.addImage(detailsData, 'PNG', marginX, marginY, detailsWidth, detailsHeight);
      
          pdf.save('program-summary.pdf');
      
          // Restore UI
          if (downloadButton) downloadButton.style.display = '';
          this.paginatedPosts = originalPosts;
          this.showPagination = true;
        }, 100);
      }
      
      
      
      posts: any[] = []; 
      paginatedPosts: any[] = [];
      currentPage: number = 1;
      pageSize: number = 5;
      totalPages: number = 0;
      showAllRows: boolean = false;
      showPagination: boolean = true;


      getParticipantsByProgramID(agencyid:number): void {
        this._commonService.ProgramsWithAgenciesData(APIS.programSummary.getParticipantsBYProgram,agencyid).subscribe((res)=>{
          this.posts = res.data;
          console.log(this.posts)
          this.totalPages = Math.ceil(this.posts.length / this.pageSize);
          this.updatePaginatedPosts();
        }, (error) => {
          console.error('Error fetching dummy data:', error);
        });
      }
      
      
      updatePaginatedPosts() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedPosts = this.posts.slice(start, end);
      }
      
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.updatePaginatedPosts();
        }
      }
      
      previousPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.updatePaginatedPosts();
        }
      }
}
