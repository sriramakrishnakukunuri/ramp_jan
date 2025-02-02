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
  constructor(private http: HttpClient) { 
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
  }

  ngOnInit(): void {
    this.fetchOrganizations();
    this.fetchLocations()
    this.getAgenciesList()
    
  }

  ngAfterViewInit() {
    
  }

  getLocationsByAgency(event: any) {
    let agencyId = event.target.value;
    this.locationsList = '';
    this.http.get<any[]>(APIS.programCreation.getLocation +'/'+agencyId).subscribe((data:any) => {
      this.locationsList = data.data;
      this.reinitializeDataTableLocations();
    });
  }

  getResourcesByAgency(event: any) {
    let agencyId = event.target.value;
    this.resources = '';
    this.http.get<any[]>(APIS.programCreation.getResource + '/'+agencyId).subscribe((data:any) => {
      this.resources = data.data;
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
    this.dataTableResources = new DataTable('#view-table-resources', {              
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
  dataTableResources:any
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
      this.fetchResources(this.agencyList[0].agencyId);
    }, (error) => {
      
    });
  }
}
