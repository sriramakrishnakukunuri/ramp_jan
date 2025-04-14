import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
@Component({
  selector: 'app-program-expenditure',
  templateUrl: './program-expenditure.component.html',
  styleUrls: ['./program-expenditure.component.css']
})
export class ProgramExpenditureComponent implements OnInit {

  agencyId: any
  constructor(
    private _commonService: CommonServiceService,
  ) {
    this.agencyId = JSON.parse(sessionStorage.getItem('user') || '{}').agencyId;
  }

  ngOnInit(): void {
    this.formDetails()
    this.getAllActivityList()
    this.getProgramTypeData();
    this.programCreationMain.controls['activityId'].valueChanges.subscribe((activityId: any) => {
      if (activityId) this.getSubActivitiesList(activityId);
    });
  }

  get f2() {
    return this.programCreationMain.controls;
  }

  activityList: any
  subActivitiesList: any
  programCreationMain!: FormGroup;
  getAllActivityList() {
    this.subActivitiesList = []
    this._commonService.getById(APIS.programCreation.getActivityListbyId, this.agencyId).subscribe({
      next: (data: any) => {
        this.activityList = data.data;
      },
      error: (err: any) => {
        this.activityList = [];
      }
    })
  }

  getSubActivitiesList(activityId: any) {
    this._commonService.getDataByUrl(`${APIS.programCreation.getSubActivityListByActivity + '/' + activityId}`).subscribe({
      next: (data: any) => {
        this.subActivitiesList = data.data.subActivities;
      },
      error: (err: any) => {
        this.subActivitiesList = [];
      }
    })
  }

  formDetails() {
    this.programCreationMain = new FormGroup({
      activityId: new FormControl("", [Validators.required]),
      subActivityId: new FormControl("", [Validators.required]),
      programType: new FormControl("", [Validators.required]),
    })
  }

  getProgramType: any = [];
  getProgramTypeData() {
    this._commonService
      .getById(APIS.programCreation.getProgramType, this.agencyId)
      .subscribe({
        next: (data: any) => {
          this.getProgramType = data.data;
        },
        error: (err: any) => {
          new Error(err);
        },
      });
  }
}
