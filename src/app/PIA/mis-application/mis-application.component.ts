import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

const MIS_MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: { month: 'long', year: 'numeric' }
  },
  display: {
    dateInput: { month: 'long', year: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: { month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' }
  }
};

interface MisMprRow {
  sno: number;
  agencyId: number;
  agencyName: string;
  component: string;
  programsScheduledAsOnDate: number;
  noOfProgramsAsPerMpr: number;
  releasedAmount: number;
  totalExpAsPerMpr: number;
}

@Component({
  selector: 'app-mis-application',
  templateUrl: './mis-application.component.html',
  styleUrls: ['./mis-application.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MIS_MONTH_YEAR_FORMATS }]
})
export class MisApplicationComponent implements OnInit {
  filterForm!: FormGroup;
  rows: MisMprRow[] = [];

  isLoading = false;
  isEditAll = false;
  hasUnsavedChanges = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonServiceService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadMprData();
  }

  initializeForm(): void {
    const currentDate = new Date();
    this.filterForm = this.fb.group({
      date: [currentDate, [Validators.required]]
    });
  }

  chosenYearHandler(normalizedYear: Date): void {
    const controlValue = this.filterForm.get('date')?.value || new Date();
    const updatedDate = new Date(controlValue);
    updatedDate.setFullYear(normalizedYear.getFullYear());
    this.filterForm.get('date')?.setValue(updatedDate);
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>): void {
    const controlValue = this.filterForm.get('date')?.value || new Date();
    const updatedDate = new Date(controlValue);
    updatedDate.setMonth(normalizedMonth.getMonth());
    this.filterForm.get('date')?.setValue(updatedDate);
    datepicker.close();
    this.loadMprData();
  }

  get selectedMonthYearHeading(): string {
    const selectedDate: Date | null = this.filterForm?.get('date')?.value || null;
    if (!selectedDate) {
      return 'MIS application updation status Upto';
    }
    const month = selectedDate.toLocaleString('en-US', { month: 'long' });
    const year = selectedDate.getFullYear();
    return `MIS application updation status -- ${month}, ${year}`;
  }

  loadMprData(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const selectedDate: Date = this.filterForm.get('date')?.value;
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();

    this.isLoading = true;
    this.commonService
      .getDataByUrl(`${APIS.monthlyMpr.filter}?year=${selectedYear}&month=${selectedMonth}`)
      .subscribe({
        next: (response: any) => {
          const apiRows = Array.isArray(response) ? response : response?.data || [];
          this.rows = apiRows.map((item: any, index: number) => this.mapApiRow(item, index));
          this.isEditAll = false;
          this.hasUnsavedChanges = false;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.rows = [];
          this.isEditAll = false;
          this.hasUnsavedChanges = false;
          this.isLoading = false;
          this.toastrService.error(error?.error?.message || 'Unable to fetch MIS data');
        }
      });
  }

  mapApiRow(item: any, index: number): MisMprRow {
    return {
      sno: index + 1,
      agencyId: item?.agencyId || item?.agency?.agencyId || item?.id || 0,
      agencyName: item?.agencyName || item?.nameOfIa || item?.iaName || item?.agency?.agencyName || '-',
      component: item?.component || item?.componentName || '-',
      programsScheduledAsOnDate: this.toNumber(item?.programsScheduledAsOnDate ?? item?.programScheduledAsOnDate ?? item?.programsScheduled),
      noOfProgramsAsPerMpr: this.toNumber(item?.noOfProgramsAsPerMpr ?? item?.noOfProgramsConductedAsPerMpr),
      releasedAmount: this.toNumber(item?.releasedAmount),
      totalExpAsPerMpr: this.toNumber(item?.totalExpAsPerMpr ?? item?.totalExpenditureAsPerMpr)
    };
  }

  toNumber(value: any): number {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  enableEditAll(): void {
    if (!this.rows.length) {
      this.toastrService.warning('No rows available for edit');
      return;
    }
    this.isEditAll = true;
  }

  onCellChange(row: MisMprRow, key: 'noOfProgramsAsPerMpr' | 'releasedAmount' | 'totalExpAsPerMpr', value: string): void {
    row[key] = this.toNumber(value);
    this.hasUnsavedChanges = true;
  }

  saveAll(): void {
    if (!this.rows.length) {
      this.toastrService.warning('No rows available to save');
      return;
    }

    const selectedDate: Date = this.filterForm.get('date')?.value;
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();

    const payload = this.rows.map((row) => ({
      agencyId: row.agencyId,
      year: selectedYear,
      month: selectedMonth,
      noOfProgramsAsPerMpr: this.toNumber(row.noOfProgramsAsPerMpr),
      releasedAmount: this.toNumber(row.releasedAmount),
      totalExpAsPerMpr: this.toNumber(row.totalExpAsPerMpr)
    }));

    this.isLoading = true;
    this.commonService.add(APIS.monthlyMpr.bulkSave, payload).subscribe({
      next: () => {
        this.toastrService.success('MIS details saved successfully');
        this.isEditAll = false;
        this.hasUnsavedChanges = false;
        this.isLoading = false;
        this.loadMprData();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.toastrService.error(error?.error?.message || 'Unable to save MIS details');
      }
    });
  }

  get totalProgramsScheduledAsOnDate(): number {
    return this.rows.reduce((sum, row) => sum + this.toNumber(row.programsScheduledAsOnDate), 0);
  }

  get totalNoOfProgramsAsPerMpr(): number {
    return this.rows.reduce((sum, row) => sum + this.toNumber(row.noOfProgramsAsPerMpr), 0);
  }

  get totalReleasedAmount(): number {
    return this.rows.reduce((sum, row) => sum + this.toNumber(row.releasedAmount), 0);
  }

  get totalExpAsPerMpr(): number {
    return this.rows.reduce((sum, row) => sum + this.toNumber(row.totalExpAsPerMpr), 0);
  }
}
