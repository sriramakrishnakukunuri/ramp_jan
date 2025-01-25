import { Component, OnInit } from '@angular/core';

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
  getProgramDetails(): any {
    const programDetails = localStorage.getItem('programDetails');
    console.log(programDetails)
    this.localStorageData = programDetails ? JSON.parse(programDetails) : [];
  }

  sessionDetails(dataList: any): any {    
    this.sessionDetailsList = dataList.programSessionList
  }
}
