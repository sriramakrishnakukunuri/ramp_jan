import { Component, Input,OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ActivatedRoute } from '@angular/router';
import { APIS } from '@app/constants/constants';
import { LoaderService } from '@app/common_components/loader-service.service';
@Component({
  selector: 'app-sa-preliminary',
  templateUrl: './sa-preliminary.component.html',
  styleUrls: ['./sa-preliminary.component.css']
})
export class SAPreliminaryComponent implements OnInit,OnChanges {
  loginsessionDetails:any
@Input() selectedEnterprise=""
  constructor(private _commonService:CommonServiceService,
    private loaderService:LoaderService
  ) { 
     this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');  
  }

  ngOnInit(): void {
    this.getData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData()
    
  }
registrationDetails:any;
  getData(){
    this.loaderService.show();
     this._commonService.getDataByUrl(APIS.sanctionedAmount.preliminary.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          this.registrationDetails = res.data;
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.registrationDetails = null;
        }
      });
  }

}
