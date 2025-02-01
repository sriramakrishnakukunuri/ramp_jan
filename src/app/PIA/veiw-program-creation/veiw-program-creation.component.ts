import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
declare var $: any;

@Component({
  selector: 'app-veiw-program-creation',
  templateUrl: './veiw-program-creation.component.html',
  styleUrls: ['./veiw-program-creation.component.css']
})
export class VeiwProgramCreationComponent implements OnInit {

  localStorageData:any
  sessionDetailsList:any
  constructor() { }

  ngOnInit(): void {    
    this.getProgramDetails()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      new DataTable('#view-table', {              
      // scrollX: true,
      // scrollCollapse: true,    
      // responsive: true,    
      // paging: true,
      // searching: true,
      // ordering: true,
      scrollY: "415px",     
      scrollX:        true,
      scrollCollapse: true,
      autoWidth:         true,  
      paging:         false,  
      info: false,   
      searching: false,  
      destroy: true, // Ensure reinitialization doesn't cause issues
      });
    }, 500);
  }

  getProgramDetails(): any {
    const programDetails = localStorage.getItem('programDetails');
    console.log(programDetails)
    this.localStorageData = programDetails ? JSON.parse(programDetails) : [];
  }

  sessionDetails(dataList: any): any {    
    this.sessionDetailsList = dataList.programSessionList
  }
}
