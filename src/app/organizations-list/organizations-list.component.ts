import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { APIS } from '../constants/constants';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import { event } from 'jquery';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css']
})
export class OrganizationsListComponent implements OnInit, OnDestroy {
  organizations: any = '';
  locationsList: any = '';
  resources: any = '';
  displayedColumns: string[] = ['action', 'organizationName'];
  agencyList: any = [];
  agencyListFiltered: any;
  loginsessionDetails: any;
  SelectedCategory: any = 'Location';
  dataTableResources: any;
  
  // Location edit/delete properties
  editLocationForm!: FormGroup;
  selectedLocation: any = null;
  updateLoading = false;
  deleteLoading = false;
  allDistricts: any = [];
  MandalList: any = [];

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private _commonService: CommonServiceService,
     private fb: FormBuilder,
  ) {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.initializeEditLocationForm();
    this.initializeEditOrganizationForm();
    this.initializeEditResourceForm();
    this.getAllDistricts();
  }

  agencyId: any = '';

  ngOnInit(): void {
    this.getAgenciesList();
    if (this.loginsessionDetails?.userRole == 'ADMIN') {
      this.getLocationsByAgency('All Agency');
      this.getResourcesByAgency('All Agency');
    } else {
      this.agencyId = this.loginsessionDetails.agencyId;
      this.getLocationsByAgency(this.loginsessionDetails.agencyId);
      this.getResourcesByAgency(this.loginsessionDetails.agencyId);
    }
    
    // Ensure Bootstrap is loaded
    if (typeof bootstrap === 'undefined') {
      console.warn('Bootstrap is not loaded. Modal functionality may not work.');
    }
  }

  // Initialize Edit Location Form
  initializeEditLocationForm() {
    this.editLocationForm = new FormGroup({
      locationId: new FormControl(""),
      locationName: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
      ownershipType: new FormControl(""),
      typeOfVenue: new FormControl("", [Validators.required]),
      latitude: new FormControl(""),
      longitude: new FormControl(""),
      googleMapUrl: new FormControl("", [Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)]),
      OthersType: new FormControl(""),
      capacity: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      agencyId: new FormControl(""),
      filePath: new FormControl(""),
      district: new FormControl(""),
      mandal: new FormControl(""),
    });
  }

  get fEditLocation() {
    return this.editLocationForm.controls;
  }

  // Get all districts
  getAllDistricts() {
    this.allDistricts = [];
    this._commonService.getDataByUrl(APIS.masterList.getDistricts).subscribe({
      next: (data: any) => {
        this.allDistricts = data.data;
      },
      error: (err: any) => {
        this.allDistricts = [];
      }
    });
  }

  // Get mandals by district
  GetMandalByDistrict(event: any) {
    this.MandalList = [];
    this._commonService.getDataByUrl(APIS.masterList.getMandalName + event).subscribe({
      next: (data: any) => {
        this.MandalList = data.data;
      },
      error: (err: any) => {
        this.MandalList = [];
      }
    });
  }

  // Edit location
  editLocation(location: any) {
    this.selectedLocation = location;
    
    // Populate the edit form with current location data
    this.editLocationForm.patchValue({
      locationId: location.locationId,
      locationName: location.locationName,
      ownershipType: location.ownershipType,
      typeOfVenue: location.typeOfVenue,
      latitude: location.latitude,
      longitude: location.longitude,
      googleMapUrl: location.googleMapUrl,
      capacity: location.capacity,
      agencyId: location.agencyId,
      district: location.district,
      mandal: location.mandal,
    });

    // Load mandals if district is selected
    if (location.district) {
      this.GetMandalByDistrict(location.district);
    }

    // Show edit modal
    this.showModal('editLocationModal');
  }

  // Update location
  onUpdateLocation() {
    if (this.editLocationForm.valid) {
      this.updateLoading = true;
      let payload: any = { ...this.editLocationForm.value };
      
      // Handle "Others" type of venue
      if (payload['typeOfVenue'] == 'Others') {
        payload['typeOfVenue'] = payload['OthersType'];
      }
      delete payload['OthersType'];

      const locationId = payload.locationId;
      delete payload.locationId; // Remove locationId from payload as it's in the URL

      this._commonService.updatedata(APIS.masterList.updateLocationStatus+`${locationId}`, payload).subscribe({
        next: (data) => {
          this.updateLoading = false;
          this.toastrService.success('Location Updated Successfully', "Success!");
          this.closeEditModal();
          this.refreshLocationsList();
        },
        error: (err) => {
          this.updateLoading = false;
          this.toastrService.error(err.message || 'Failed to update location', "Update Error!");
        },
      });
    }
  }

  // Delete location
  deleteLocation(location: any) {
    this.selectedLocation = location;
    this.showModal('deleteLocationModal');
  }

  // Confirm delete location
  confirmDeleteLocation() {
    if (this.selectedLocation && this.selectedLocation.locationId) {
      this.deleteLoading = true;
      const locationId = this.selectedLocation.locationId;

      this._commonService.deleteId(APIS.masterList.deleteLocation, locationId).subscribe({
        next: (data: any) => {
          this.deleteLoading = false;
          this.toastrService.success('Location Deleted Successfully', "Success!");
          this.closeDeleteModal();
          this.refreshLocationsList();
        },
        error: (err) => {
          this.deleteLoading = false;
          this.toastrService.error(err.message || 'Failed to delete location', "Delete Error!");
        },
      });
    }
  }

  // Close edit modal
  closeEditModal() {
    this.hideModal('editLocationModal');
    this.editLocationForm.reset();
    this.selectedLocation = null;
  }

  // Close delete modal
  closeDeleteModal() {
    this.hideModal('deleteLocationModal');
    this.selectedLocation = null;
  }

  // Refresh locations list
  refreshLocationsList() {
    if (this.loginsessionDetails?.userRole == 'ADMIN') {
      this.getLocationsByAgency('All Agency');
    } else {
      this.getLocationsByAgency(this.loginsessionDetails.agencyId);
    }
  }

  // Organization edit/delete properties
  editOrganizationForm!: FormGroup;
  selectedOrganization: any = null;
  
  // Initialize Edit Organization Form
  initializeEditOrganizationForm() {
    this.editOrganizationForm = this.fb.group({
      organizationName: ['', [Validators.required]]
    });
  }

  get fEditOrganization() {
    return this.editOrganizationForm.controls;
  }

  // Edit organization
  editOrganization(organization: any) {
    this.selectedOrganization = organization;
    this.editOrganizationForm.patchValue({
      organizationName: organization.organizationName
    });
    this.showModal('editOrganizationModal');
  }

  // Update organization
  onUpdateOrganization() {
    if (this.editOrganizationForm.valid) {
      this.updateLoading = true;
      const updateData = {
        organizationId: this.selectedOrganization.organizationId,
        organizationName: this.fEditOrganization['organizationName'].value
      };

      this.http.put(APIS.participantdata.saveOrgnization, updateData).subscribe({
        next: (response: any) => {
          this.updateLoading = false;
          this.toastrService.success('Organization updated successfully', 'Success');
          this.closeEditOrganizationModal();
          this.reinitializeDataTable();
        },
        error: (error) => {
          this.updateLoading = false;
          this.toastrService.error('Failed to update organization', 'Error');
          console.error('Update organization error:', error);
        }
      });
    }
  }

  // Delete organization
  deleteOrganization(organization: any) {
    this.selectedOrganization = organization;
    this.showModal('deleteOrganizationModal');
  }

  // Confirm delete organization
  confirmDeleteOrganization() {
    if (this.selectedOrganization && this.selectedOrganization.organizationId) {
      this.deleteLoading = true;
      this.http.delete(`${APIS.participantdata.saveOrgnization}/${this.selectedOrganization.organizationId}`).subscribe({
        next: (response: any) => {
          this.deleteLoading = false;
          this.toastrService.success('Organization deleted successfully', 'Success');
          this.closeDeleteOrganizationModal();
          this.reinitializeDataTable();
        },
        error: (error) => {
          this.deleteLoading = false;
          this.toastrService.error('Failed to delete organization', 'Error');
          console.error('Delete organization error:', error);
        }
      });
    }
  }

  // Close edit organization modal
  closeEditOrganizationModal() {
    this.hideModal('editOrganizationModal');
    this.editOrganizationForm.reset();
    this.selectedOrganization = null;
  }

  // Close delete organization modal
  closeDeleteOrganizationModal() {
    this.hideModal('deleteOrganizationModal');
    this.selectedOrganization = null;
  }



  // ...existing code for other methods...
  ngAfterViewInit() {
    
  }


  getLocationsByAgency(event: any) {
    console.log(event);
    this.agencyId = event;
    if (event == 'All Agency') {
      this.agencyId = -1;
      this.fetchLocations();
    } else {
      if (event) {
        this.agencyId = event;
      } else {
        event = this.agencyList[0]?.agencyId;
        this.agencyId = event;
      }
      
      // Clear locations array since we're using server-side pagination
      this.locationsList = [];
      
      // Reinitialize the DataTable with new agency filter
     
    }
     this.reinitializeDataTableLocations();
  }


  fetchOrganizations() {
    this.organizations = [];
    // Reinitialize the DataTable to fetch all organizations with server-side pagination
    this.reinitializeDataTable();
  }


  fetchLocations() {
    this.locationsList = [];
    // Reinitialize the DataTable to fetch all locations with server-side pagination
    this.reinitializeDataTableLocations();
  }
  initializeDataTable() {
    const self = this;

    // Destroy existing table if it exists
    if (this.dataTable) {
      this.dataTable.destroy();
      this.dataTable = null;
    }

    this.dataTable = new DataTable('#view-table-organization1', {
      scrollY: "415px",
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      serverSide: true,
      processing: true,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      autoWidth: false,
      info: true,
      searching: true,
      destroy: true,
      ajax: (data: any, callback: any, settings: any) => {
        // Extract pagination and sorting parameters
        const page = data.start / data.length;
        const size = data.length;
        const sortColumn = data.order[0]?.column;
        const sortDirection = data.order[0]?.dir;
        const sortField = data.columns[sortColumn]?.data;

        // Prepare parameters for API call
        let params = `?page=${page}&size=${size}`;

        if (sortField && sortDirection) {
          params += `&sort=${sortField},${sortDirection}`;
        }

        // Add search filter if any
        if (data.search.value) {
          params += `&search=${encodeURIComponent(data.search.value)}`;
        }

        // Use the organizations API endpoint
        const apiUrl = `${APIS.participantdata.getOrgnizationData}${params}`;

        this._commonService.getDataByUrl(apiUrl)
          .pipe()
          .subscribe({
            next: (res: any) => {
              // Handle different response structures
              let responseData = res.data || res.content || res;
              let totalElements = res.totalElements || res.totalSize || responseData.length;

              callback({
                draw: data.draw,
                recordsTotal: totalElements,
                recordsFiltered: totalElements,
                data: responseData
              });
            },
            error: (err) => {
              this.toastrService.error(err.message || 'Failed to fetch organizations', "Organization Data Error!");
              console.error(err);
              callback({
                draw: data.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
              });
            }
          });
      },
      columns: [
        {
          title: 'S.No',
          data: null,
          render: function (data: any, type: any, row: any, meta: any) {
            return meta.settings?._iDisplayStart + meta.row + 1;
          },
          className: 'text-start',
          orderable: false,
          width: '60px'
        },
        // {
        //   data: null,
        //   title: 'Actions',
        //   render: (data: any, type: any, row: any, meta: any) => {
        //     return `
        //       <button type="button" class="btn btn-default text-lime-green btn-sm edit-org-btn" data-index="${meta.row}">
        //         <span class="bi bi-pencil"></span>
        //       </button>
        //       <button type="button" class="btn btn-default text-danger btn-sm delete-org-btn" data-index="${meta.row}">
        //         <span class="bi bi-trash"></span>
        //       </button>
        //     `;
        //   },
        //   className: 'text-center',
        //   orderable: false,
        //   width: '120px'
        // },
        {
          data: 'organizationType',
          title: 'Type Of Organization',
          render: function (data: any) {
            return data || 'N/A';
          }
        },
        {
          data: 'organizationName',
          title: 'Organization Name',
          render: function (data: any) {
            return data || 'N/A';
          }
        },
        {
          data: 'ownerName',
          title: 'Name Of Director/Promotor/Leader',
          render: function (data: any) {
            return data || 'N/A';
          }
        },
        {
          data: 'contactNo',
          title: 'Contact',
          render: function (data: any) {
            return data || 'N/A';
          }
        },
        {
          data: 'email',
          title: 'Email',
          render: function (data: any) {
            return data || 'N/A';
          }
        },
        {
          data: null,
          title: 'Address',
          render: function (data: any, type: any, row: any) {
            // Compose address from available fields
            const addressParts = [
              row.houseNo,
              row.streetNo,
              row.town,
              row.gramaPanchayat,
              row.mandal,
              row.distId,
              row.stateId
            ].filter(Boolean);
            return addressParts.length ? addressParts.join(', ') : 'N/A';
          }
        }
      ],
      initComplete: function () {
        // Add event listeners for edit/delete buttons
        $('#view-table-organization1').on('click', '.edit-org-btn', function (this: HTMLElement) {
          const rowData = self.dataTable.row($(this).parents('tr')).data();
          self.editOrganization(rowData);
        });

        $('#view-table-organization1').on('click', '.delete-org-btn', function (this: HTMLElement) {
          const rowData = self.dataTable.row($(this).parents('tr')).data();
          self.deleteOrganization(rowData);
        });
      }
    });
  }

  initializeDataTableLocations() {
    console.log('initializeDataTableLocations agencyId:', this.agencyId);
    const self = this;

    // Destroy existing table if it exists
    if (this.dataTableLocations) {
      this.dataTableLocations.destroy();
      this.dataTableLocations = null;
    }

    this.dataTableLocations = new DataTable('#view-table-location1', {
      scrollY: "415px",
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      serverSide: true,
      processing: true,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      autoWidth: false,
      info: true,
      searching: false,
      destroy: true,
      ajax: (data: any, callback: any, settings: any) => {
        // This console should always print if DataTable is being initialized
        console.log('DataTable ajax called, agencyId:', this.agencyId);

        // Extract pagination and sorting parameters
        const page = data.start / data.length;
        const size = data.length;
        const sortColumn = data.order[0]?.column;
        const sortDirection = data.order[0]?.dir;
        const sortField = data.columns[sortColumn]?.data;

        // Prepare parameters for API call
        let params = `?page=${page}&size=${size}`;

        if (sortField && sortDirection) {
          params += `&sort=${sortField},${sortDirection}`;
        }

        // Add search filter if any
        if (data.search.value) {
          params += `&search=${encodeURIComponent(data.search.value)}`;
        }

        // Determine the API endpoint based on agency selection
        let apiUrl = '';
        if (this.agencyId === -1 || this.agencyId === 'All Agency') {
          // For all agencies
          apiUrl = `${APIS.masterList.locationList}${params}`;
        } else {
          // For specific agency
          apiUrl = `${APIS.programCreation.getLocation}${this.agencyId}${params}`;
        }
        console.log('Location API URL:', apiUrl);

        this._commonService.getDataByUrl(apiUrl)
          .pipe()
          .subscribe({
            next: (res: any) => {
              // Handle different response structures
              let responseData = res.data || res.content || res;
              let totalElements = res.totalElements || res.totalSize || responseData.length;

              callback({
                draw: data.draw,
                recordsTotal: totalElements,
                recordsFiltered: totalElements,
                data: responseData
              });
            },
            error: (err) => {
              this.toastrService.error(err.message || 'Failed to fetch locations', "Location Data Error!");
              console.error(err);
              callback({
                draw: data.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
              });
            }
          });
      },
      columns: [
        { 
          title: 'S.No',
          data: null,
          render: function(data: any, type: any, row: any, meta: any) {
            return meta.settings?._iDisplayStart + meta.row + 1;
          },
          className: 'text-start',
          orderable: false,
          width: '60px'
        },
        { 
          data: null,
          title: 'Actions',
          render: (data: any, type: any, row: any, meta: any) => {
            if (this.loginsessionDetails?.userRole == 'ADMIN' || 
                this.loginsessionDetails?.userRole == 'AGENCY_MANAGER') {
              if (this.agencyId === 'All Agency') {
                return '<span class="text-muted">N/A</span>';
              }
              return `   
                <button type="button" class="btn btn-default text-lime-green btn-sm edit-location-btn" data-index="${meta.row}">
                  <span class="bi bi-pencil"></span>
                </button>
                <button type="button" class="btn btn-default text-danger btn-sm delete-location-btn" data-index="${meta.row}">
                  <span class="bi bi-trash"></span>
                </button>
              `;
            } else {
              return '';
            }
          },
          className: 'text-center',
          orderable: false,
          width: '120px'
        },
        ...(this.loginsessionDetails?.userRole === 'ADMIN' ? [{
          data: 'agencyName',
          title: 'Agency',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        }] : []),
        { 
          data: 'organizationName',
          title: 'Organization Name',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        },
        { 
          data: 'locationName',
          title: 'Location Name',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        },
        { 
          data: 'district',
          title: 'District',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        },
        { 
          data: 'mandal',
          title: 'Mandal',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        },
        { 
          data: 'village',
          title: 'Village',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        },
        { 
          data: 'address',
          title: 'Address',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        },
        { 
          data: 'pinCode',
          title: 'Pin Code',
          render: function(data: any, type: any, row: any) {
            return data || 'N/A';
          }
        }
      ],
      initComplete: function() {
        // Add event listeners for edit/delete buttons
        $('#view-table-location1').on('click', '.edit-location-btn', function(this: HTMLElement) {
          const rowData = self.dataTableLocations.row($(this).parents('tr')).data();
          self.editLocation(rowData);
        });

        $('#view-table-location1').on('click', '.delete-location-btn', function(this: HTMLElement) {
          const rowData = self.dataTableLocations.row($(this).parents('tr')).data();
          self.deleteLocation(rowData);
        });
      }
    });
  }

  // initializeDataTableResources() {
  //   this.dataTableResources = new DataTable('#view-table-resourcePerson1', {
  //     scrollY: "415px",
  //     scrollX: true,
  //     scrollCollapse: true,
  //     autoWidth: true,
  //     paging: true,
  //     info: false,
  //     searching: false,
  //     destroy: true,
  //   });
  // }
// Update the initializeDataTableResources method with server-side pagination
initializeDataTableResources() {
  const self = this;
  
  // Destroy existing table if it exists
  if (this.dataTableResources) {
    this.dataTableResources.destroy();
    this.dataTableResources = null;
  }
  
  this.dataTableResources = new DataTable('#view-table-resourcePerson1', {
    scrollY: "415px",
    scrollX: true,
    scrollCollapse: true,
    paging: true,
    serverSide: true,
    processing: true,
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50],
    autoWidth: false,
    info: true,
    searching: true,
    destroy: true,
    ajax: (data: any, callback: any, settings: any) => {
      // Extract pagination and sorting parameters
      const page = data.start / data.length;
      const size = data.length;
      const sortColumn = data.order[0]?.column;
      const sortDirection = data.order[0]?.dir;
      const sortField = data.columns[sortColumn]?.data;
      
      // Prepare parameters for API call
      let params = `?page=${page}&size=${size}`;
      
      if (sortField && sortDirection) {
        params += `&sort=${sortField},${sortDirection}`;
      }
      
      // Add search filter if any
      if (data.search.value) {
        params += `&search=${encodeURIComponent(data.search.value)}`;
      }
      
      // Determine the API endpoint based on agency selection
      let apiUrl = '';
      if (this.agencyId === -1 || this.agencyId === 'All Agency') {
        // For all agencies - modify this URL according to your API
        apiUrl = `${APIS.masterList.getresources}${params}`;
      } else {
        // For specific agency
        apiUrl = `${APIS.programCreation.getResource}/${this.agencyId}${params}`;
      }
      
      this._commonService.getDataByUrl(apiUrl)
        .pipe()
        .subscribe({
          next: (res: any) => {
            // Handle different response structures
            let responseData = res.data || res.content || res;
            let totalElements = res.totalElements || res.totalSize || responseData.length;
            
            // Map organization name if needed
            if (Array.isArray(responseData)) {
              responseData = responseData.map((item: any) => ({
                ...item,
                organizationName: item.organizationName || '',
                agencyNames: item.agencyNames || item.agencyName || ''
              }));
            }
            
            callback({
              draw: data.draw,
              recordsTotal: totalElements,
              recordsFiltered: totalElements,
              data: responseData
            });
          },
          error: (err) => {
            this.toastrService.error(err.message || 'Failed to fetch resources', "Resource Data Error!");
            console.error(err);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: []
            });
          }
        });
    },
    columns: [
      { 
        title: 'S.No',
        data: null,
        render: function(data: any, type: any, row: any, meta: any) {
          return meta.settings?._iDisplayStart + meta.row + 1;
        },
        className: 'text-start',
        orderable: false
      },
      { 
        data: null,
        title: 'Actions',
        render: (data: any, type: any, row: any, meta: any) => {
          if (this.loginsessionDetails?.userRole == 'ADMIN' || 
              this.loginsessionDetails?.userRole == 'AGENCY_MANAGER') {
            if (this.agencyId === 'All Agency') {
              return '<span class="text-muted">N/A</span>';
            }
            return `   
              <button type="button" class="btn btn-default text-lime-green btn-sm edit-resource-btn" data-index="${meta.row}">
                <span class="bi bi-pencil"></span>
              </button>
              <button type="button" class="btn btn-default text-danger btn-sm delete-resource-btn" data-index="${meta.row}">
                <span class="bi bi-trash"></span>
              </button>
            `;
          } else {
            return '';
          }
        },
        className: 'text-center',
        orderable: false
      },
      ...(this.loginsessionDetails?.userRole === 'ADMIN' ? [{
        data: 'agencyNames',
        title: 'Agency',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      }] : []),
      { 
        data: 'organizationName',
        title: 'Organization Name',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'name',
        title: 'Resource Name',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'designation',
        title: 'Designation',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'specialization',
        title: 'Specialization',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'mobileNo',
        title: 'Mobile Number',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'email',
        title: 'Email',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'gender',
        title: 'Gender',
        render: function(data: any, type: any, row: any) {
          return data || 'N/A';
        }
      },
      { 
        data: 'isVIP',
        title: 'VIP Status',
        render: function(data: any, type: any, row: any) {
          return data ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>';
        }
      }
    ],
    initComplete: function() {
      // Add event listeners for edit/delete buttons
      $('#view-table-resourcePerson1').on('click', '.edit-resource-btn', function(this: HTMLElement) {
        const rowData = self.dataTableResources.row($(this).parents('tr')).data();
        self.editResource(rowData);
      });
      
      $('#view-table-resourcePerson1').on('click', '.delete-resource-btn', function(this: HTMLElement) {
        const rowData = self.dataTableResources.row($(this).parents('tr')).data();
        self.deleteResource(rowData);
      });
    }
  });
}

// Update the getResourcesByAgency method to only initialize the table
getResourcesByAgency(event?: any) {
  this.agencyId = event;
  
  if (event == 'All Agency') {
    this.agencyId = -1;
  } else {
    if (event) {
      this.agencyId = event;
    } else {
      event = this.agencyList[0]?.agencyId;
      this.agencyId = event;
    }
  }
  
  // Clear resources array since we're using server-side pagination
  this.resources = [];
  
  // Reinitialize the DataTable with new agency filter
  this.reinitializeDataTableResources();
}

// Update the fetchResources method
fetchResources() {
  this.agencyId = -1; // Set to -1 for all agencies
  this.resources = [];
  
  // Reinitialize the DataTable to fetch all resources
  this.reinitializeDataTableResources();
}

// Remove the populateResourcesDataTable method as it's no longer needed with server-side pagination

// Update the reinitializeDataTableResources method
reinitializeDataTableResources() {
  if (this.dataTableResources) {
    this.dataTableResources.destroy();
    this.dataTableResources = null;
  }
  
  setTimeout(() => {
    this.initializeDataTableResources();
  }, 100);
}

// Update refreshResourcesList method
refreshResourcesList() {
  if (this.loginsessionDetails?.userRole == 'ADMIN') {
    this.getResourcesByAgency('All Agency');
  } else {
    this.getResourcesByAgency(this.loginsessionDetails.agencyId);
  }
}

// Update getDataByCategory method to properly handle Resources category
getDataByCategory(val: any) {
  this.SelectedCategory = val;
  
  if (val == 'Location') {
    if (this.loginsessionDetails?.userRole == 'ADMIN') {
      this.getLocationsByAgency('All Agency');
    } else {
      this.getLocationsByAgency(this.loginsessionDetails.agencyId);
    }
  } else if (val == 'Resources') {
    // Initialize DataTable immediately when Resources category is selected
    if (this.loginsessionDetails?.userRole == 'ADMIN') {
      this.getResourcesByAgency('All Agency');
    } else {
      this.getResourcesByAgency(this.loginsessionDetails.agencyId);
    }
  } else {
    this.fetchOrganizations();
  }
}

// Add cleanup in ngOnDestroy
  ngOnDestroy() {
    if (this.dataTableResources) {
      this.dataTableResources.destroy();
    }
    if (this.dataTableLocations) {
      this.dataTableLocations.destroy();
    }
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  // Utility method to safely show Bootstrap modal
  private showModal(modalId: string): void {
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } else {
        console.error(`Modal element with ID '${modalId}' not found or Bootstrap not loaded`);
        this.toastrService.error('Modal could not be opened. Please try again.', 'Error');
      }
    } catch (error) {
      console.error('Error showing modal:', error);
      this.toastrService.error('Modal could not be opened. Please try again.', 'Error');
    }
  }

  // Utility method to safely hide Bootstrap modal
  private hideModal(modalId: string): void {
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement && typeof bootstrap !== 'undefined') {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {
      console.error('Error hiding modal:', error);
    }
  }  dataTable: any;
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


  getAgenciesList() {
    this.agencyList = [];
    this.http.get<any[]>(APIS.masterList.agencyList).subscribe((res: any) => {
      this.agencyList = res.data;
      this.agencyListFiltered = this.agencyList;
    }, (error) => {
      
    });
  }

  downloadProgram() {
    let linkUrl = APIS.programCreation.downloadResourceData + this.agencyId;
    const link = document.createElement("a");
    link.setAttribute("download", linkUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("href", APIS.programCreation.downloadResourceData + this.agencyId);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadProgramApi(type: string) {
    let url = '';
    let fileName = '';
    if (type == 'location') {
      url = APIS.masterList.locationDownload + this.agencyId;
      fileName = 'location.xls';
    } else if (type == 'resource') {
      url = APIS.masterList.resourceDownload + this.agencyId;
      fileName = 'resource.xls';
    } else if (type == 'org') {
      url = APIS.masterList.organizationDownload;
      fileName = 'organization.xls';
    }
    this._commonService.downloadFile(url).subscribe({
      next: (response: Blob) => {
        console.log(response);
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response);
        a.href = objectUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.toastrService.success('File downloaded successfully.');
      },
      error: (err) => {
        this.toastrService.error(err.error?.message || 'Failed to download file.');
      },
    });
  }

  // delete 
  deletePhysicalId: any = {};

  deleteExpenditure(item: any) {
    this.deletePhysicalId = item?.physicalTargetId;
    console.log(this.deletePhysicalId, 'deletePhysicalId');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    const myModal = new bootstrap.Modal(document.getElementById('exampleModalDeleteProgram'));
    myModal.show();
  }

  ConfirmdeleteTargets(item: any) {
    this._commonService.deleteId(APIS.physicalTagets.deleteTargets, item).subscribe({
      next: (data: any) => {
        if (data?.status == 400) {
          this.toastrService.error(data?.message, "Physical Target Error!");
          this.closeModalDelete();
          this.deletePhysicalId = '';
        } else {
          this.closeModalDelete();
          this.deletePhysicalId = '';
          this.toastrService.success('Physical Target Deleted Successfully', "Physical Target Success!");
        }
      },
      error: (err) => {
        this.closeModalDelete();
        this.deletePhysicalId = {};
        this.toastrService.error(err.message, "Physical Target Error!");
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
  }


  // resporce

  // Resource edit/delete properties
  editResourceForm!: FormGroup;
  selectedResource: any = null;
  updateResourceLoading = false;
  deleteResourceLoading = false;
  editResourceFlag = false;
  // Initialize Edit Resource Form
  initializeEditResourceForm() {
    this.editResourceForm = this.fb.group({
      resourceId: [''],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z .]+$/)]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^[6789]\d{9}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      organizationName: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9 .]+$/)]],
      qualification: ['', Validators.required],
      designation: ['', Validators.required],
      isVIP: [false],
      specialization: ['', Validators.required],
      briefDescription: ['', Validators.required],
      gender: ['', Validators.required],
      agencyIds: [[this.agencyId]],
    });
  }

  get fEditResource() {
    return this.editResourceForm.controls;
  }

  // Edit resource

  editResource(resource: any) {
    this.selectedResource = resource;
    this.editResourceFlag = true;
    
    // Populate the edit form with current resource data
    this.editResourceForm.patchValue({
      resourceId: resource.resourceId,
      name: resource.name,
      mobileNo: resource.mobileNo,
      email: resource.email,
      organizationName: resource.organizationName,
      qualification: resource.qualification,
      designation: resource.designation,
      isVIP: resource.isVIP || false,
      specialization: resource.specialization,
      briefDescription: resource.briefDescription,
      gender: resource.gender,
      agencyIds: [resource.agencyId]
    });

    // Show edit modal
    this.showModal('editResourceModal');
  }

  // Handle VIP status change for edit form
  changeResourceStatus(event: any) {
    if (event.target.checked) {
      this.editResourceForm.patchValue({ isVIP: true });
      this.editResourceForm.get('mobileNo')?.patchValue('');
      this.editResourceForm.get('mobileNo')?.setValidators(null);
      this.editResourceForm.get('mobileNo')?.updateValueAndValidity();
      this.editResourceForm.get('email')?.patchValue('');
      this.editResourceForm.get('email')?.setValidators(null);
      this.editResourceForm.get('email')?.updateValueAndValidity();
      this.editResourceForm.get('organizationName')?.patchValue('');
      this.editResourceForm.get('organizationName')?.setValidators(null);
      this.editResourceForm.get('organizationName')?.updateValueAndValidity();
      this.editResourceForm.get('qualification')?.patchValue('');
      this.editResourceForm.get('qualification')?.setValidators(null);
      this.editResourceForm.get('qualification')?.updateValueAndValidity();
      this.editResourceForm.get('designation')?.patchValue('');
      this.editResourceForm.get('designation')?.setValidators(null);
      this.editResourceForm.get('designation')?.updateValueAndValidity();
      this.editResourceForm.get('briefDescription')?.patchValue('');
      this.editResourceForm.get('briefDescription')?.setValidators(null);
      this.editResourceForm.get('briefDescription')?.updateValueAndValidity();
      this.editResourceForm.get('specialization')?.patchValue('');
      this.editResourceForm.get('specialization')?.setValidators(null);
      this.editResourceForm.get('specialization')?.updateValueAndValidity();
    } else {
      this.editResourceForm.patchValue({ isVIP: false });
      this.editResourceForm.get('mobileNo')?.patchValue('');
      this.editResourceForm.get('mobileNo')?.setValidators([Validators.required, Validators.pattern(/^[6789]\d{9}$/)]);
      this.editResourceForm.get('mobileNo')?.updateValueAndValidity();
      this.editResourceForm.get('email')?.patchValue('');
      this.editResourceForm.get('email')?.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]);
      this.editResourceForm.get('email')?.updateValueAndValidity();
      this.editResourceForm.get('organizationName')?.patchValue('');
      this.editResourceForm.get('organizationName')?.setValidators([Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9 .]+$/)]);
      this.editResourceForm.get('organizationName')?.updateValueAndValidity();
      this.editResourceForm.get('qualification')?.patchValue('');
      this.editResourceForm.get('qualification')?.setValidators([Validators.required]);
      this.editResourceForm.get('qualification')?.updateValueAndValidity();
      this.editResourceForm.get('designation')?.patchValue('');
      this.editResourceForm.get('designation')?.setValidators([Validators.required]);
      this.editResourceForm.get('designation')?.updateValueAndValidity();
      this.editResourceForm.get('briefDescription')?.patchValue('');
      this.editResourceForm.get('briefDescription')?.setValidators([Validators.required]);
      this.editResourceForm.get('briefDescription')?.updateValueAndValidity();
      this.editResourceForm.get('specialization')?.patchValue('');
      this.editResourceForm.get('specialization')?.setValidators([Validators.required]);
      this.editResourceForm.get('specialization')?.updateValueAndValidity();
    }
  }

  // Update resource
  onUpdateResource() {
    if (this.editResourceForm.valid) {
      this.updateResourceLoading = true;
      let payload: any = { ...this.editResourceForm.value,agencyIds: [Number(this.agencyId)] };
      
      const resourceId = payload.resourceId;
      delete payload.resourceId; // Remove resourceId from payload as it's in the URL

      this._commonService.updatedata(APIS.masterList.updateResourceStatus + `${resourceId}`, payload).subscribe({
        next: (data) => {
          this.updateResourceLoading = false;
          this.toastrService.success('Resource Updated Successfully', "Success!");
          this.closeEditResourceModal();
          this.refreshResourcesList();
        },
        error: (err) => {
          this.updateResourceLoading = false;
          this.toastrService.error(err.message || 'Failed to update resource', "Update Error!");
        },
      });
    }
  }

  // Delete resource
  deleteResource(resource: any) {
    this.selectedResource = resource;
    this.showModal('deleteResourceModal');
  }

  // Confirm delete resource
  confirmDeleteResource() {
    if (this.selectedResource && this.selectedResource.resourceId) {
      this.deleteResourceLoading = true;
      const resourceId = this.selectedResource.resourceId;

      this._commonService.deleteId(APIS.masterList.deleteResource, resourceId).subscribe({
        next: (data: any) => {
          this.deleteResourceLoading = false;
          this.toastrService.success('Resource Deleted Successfully', "Success!");
          this.closeDeleteResourceModal();
          this.refreshResourcesList();
        },
        error: (err) => {
          this.deleteResourceLoading = false;
          this.toastrService.error(err.message || 'Failed to delete resource', "Delete Error!");
        },
      });
    }
  }

  // Close edit resource modal
  closeEditResourceModal() {
    this.hideModal('editResourceModal');
    this.editResourceForm.reset();
    this.selectedResource = null;
    this.editResourceFlag = false;
  }

  // Close delete resource modal
  closeDeleteResourceModal() {
    this.hideModal('deleteResourceModal');
    this.selectedResource = null;
  }

 
}


