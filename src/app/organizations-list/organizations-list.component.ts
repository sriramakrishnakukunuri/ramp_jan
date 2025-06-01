import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIS } from '../constants/constants';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { event } from 'jquery';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var bootstrap: any;
declare var $: any;


@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css']
})
export class OrganizationsListComponent implements OnInit {
  organizations: any = '';
  locationForm!: FormGroup;
  modalFormStype!: FormGroup;
  locationsList: any = '';
  resources:any = '';
  displayedColumns: string[] = ['action', 'organizationName'];
  agencyList: any = [];
  loginsessionDetails: any;
  SelectedCategory: any='Location';
  dataTableResources:any
  constructor(private http: HttpClient,private toastrService: ToastrService,
    private _commonService: CommonServiceService,private fb: FormBuilder,) { 
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');    
  }
  agencyId: any = '';
  sourceTypes: any = [];
  ngOnInit(): void {
    this.sourceTypes = []
    this.formDetailsLocation();
    this.forDeationsResource();
    this.getAllDistricts() 
    this.getAgenciesList()
    if(this.loginsessionDetails?.userRole == 'ADMIN'){
      this.getLocationsByAgency('All Agency');
      this.getResourcesByAgency('All Agency');

    }
    else{
      this.agencyId = this.loginsessionDetails.agencyId;
      this.getLocationsByAgency(this.loginsessionDetails.agencyId);
      this.getResourcesByAgency(this.loginsessionDetails.agencyId);
    }
    //this.fetchOrganizations();
    // this.fetchLocations()   
    
  }

  ngAfterViewInit() {
    
  }
  getDataByCategory(val:any){
    
    if(val == 'Location'){
      if(this.loginsessionDetails?.userRole == 'ADMIN'){
        this.getLocationsByAgency('All Agency');
  
      }
      else{
        this.getLocationsByAgency(this.loginsessionDetails.agencyId);
      }
      // this.fetchLocations()
    }
    else if(val == 'Resources'){
      if(this.loginsessionDetails?.userRole == 'ADMIN'){
        this.getResourcesByAgency('All Agency');
  
      }
      else{
        this.getResourcesByAgency(this.loginsessionDetails.agencyId);
      }
      // this.fetchResources()
    }else{
      this.fetchOrganizations()
    }
    this.SelectedCategory = val;
  }
  getLocationsByAgency(event: any) {
    let agencyId = event;
    if(event=='All Agency'){
      this.fetchLocations()
    }
    else{
      this.locationsList = '';
      this.http.get<any[]>(APIS.programCreation.getLocationByAgency +'/'+agencyId).subscribe((data:any) => {
        this.locationsList = data.data;
        this.reinitializeDataTableLocations();
      });
    }
   
  }

  getResourcesByAgency(event?: any) {
    if(event=='All Agency'){
      this.agencyId=-1
      this.fetchResources()
    }
    else{
      if(event){
        this.agencyId=event
        event = event
      }else {
        event = this.agencyList[0].agencyId;
        this.agencyId = event;
      }
      let agencyId = event;
      this.resources = '';
      this.http.get<any[]>(APIS.programCreation.getResource + '/'+agencyId).subscribe((data:any) => {
        this.resources = data.data;
        this.reinitializeDataTableResources();
      });
    }
   
  }

  // fetchResources(event: any) {  
  //   this.resources = '';
  //   this.http.get<any[]>(APIS.programCreation.getResource + '/'+event).subscribe((data:any) => {
  //     this.resources = data.data;
  //     this.reinitializeDataTableResources();
  //   });
  // }

  fetchOrganizations() {
    this.organizations = '';
    this.http.get<any[]>(APIS.participantdata.getOrgnizationData).subscribe((data:any) => {
      this.organizations = data.data;
      this.reinitializeDataTable();
    });
  }

  fetchResources() {
    this.locationsList = '';
    this.http.get<any[]>(APIS.masterList.getresources).subscribe((data:any) => {
      this.resources = data.data;
      this.reinitializeDataTableResources();
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
      paging:         true,  
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
      paging:         true,  
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
      paging:         true,  
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
  downloadProgram(){
    let linkUrl = APIS.programCreation.downloadResourceData+this.agencyId
    const link = document.createElement("a");
    link.setAttribute("download", linkUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("href", APIS.programCreation.downloadResourceData+this.agencyId);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  // delete 
   // delete Expenditure
   deletePhysicalId:any ={}
   deleteType:any =''
   deleteExpenditure(type:any,item: any) {
    this.deleteType=type
    this.deletePhysicalId = item;
    console.log(this.deletePhysicalId, 'deletePhysicalId');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    const myModal = new bootstrap.Modal(document.getElementById('exampleModalDeleteProgram'));
    myModal.show();
     
   
 }

 ConfirmdeleteTargets(item:any){
  console.log(item, 'item');
  let Url:any
    if(this.deleteType == 'Location'){
      Url= APIS.masterList.DeleteLocation;
    }
    else if(this.deleteType == 'Resource'){
      Url= APIS.masterList.deleteResource;
    
    }
    else if(this.deleteType == 'Organization'){
      Url= APIS.masterList.deleteOrganization;
    }
     this._commonService.deleteId(Url,item).subscribe({
       next: (data: any) => {
        console.log(data, 'delete data');
         if(data?.status==400){
           this.toastrService.error(data?.message, this.deleteType +" Error!");
           this.closeModalDelete();
           this.deletePhysicalId =''
         }
         else{
           this.closeModalDelete();
           this.deletePhysicalId =''
         this.toastrService.success( data?.message, this.deleteType +"Success!");
         }
         
       },
       error: (err) => {
         this.closeModalDelete();
         this.deletePhysicalId ={}
         this.toastrService.error(err.message, this.deleteType +" Error!");
         new Error(err);
       },
     });

   }
   
   closeModalDelete(): void {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    const editSessionModal = document.getElementById('exampleModalDeleteProgram');
  if (editSessionModal) {
    const modalInstance = bootstrap.Modal.getInstance(editSessionModal);
    modalInstance.hide();
  }
  if( this.SelectedCategory == 'Location'){
    this.getLocationsByAgency(this.agencyId);
  }
  else if(this.SelectedCategory == 'Resources'){
    this.getResourcesByAgency(this.agencyId);
  } 
  // this.GetProgramsByAgency(this.selectedAgencyId);
   } 




  //  location Update code starts
  allDistricts:any
  getAllDistricts(){
    this.allDistricts = []
    this._commonService.getDataByUrl(APIS.masterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    })
  }
  MandalList:any
  GetMandalByDistrict(event: any) {
    this.MandalList=[]
    this._commonService.getDataByUrl(APIS.masterList.getMandalName + event).subscribe({
      next: (data: any) => {
        this.MandalList = data.data;
      },
      error: (err: any) => {
        this.MandalList = [];
      }
    })

  }
  locationId:any=''
  EditLocation(item: any) {
    console.log(item, 'item');  
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    const myModal = new bootstrap.Modal(document.getElementById('updateLocationbyId'));
    myModal.show();
    this.locationId = item?.locationId;
    this.locationForm.reset();
    this.locationForm.patchValue({...item});
    this.GetMandalByDistrict(item?.district);  

   
     
   
 }
  get fLocation() {
    return this.locationForm.controls;
  }
  formDetailsLocation() {
    this.locationForm = new FormGroup({
      locationName: new FormControl("", [Validators.required,Validators.pattern(/^[A-Za-z ]+$/)]),
      ownershipType: new FormControl(""),
      typeOfVenue: new FormControl("", [Validators.required]),
      latitude: new FormControl(""),
      longitude: new FormControl("",),
      googleMapUrl: new FormControl("",[Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]),
      OthersType: new FormControl("",),
      capacity: new FormControl("",[Validators.required,Validators.pattern(/^[1-9]\d*$/)]),
      agencyId: new FormControl("",),
      filePath: new FormControl("",),
      district: new FormControl("",),
      mandal: new FormControl("",),
    });
  }
  onModalSubmitLocation() {
    let payload: any = { ...this.locationForm.value };
    payload['typeOfVenue'] == 'Others' ? payload['typeOfVenue'] = payload['OthersType'] : payload['typeOfVenue'];
    payload['agencyId'] = this.agencyId;
    delete payload['OthersType'];
    console.log(payload, 'payload');
    this._commonService
      .update(APIS.masterList.updateLocation, payload, this.locationId)
      .subscribe({
        next: (data) => {
          this.toastrService.success('Location Updated Successfully', "Success!");
          this.locationForm.reset();
          this.getLocationsByAgency(this.agencyId);
        },
        error: (err) => {
          this.toastrService.error(err.message, "Location Error!");
          new Error(err);
        },
      });
  }
  // edit location code ends

  // Resource edit starts
  ResourceId:any=''
  EditResource(item: any) {
    console.log(item, 'item');  
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    const myModal = new bootstrap.Modal(document.getElementById('updatedbbyResource'));
    myModal.show();
    this.ResourceId = item?.resourceId;
    this.modalFormStype.reset();
    this.modalFormStype.patchValue({...item});
    this.modalFormStype.patchValue({agencyIds:[this.agencyId]});
    this.changeStatus(item?.isVIP);
 }
  forDeationsResource(){
    this.modalFormStype = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z .]+$/)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[6789]\d{9}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      organizationName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9 .]+$/)]],
      qualification: ['', Validators.required],
      designation: ['', Validators.required],
      isVIP: ['', ],
      specialization: ['', Validators.required],
      briefDescription: ['', Validators.required],
      gender: ['', Validators.required],
      agencyIds: [[this.agencyId]],
    });
  }
  get fresouce(){
    return this.modalFormStype.controls;
  }
  changeStatus(event:any){
    if(event){
      this.modalFormStype.patchValue({isVIP:true})
      this.modalFormStype.get('mobileNo')?.patchValue('');
      this.modalFormStype.get('mobileNo')?.setValidators(null);
      this.modalFormStype.get('mobileNo')?.updateValueAndValidity();
      this.modalFormStype.get('email')?.patchValue('');
      this.modalFormStype.get('email')?.setValidators(null);
      this.modalFormStype.get('email')?.updateValueAndValidity();
      this.modalFormStype.get('organizationName')?.patchValue('');
      this.modalFormStype.get('organizationName')?.setValidators(null);
      this.modalFormStype.get('organizationName')?.updateValueAndValidity();
      this.modalFormStype.get('qualification')?.patchValue('');
      this.modalFormStype.get('qualification')?.setValidators(null);
      this.modalFormStype.get('qualification')?.updateValueAndValidity();
      this.modalFormStype.get('designation')?.patchValue('');
      this.modalFormStype.get('designation')?.setValidators(null);
      this.modalFormStype.get('designation')?.updateValueAndValidity();
      this.modalFormStype.get('briefDescription')?.patchValue('');
      this.modalFormStype.get('briefDescription')?.setValidators(null);
      this.modalFormStype.get('briefDescription')?.updateValueAndValidity();
      this.modalFormStype.get('specialization')?.patchValue('');
      this.modalFormStype.get('specialization')?.setValidators(null);
      this.modalFormStype.get('specialization')?.updateValueAndValidity();
      
    }else{
      this.modalFormStype.patchValue({isVIP:false})
      this.modalFormStype.get('mobileNo')?.patchValue('');
      this.modalFormStype.get('mobileNo')?.setValidators([Validators.required, Validators.pattern(/^[6789]\d{9}$/)]);
      this.modalFormStype.get('mobileNo')?.updateValueAndValidity();
      this.modalFormStype.get('email')?.patchValue('');
      this.modalFormStype.get('email')?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]);
      this.modalFormStype.get('email')?.updateValueAndValidity();
      this.modalFormStype.get('organizationName')?.patchValue('');
      this.modalFormStype.get('organizationName')?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9 .]+$/)]);
      this.modalFormStype.get('organizationName')?.updateValueAndValidity();
      this.modalFormStype.get('qualification')?.patchValue('');
      this.modalFormStype.get('qualification')?.setValidators([Validators.required]);
      this.modalFormStype.get('qualification')?.updateValueAndValidity();
      this.modalFormStype.get('designation')?.patchValue('');
      this.modalFormStype.get('designation')?.setValidators([Validators.required]);
      this.modalFormStype.get('designation')?.updateValueAndValidity();
      this.modalFormStype.get('briefDescription')?.patchValue('');
      this.modalFormStype.get('briefDescription')?.setValidators([Validators.required]);
      this.modalFormStype.get('briefDescription')?.updateValueAndValidity();
      this.modalFormStype.get('specialization')?.patchValue('');
      this.modalFormStype.get('specialization')?.setValidators([Validators.required]);
      this.modalFormStype.get('specialization')?.updateValueAndValidity();
    }
  }
  onModalSubmitType() {
    if (this.modalFormStype.valid) {
      const newSourceType = this.modalFormStype.value;
      this.sourceTypes.push(newSourceType);

      this._commonService
        .update(APIS.masterList.updateResource, this.modalFormStype.value,this.ResourceId)
        .subscribe({
          next: (data) => {
            this.toastrService.success('Resource Person updated Successfully', "");
            this.getResourcesByAgency(this.agencyId);
          },
          error: (err) => {
            this.toastrService.error(err.message, "Resource Person Error!");
            new Error(err);
          },
        });

      const addResourceModal = document.getElementById('updatedbbyResource');
      if (addResourceModal) {
        const modalInstance = bootstrap.Modal.getInstance(addResourceModal);
        modalInstance.hide();
      }
    }
  }
  // ends resouce update 
  // download location starts
  downloadLocation(){
    let linkUrl = APIS.masterList.downloadLocation+this.agencyId
    const link = document.createElement("a");
    link.setAttribute("download", linkUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("href", APIS.masterList.downloadLocation+this.agencyId);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
   //  downlad Resource starts
   downladResource(){
    let linkUrl = APIS.masterList.downladResource+this.agencyId
    const link = document.createElement("a");
    link.setAttribute("download", linkUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("href", APIS.masterList.downladResource+this.agencyId);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
   //  downlad Organization starts
   downladOrganization(){
    let linkUrl = APIS.masterList.downladOrganization
    const link = document.createElement("a");
    link.setAttribute("download", linkUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("href", APIS.masterList.downladOrganization);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}



