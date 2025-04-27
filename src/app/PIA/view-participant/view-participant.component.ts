import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-view-participant',
  templateUrl: './view-participant.component.html',
  styleUrls: ['./view-participant.component.css']
})
export class ViewParticipantComponent implements OnInit {

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
      this.getProgramsByAgency()
    }
    agencyProgramList: any;
    getProgramsByAgency() {
      this._commonService.getDataByUrl(`${APIS.programCreation.getProgramsListByAgency+'/'+(this.loginsessionDetails.agencyId?this.loginsessionDetails.agencyId:this.agencyId)}`).subscribe({
        next: (res: any) => {
          this.agencyProgramList = res?.data
          this.programIds = this.agencyProgramList[0].programId
          this.getData()
        },
        error: (err) => {
          new Error(err);
        }
      })
    }
    dropdownProgramsList(event: any, type: any) {
      this.submitedData = ''
      this.programIds = event.target.value
      if (type == 'table' && event.target.value) {
        this.getData()
      }
    }
    submitedData:any
    getData() {
      this.submitedData = ''
      // sessionStorage.getItem('ParticipantData')
      // let resList = sessionStorage.getItem('ParticipantData') || ''
      // // let resList = sessionStorage.getItem('ParticipantData') || ''   
      // console.log(resList) 
      // if(resList){
      //   this.submitedData=JSON.parse(resList)
      // }
      this._commonService.getDataByUrl(APIS.participantdata.getDataByProgramId+this.programIds+`?page=0&size=200`).subscribe({
        next: (res: any) => {
          this.submitedData = res?.data
          this.submitedData.map((data:any)=>{
            data['organizationName'] = data['organizationName'] ?data['organizationName']:''
          })
          this.reinitializeDataTable();
          // this.advanceSearch(this.getSelDataRange);
          // modal.close()
  
        },
        error: (err) => {
          this.toastrService.error(err.message, "Participant Data Error!");
          new Error(err);
        },
      });
      // console.log(this.submitedData)
    }
    dataTable: any;
    reinitializeDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
      setTimeout(() => {
        this.initializeDataTable();
      }, 0);
    }
    initializeDataTable() {
      const self = this;
      
      this.dataTable = $('#view-table-participant1').DataTable({
        scrollY: "415px",
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        serverSide: true,
        processing: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        autoWidth: true,
        info: false,
        searching: false,
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
          
          this._commonService.getDataByUrl(`${APIS.participantdata.getDataByProgramId}${this.programIds}${params}`)
            .pipe()
            .subscribe({
              next: (res: any) => {
                callback({
                  draw: data.draw,
                  recordsTotal: res.totalElements,
                  recordsFiltered: res.totalElements,
                  data: res.data.map((item: any) => ({
                    ...item,
                    organizationName: item.organizationName || ''
                  }))
                 
                });
                console.log(data)
              },
              error: (err) => {
                this.toastrService.error(err.message, "Participant Data Error!");
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
                render: function(data, type, row, meta:any) {
                  console.log(data,meta,type, row)
                    return meta.settings?._iDisplayStart+meta.row  + 1;
                },
                className: 'text-start'
              },
              { 
                data: 'organizationName',
                title: 'IsAspirant',
                render: function(data, type, row) {
                  return data ? 'No' : 'Yes';
                }
              },
              { 
                data: 'organizationName',
                title: 'Organization Name',
                // render: function(data, type, row) {
                //   return row.organizationName;
                // }
              },
              { 
                data: 'participantName',
                title: 'Name of the Participant'
              },
              { 
                data: 'gender',
                title: 'Gender'
              },
              { 
                data: 'disability',
                title: 'Disability'
              },
              { 
                data: 'aadharNo',
                title: 'Aadhar No.'
              },
              { 
                data: 'category',
                title: 'Category'
              },
              { 
                data: 'mobileNo',
                title: 'Mobile No.'
              },
              { 
                data: 'email',
                title: 'Email'
              },
              { 
                data: 'designation',
                title: 'Designation/Current Trade'
              },
              { 
                data: 'isParticipatedBefore',
                title: 'Previous Participant'
              },
              
              { 
                data: 'preTrainingAssessmentConducted',
                title: 'Pre-Training Assessment',
                render: function(data) {
                  return data === 'Y' ? 'Yes' : 'No';
                }
              },
              { 
                data: 'postTrainingAssessmentConducted',
                title: 'Post Training Assessment',
                render: function(data) {
                  return data === 'Y' ? 'Yes' : 'No';
                }
              },
              { 
                data: 'isCertificateIssued',
                title: 'Certificate Issue Date',
                render: function(data) {
                  return data === 'Y' ? 'Yes' : 'No';
                }
              },
              { 
                data: 'certificateIssueDate',
                title: 'Issue Date',
                render: function(data, type, row) {
                  return row.isCertificateIssued === 'Y' ? data : '';
                }
              },
              { 
                data: 'needAssessmentMethodology',
                title: 'Methodology Used for Needs Assessment'
              },
              { 
                data: null,
                title: 'Edit / Delete',
                render: (data: any, type: any, row: any, meta: any) => {
                  // Use meta.row for the current displayed row index
                  return `
                    <button type="button" class="btn btn-default text-lime-green btn-sm edit-btn" data-index="${meta.row}">
                      <span class="bi bi-pencil"></span>
                    </button>
                    <button type="button" class="btn btn-default text-danger btn-sm delete-btn" data-index="${meta.row}">
                      <span class="bi bi-trash"></span>
                    </button>
                  `;
                },
                className: 'text-center',
                orderable: false
              }
              // { 
              //   title: 'Edit / Delete',
              //   render: function(data, type, row, meta) {
                  
              //     return `
              //       <button type="button" class="btn btn-default text-lime-green btn-sm" onclick="editRow(${row})">
              //         <span class="bi bi-pencil"></span>
              //       </button>
              //       <button type="button" class="btn btn-default text-danger btn-sm" onclick="deleteRow(${row})">
              //         <span class="bi bi-trash"></span>
              //       </button>
              //     `;
              //   },
              //   className: 'text-center',
              //   orderable: false
              // }
            ],
        initComplete: function() {
          // Add event listeners for edit/delete buttons
          $('#view-table-participant1').on('click', '.edit-btn', function() {
            const rowData = self.dataTable.row($(this).parents('tr')).data();
            self.editRow(rowData);
          });
          
          $('#view-table-participant1').on('click', '.delete-btn', function() {
            const rowData = self.dataTable.row($(this).parents('tr')).data();
            self.deleteRow(rowData);
          });
        }
      });
    }
    // initializeDataTable() {
    //   this.dataTable = new DataTable('#view-table-participant1', {
    //     // scrollX: true,
    //     // scrollCollapse: true,    
    //     // responsive: true,    
    //     // paging: true,
    //     // searching: true,
    //     // ordering: true,
    //     scrollY: "415px",
    //     scrollX: true,
    //     scrollCollapse: true,
    //     autoWidth: true,
    //     paging: false,
    //     info: false,
    //     searching: false,
    //     destroy: true, // Ensure reinitialization doesn't cause issues
    //   });
    // }
    // initializeDataTable(programIds:any) { 
    //   console.log(programIds)
    //   this.dataTable = new DataTable('#view-table-participant1', {
    //     scrollY: "415px",
    //     scrollX: true,
    //     scrollCollapse: true,
    //     paging: true,
    //     serverSide: true, // Enable server-side processing
    //     pageLength: 10, // Default page size
    //     lengthMenu: [5, 10, 25, 50], // Available page sizes
    //     autoWidth: true,
    //     info: false,
    //     searching: false,
    //     destroy: true,
    //     ajax: function (data:any, callback, settings) {
    //       // Extract pagination parameters
    //       let page = data.start / data.length;
    //       let size = data.length;
  
    //       // Fetch data from API
    //       fetch(APIS.participantdata.getDataByProgramId+programIds+`?page=${page}&size=${size}`)
    //           ?.then(res => res.json())
    //           .then(json => {
    //               callback({
    //                    draw: data.draw ? data.draw : [],
    //                   // draw: data.draw,
    //                   recordsTotal: json.totalElements,
    //                   recordsFiltered: json.totalElements,
    //                   data: json.data.map((data:any)=>{
    //                     data['organizationName'] = data['organizationName'] ?data['organizationName']:''
    //                   })
    //               });
    //           });
    //   },
    //   columns: [
    //     { 
    //       title: 'S.No',
    //       render: function(data, type, row, meta) {
    //         return meta.row + 1;
    //       },
    //       className: 'text-start'
    //     },
    //     { 
    //       data: 'organizationName',
    //       title: 'IsAspirant',
    //       render: function(data, type, row) {
    //         return data ? 'No' : 'Yes';
    //       }
    //     },
    //     { 
    //       data: 'organizationName',
    //       title: 'Organization Name',
    //       // render: function(data, type, row) {
    //       //   return row.organizationName;
    //       // }
    //     },
    //     { 
    //       data: 'participantName',
    //       title: 'Name of the Participant'
    //     },
    //     { 
    //       data: 'gender',
    //       title: 'Gender'
    //     },
    //     { 
    //       data: 'disability',
    //       title: 'Disability'
    //     },
    //     { 
    //       data: 'aadharNo',
    //       title: 'Aadhar No.'
    //     },
    //     { 
    //       data: 'category',
    //       title: 'Category'
    //     },
    //     { 
    //       data: 'mobileNo',
    //       title: 'Mobile No.'
    //     },
    //     { 
    //       data: 'email',
    //       title: 'Email'
    //     },
    //     { 
    //       data: 'designation',
    //       title: 'Designation/Current Trade'
    //     },
    //     { 
    //       data: 'isParticipatedBefore',
    //       title: 'Previous Participant'
    //     },
    //     { 
    //       data: 'preTrainingAssessmentConducted',
    //       title: 'Pre-Training Assessment'
    //     },
    //     { 
    //       data: 'postTrainingAssessmentConducted',
    //       title: 'Post Training Assessment'
    //     },
    //     { 
    //       data: 'isCertificateIssued',
    //       title: 'Certificate Issue Date',
    //       render: function(data) {
    //         return data === 'Y' ? 'Yes' : 'No';
    //       }
    //     },
    //     { 
    //       data: 'certificateIssueDate',
    //       title: 'Issue Date',
    //       render: function(data, type, row) {
    //         return row.isCertificateIssued === 'Y' ? data : '';
    //       }
    //     },
    //     { 
    //       data: 'needAssessmentMethodology',
    //       title: 'Methodology Used for Needs Assessment'
    //     },
    //     { 
    //       title: 'Edit / Delete',
    //       render: function(data, type, row, meta) {
    //         return `
    //           <button type="button" class="btn btn-default text-lime-green btn-sm" onclick="angularComponentReference.editRow(${meta.row})">
    //             <span class="bi bi-pencil"></span>
    //           </button>
    //           <button type="button" class="btn btn-default text-danger btn-sm" onclick="angularComponentReference.deleteRow(${meta.row})">
    //             <span class="bi bi-trash"></span>
    //           </button>
    //         `;
    //       },
    //       className: 'text-center',
    //       orderable: false
    //     }
    //   ],
    //   });
    // }
    
    deleteRow(item: any,) {
      //  this.submitedData.pop(i)
      // this.submitedData.splice(i, 1)
      console.log(this.submitedData)
      // this.submitedData.push(this.ParticipantDataForm.value)
      // sessionStorage.setItem('ParticipantData', this.submitedData)
      sessionStorage.setItem('ParticipantData', JSON.stringify(this.submitedData));
      this.getData()
    }

  editRow(item: any) {
      this.router.navigateByUrl('/add-participant-data-edit/' + item.participantId);
    }
  }


  