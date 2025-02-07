import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIS } from '../constants/constants';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { event } from 'jquery';
declare var $: any;


@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css']
})
export class OrganizationsListComponent implements OnInit {
  organizations: any = '';
  locationsList: any = '';
  resources:any = '';
  displayedColumns: string[] = ['action', 'organizationName'];
  agencyList: any = [];
  loginsessionDetails: any;
  SelectedCategory: any='Location';
  dataTableResources:any
  constructor(private http: HttpClient) { 
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
  }

  ngOnInit(): void {
    //this.fetchOrganizations();
    this.fetchLocations()
    this.getAgenciesList()
    
  }

  ngAfterViewInit() {
    
  }
  getDataByCategory(val:any){
    
    if(val == 'Location'){
      this.fetchLocations()
    }
    else if(val == 'Resources'){
      this.getResourcesByAgency()
    }else{
      this.fetchOrganizations()
    }
    this.SelectedCategory = val;
  }
  getLocationsByAgency(event: any) {
    let agencyId = event.target.value;
    this.locationsList = '';
    this.http.get<any[]>(APIS.programCreation.getLocationByAgency +'/'+agencyId).subscribe((data:any) => {
      this.locationsList = data.data;
      this.reinitializeDataTableLocations();
    });
  }

  getResourcesByAgency(event?: any) {
    if(event){
      event = event
    }else {
      event = this.agencyList[0].agencyId;
    }
    let agencyId = event;
    this.resources = '';
    this.http.get<any[]>(APIS.programCreation.getResource + '/'+agencyId).subscribe((data:any) => {
      this.resources = data.data;
      this.reinitializeDataTableResources();
    });
  }

  fetchResources(event: any) {  
    this.resources = '';
    this.http.get<any[]>(APIS.programCreation.getResource + '/'+event).subscribe((data:any) => {
      this.resources = data.data;
      this.reinitializeDataTableResources();
    });
  }

  fetchOrganizations() {
    this.organizations = '';
    this.http.get<any[]>(APIS.participantdata.getOrgnizationData).subscribe((data:any) => {
      this.organizations = data.data;
      this.reinitializeDataTable();
    });
  }

  fetchLocations() {
    this.locationsList = '';
    this.http.get<any[]>(APIS.masterList.locationList).subscribe((data:any) => {
      this.locationsList = data.data;
      this.reinitializeDataTableLocations();
    });
  }

  initializeDataTable() {
    this.dataTable = new DataTable('#view-table-organization', {              
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
  }

  initializeDataTableLocations() {
    this.dataTableLocations = new DataTable('#view-table-locations', {              
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
  }

  initializeDataTableResources() {
    this.dataTableResources = new DataTable('#view-table-resourcePerson1', {              
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
  }

  dataTable: any;
  dataTableLocations: any;
  reinitializeDataTable() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    setTimeout(() => {
      this.initializeDataTable();
    }, 0);
  }

  reinitializeDataTableLocations() {
    if (this.dataTableLocations) {
      this.dataTableLocations.destroy();
    }
    setTimeout(() => {
      this.initializeDataTableLocations();
    }, 0);
  }
  
  reinitializeDataTableResources() {
    if (this.dataTableResources) {
      this.dataTableResources.destroy();
    }
    setTimeout(() => {
      this.initializeDataTableResources();
    }, 0);
  }

  getAgenciesList() {
    this.agencyList = [];
    this.http.get<any[]>(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      //this.getResourcesByAgency(this.agencyList[0].agencyId);
    }, (error) => {
      
    });
  }
}
