import { Component,Output,EventEmitter, Input, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {  
    MatDatepicker
  } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;

export const MY_FORMATS1 = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-monthly-range',
    templateUrl: 'monthly-range.component.html',
    styleUrls: ['./monthly-range.component.css'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS1 },
    ],
})
export class MonthlyRangeComponent implements OnInit {
  ngOnInit(): void {
    if(this.paymentForMonth){
      this.date1.setValue(moment(this.paymentForMonth, 'MM-YYYY'));
    }
  } 
  @Input() paymentForMonth: any;
  
    date1 = new FormControl(moment());
    dateRange!: any;
    @Output() monthChangeValue = new EventEmitter();
    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date1.value!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date1.setValue(ctrlValue);
        datepicker.close();
        this.monthChangeValue.emit(this.date1)
    }
}
