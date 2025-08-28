import { Component,Output,EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class MonthlyRangeComponent implements OnInit, OnChanges {
    date1 = new FormControl(moment());
    dateRange!: any;
    @Output() monthChangeValue = new EventEmitter<any>();
    @Input() paymentForMonth: any;

    ngOnInit(): void {
      console.log(this.paymentForMonth)
        this.initializeValue();
        this.setupValueChangeSubscription();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['paymentForMonth'] && !changes['paymentForMonth'].firstChange) {
            this.initializeValue();
        }
    }

    private initializeValue(): void {
        if (this.paymentForMonth) {
            this.date1.setValue(moment(this.paymentForMonth, 'MM-YYYY'));
        }
    }

    private setupValueChangeSubscription(): void {
        // Subscribe to value changes to emit data whenever FormControl value changes
        this.date1.valueChanges.subscribe(value => {
            if (value) {
                const formattedDate = value.format('MM-YYYY');
                this.monthChangeValue.emit({
                    formControl: this.date1,
                    value: value,
                    formattedValue: formattedDate,
                    month: value.month() + 1, // month() returns 0-based index
                    year: value.year()
                });
            }
        });
    }
    

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date1.value!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.date1.setValue(ctrlValue);
        datepicker.close();
        // The valueChanges subscription will automatically emit the new value
    }

    onYearSelected(normalizedYear: Moment) {
        const ctrlValue = this.date1.value!;
        ctrlValue.year(normalizedYear.year());
        this.date1.setValue(ctrlValue);
    }

    // Method to get current FormControl value
    getCurrentValue() {
        return this.date1.value;
    }

    // Method to get formatted value
    getFormattedValue() {
        return this.date1.value ? this.date1.value.format('MM-YYYY') : null;
    }

    // Method to set value programmatically
    setValue(date: any) {
        if (typeof date === 'string') {
            this.date1.setValue(moment(date, 'MM-YYYY'));
        } else {
            this.date1.setValue(moment(date));
        }
    }
}
