import { Component, Input,OnInit,OnChanges, SimpleChanges } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ActivatedRoute } from '@angular/router';
import { APIS } from '@app/constants/constants';

@Component({
  selector: 'app-sa-preliminary',
  templateUrl: './sa-preliminary.component.html',
  styleUrls: ['./sa-preliminary.component.css']
})
export class SAPreliminaryComponent implements OnInit,OnChanges {
@Input() selectedEnterprise=""
  constructor(private _commonService:CommonServiceService) { }

  ngOnInit(): void {
    this.getData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData()
    
  }
registrationDetails:any;
  getData(){
     this._commonService.getDataByUrl(APIS.sanctionedAmount.preliminary.getData + this.selectedEnterprise).subscribe({
        next: (res: any) => {
          this.registrationDetails = res.data;
        },
        error: (err: any) => {
          this.registrationDetails = null;
        }
      });
  }

}
