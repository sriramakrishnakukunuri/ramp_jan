import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { ToastrService } from 'ngx-toastr';
import DataTable from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';

@Component({
  selector: 'app-raw-materials-participants',
  templateUrl: './raw-materials-participants.component.html',
  styleUrls: ['./raw-materials-participants.component.css']
})
export class RawMaterialsParticipantsComponent implements OnInit,AfterViewInit {
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
  
      ngAfterViewInit(): void {
        
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
        this.ParticipantRawMaterialsData = ''
        this.programIds = event.target.value
        if (type == 'table' && event.target.value) {
          this.getData()
        }
      }
      ParticipantRawMaterialsData:any
      getData() {
        this.ParticipantRawMaterialsData = ''
       
        this._commonService.getById(APIS.rawMaterial.getDeatails, this.programIds).subscribe({
          next: (res: any) => {          
            this.ParticipantRawMaterialsData = res?.data   
            this.ParticipantRawMaterialsData.participantRawMaterialList=this.getparticipantRawMaterialList(res?.data?.participantRawMaterialList)
            //this.reinitializeDataTable();    
               
            // this.advanceSearch(this.getSelDataRange);
            // modal.close()
    
          },
          error: (err) => {
            this.toastrService.error(err.message, "Participant Data Error!");
            new Error(err);
          },
        });
        // console.log(this.ParticipantAttentance)
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
        this.dataTable = new DataTable('#attendance-table', {        
          scrollY: "415px",
          scrollX: true,
          scrollCollapse: true,
          autoWidth: true,
          paging: false,
          info: false,
          searching: false,
          destroy: true, // Ensure reinitialization doesn't cause issues        
        });
        if (this.dataTable) {
          setTimeout(() => {
              this.dataTable.columns.adjust();
          }, 0);
        }
      }
  
      // Add this method to your component
      getAttendanceHeaders() {
        if (this.ParticipantRawMaterialsData?.participantRawMaterialList?.length) {
            return this.ParticipantRawMaterialsData.participantRawMaterialList[0]?.rawMaterialData || [];
        }
        return [];
      }
      getparticipantRawMaterialList(data1:any){
        let participantRawMaterialList:any=[]
        
        data1?.forEach((data:any,index:any)=>{
          let rawMaterialData1:any=[]
          data?.rawMaterialData?.forEach((item:any,index:any)=>{
            let rawMaterialData:any={}
            rawMaterialData[index]=item
            rawMaterialData1.push(rawMaterialData)
          })
          data['rawMaterialData1']=rawMaterialData1
        })
       
        console.log(data1,'srk')
        return data1
  
      }
      editAllTable: boolean=false;
      editAll(type?: string, item?: any) {
        console.log(type,item)
        this.editAllTable=true
        
      }
      closeAll(){
        this.editAllTable=false
        this.getData() 
      }
      valuesfromObject(data:any) {
       let values= data.map((obj:any) => {
          const key = Object.keys(obj)[0]; // Get the first (and only) key
          return obj[key];
        
      })
      return values
    }
      saveAll(data:any){
        console.log(data)
        let payload:any={}
        let participantRawMaterialList:any=[]
        data.forEach((item:any)=>{
          console.log(Object.values(item?.rawMaterialData1),'ibject')
         
          item.rawMaterialData=this.valuesfromObject(item?.rawMaterialData1)
          participantRawMaterialList.push({"participantId": item?.participantId,"rawMaterialData": item?.rawMaterialData})
          // item.rawMaterialData=Object.values(item?.rawMaterialData1)?.length
        })
         payload={
        "programId": this.programIds,
        "participantRawMaterialList":participantRawMaterialList
        }
        this._commonService.add(APIS.rawMaterial.saveAttendance,payload).subscribe({
          next: (data: any) => {
            if(data.message){
              this.toastrService.success('Participant Raw Materials Details  Updated Successfully', 'Success');
              this.editAllTable=false
              this.getData() 
            }
           
          },
          error: (err) => {
            console.error('Error loading agencies:', err);
          }
        });
      }
      chnages(data:any,val:any,index:any,vali:any){
        console.log(data,val,index,'srk',vali)
      }
  }
  
