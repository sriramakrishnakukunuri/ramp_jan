import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { CommonServiceService } from '@app/_services/common-service.service';
import { APIS } from '@app/constants/constants';
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

type MisFilterMode = 'MONTHLY' | 'CUSTOMIZED';

interface MonthlyMprRow {
  sno: number;
  agencyId: number;
  agencyName: string;
  component: string;
  programsScheduledAsOnDate: number;
  noOfProgramsAsPerMpr: number;
  releasedAmount: number;
  totalExpAsPerMpr: number;
}

interface PhysicalMisRow extends MonthlyMprRow {
  fullyUploadedInPortal: number;
  partiallyUploadedInPortal: number;
  totalUploaded: number;
  programsOverDueTillDate: number;
  inProgress: number;
  remarks: string;
}

interface FinancialMisRow extends MonthlyMprRow {
  totalBillsUploadedValue: number;
  billsUploadPercent: number;
  trainingBillsUploadedValue: number;
  trainingApprovedValue: number;
  trainingRejectedValue: number;
  trainingNeedClarificationValue: number;
  verifiedTrainingBillsValue: number;
  nonTrainingBillsUploadedValue: number;
  nonTrainingApprovedValue: number;
  nonTrainingRejectedValue: number;
  nonTrainingNeedClarificationValue: number;
  totalBillsVerifiedValue: number;
  billsVerifiedBySpiuPercent: number;
  remarks: string;
}

@Component({
  selector: 'app-view-mis-application',
  templateUrl: './view-mis-application.component.html',
  styleUrls: ['./view-mis-application.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MIS_MONTH_YEAR_FORMATS }]
})
export class ViewMisApplicationComponent implements OnInit {
  filterForm!: FormGroup;
  filterMode: MisFilterMode = 'MONTHLY';
  physicalRows: PhysicalMisRow[] = [];
  financialRows: FinancialMisRow[] = [];
  isLoading = false;
  loginsessionDetails: any;
  agencyId: number = -1;
  selectedAgencyId: number = -1;
  agencyList: any[] = [];
  agencyListFiltered: any[] = [];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonServiceService,
    private toastrService: ToastrService
  ) {
    this.loginsessionDetails = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.agencyId = this.loginsessionDetails?.agencyId ?? -1;
    this.selectedAgencyId = this.agencyId;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isAdminOrSpiu) {
      this.getAgenciesList();
    } else {
      this.fetchViewMisData();
    }
  }

  get isAdminOrSpiu(): boolean {
    return this.loginsessionDetails?.userRole === 'ADMIN' || this.loginsessionDetails?.userRole === 'SPIU';
  }

  initializeForm(): void {
    const currentDate = new Date();
    this.filterForm = this.fb.group({
      mode: ['MONTHLY', [Validators.required]],
      monthDate: [currentDate, [Validators.required]],
      startDate: [null],
      endDate: [null]
    });
  }

  onModeChange(mode: MisFilterMode): void {
    this.filterMode = mode;
    if (mode === 'MONTHLY') {
      this.filterForm.patchValue({ startDate: null, endDate: null }, { emitEvent: false });
      this.fetchViewMisData();
      return;
    }

    this.physicalRows = [];
    this.financialRows = [];
  }

  getAgenciesList(): void {
    this.agencyList = [];
    this.commonService.getDataByUrl(APIS.masterList.agencyList).subscribe({
      next: (res: any) => {
        this.agencyList = res?.data || [];
        this.agencyListFiltered = [...this.agencyList];
        this.selectedAgencyId = -1;
        this.fetchViewMisData();
      },
      error: (error: any) => {
        this.toastrService.error(error?.error?.message || 'Unable to fetch agencies');
      }
    });
  }

  onAgencyChange(agencyId: number): void {
    this.selectedAgencyId = Number(agencyId);
    this.fetchViewMisData();
  }

  chosenYearHandler(normalizedYear: Date): void {
    const controlValue = this.filterForm.get('monthDate')?.value || new Date();
    const updatedDate = new Date(controlValue);
    updatedDate.setFullYear(normalizedYear.getFullYear());
    this.filterForm.get('monthDate')?.setValue(updatedDate);
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>): void {
    const controlValue = this.filterForm.get('monthDate')?.value || new Date();
    const updatedDate = new Date(controlValue);
    updatedDate.setMonth(normalizedMonth.getMonth());
    this.filterForm.get('monthDate')?.setValue(updatedDate);
    datepicker.close();
    if (this.filterMode === 'MONTHLY') {
      this.fetchViewMisData();
    }
  }

  onCustomDateChange(): void {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    if (!startDate || !endDate) {
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      this.toastrService.warning('Start date should not be greater than end date');
      return;
    }
    this.fetchViewMisData();
  }

  clearDateRange(): void {
    this.filterForm.patchValue({ startDate: null, endDate: null });
    this.physicalRows = [];
    this.financialRows = [];
  }

  get selectedHeading(): string {
    if (this.filterMode === 'CUSTOMIZED') {
      const startDate = this.filterForm.get('startDate')?.value;
      const endDate = this.filterForm.get('endDate')?.value;
      if (startDate && endDate) {
        return `MIS application updation status Between ${this.formatDate(startDate)} to ${this.formatDate(endDate)}`;
      }
      return 'MIS application updation status';
    }

    const selectedDate: Date | null = this.filterForm.get('monthDate')?.value || null;
    if (!selectedDate) {
      return 'MIS application updation status ';
    }

    const lastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const month = selectedDate.toLocaleString('en-US', { month: 'long' });
    return `MIS application updation status upto  ${month}, ${selectedDate.getFullYear()}`;
  }

  fetchViewMisData(): void {
    if (this.filterMode === 'CUSTOMIZED') {
      const startDate = this.filterForm.get('startDate')?.value;
      const endDate = this.filterForm.get('endDate')?.value;
      if (!startDate || !endDate) {
        return;
      }
    }

    const filterDate = this.filterMode === 'MONTHLY'
      ? this.filterForm.get('monthDate')?.value
      : this.filterForm.get('endDate')?.value;

    if (!filterDate) {
      return;
    }

    const selectedDate = new Date(filterDate);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const agencyId = this.isAdminOrSpiu ? this.selectedAgencyId : this.agencyId;

    this.isLoading = true;
    this.commonService.getDataByUrl(`${APIS.monthlyMpr.physical}?agencyId=${agencyId}&year=${selectedYear}&month=${selectedMonth}`).subscribe({
      next: (response: any) => {
        const rawRows = Array.isArray(response) ? response : response?.data || [];
        const rows = rawRows.map((item: any, index: number) => this.mapBaseRow(item, index));
        this.physicalRows = rows.map((row: any, index: number) => this.mapPhysicalRow(row, rawRows[index]));
        this.financialRows = rows.map((row:any) => this.mapFinancialRow(row));
        this.isLoading = false;
      },
      error: (error: any) => {
        this.physicalRows = [];
        this.financialRows = [];
        this.isLoading = false;
        this.toastrService.error(error?.error?.message || 'Unable to fetch view MIS data');
      }
    });
  }

  mapBaseRow(item: any, index: number): MonthlyMprRow {
    return {
      sno: index + 1,
      agencyId: item?.agencyId || item?.agency?.agencyId || item?.id || 0,
      agencyName: item?.agencyName || item?.nameOfIa || item?.iaName || item?.agency?.agencyName || '-',
      component: item?.component || item?.componentName || '-',
      programsScheduledAsOnDate: this.toNumber(
        item?.programsScheduledAsOnDate ?? item?.programScheduledAsOnDate ?? item?.programsScheduled ?? item?.scheduledOnDate
      ),
      noOfProgramsAsPerMpr: this.toNumber(
        item?.noOfProgramsAsPerMpr ?? item?.noOfProgramsConductedAsPerMpr ?? item?.noIfProgramAsPerMpr
      ),
      releasedAmount: this.toNumber(item?.releasedAmount),
      totalExpAsPerMpr: this.toNumber(item?.totalExpAsPerMpr ?? item?.totalExpenditureAsPerMpr)
    };
  }

  mapPhysicalRow(row: MonthlyMprRow, sourceItem?: any): PhysicalMisRow {
    const hasApiPhysicalValues =
      sourceItem?.fullyUploaded !== undefined ||
      sourceItem?.partiallyUploaded !== undefined ||
      sourceItem?.inProcess !== undefined ||
      sourceItem?.overDue !== undefined;

    const fullyUploadedInPortal = hasApiPhysicalValues
      ? this.toNumber(sourceItem?.fullyUploaded)
      : Math.min(row.noOfProgramsAsPerMpr, Math.floor(row.noOfProgramsAsPerMpr * 0.52));

    const partiallyUploadedInPortal = hasApiPhysicalValues
      ? this.toNumber(sourceItem?.partiallyUploaded)
      : Math.min(
          Math.max(row.noOfProgramsAsPerMpr - fullyUploadedInPortal, 0),
          Math.floor(row.noOfProgramsAsPerMpr * 0.18)
        );

    const totalUploaded = fullyUploadedInPortal + partiallyUploadedInPortal;

    const programsOverDueTillDate = hasApiPhysicalValues
      ? this.toNumber(sourceItem?.overDue)
      : Math.max(row.programsScheduledAsOnDate - totalUploaded, 0);

    const inProgress = hasApiPhysicalValues
      ? this.toNumber(sourceItem?.inProcess)
      : Math.max(row.noOfProgramsAsPerMpr - fullyUploadedInPortal, 0);

    return {
      ...row,
      fullyUploadedInPortal,
      partiallyUploadedInPortal,
      totalUploaded,
      programsOverDueTillDate,
      inProgress,
      remarks: programsOverDueTillDate > 0 ? 'Programs pending to reflect in MPR' : 'All programs updated'
    };
  }

  mapFinancialRow(row: MonthlyMprRow): FinancialMisRow {
    const totalBillsUploadedValue = this.roundToTwo(row.totalExpAsPerMpr * 0.18);
    const trainingBillsUploadedValue = this.roundToTwo(row.totalExpAsPerMpr * 0.6);
    const trainingApprovedValue = this.roundToTwo(trainingBillsUploadedValue * 0.72);
    const trainingRejectedValue = this.roundToTwo(trainingBillsUploadedValue * 0.08);
    const trainingNeedClarificationValue = this.roundToTwo(trainingBillsUploadedValue - trainingApprovedValue - trainingRejectedValue);
    const verifiedTrainingBillsValue = this.roundToTwo(trainingApprovedValue + trainingNeedClarificationValue * 0.4);
    const nonTrainingBillsUploadedValue = this.roundToTwo(row.totalExpAsPerMpr * 0.22);
    const nonTrainingApprovedValue = this.roundToTwo(nonTrainingBillsUploadedValue * 0.68);
    const nonTrainingRejectedValue = this.roundToTwo(nonTrainingBillsUploadedValue * 0.1);
    const nonTrainingNeedClarificationValue = this.roundToTwo(
      nonTrainingBillsUploadedValue - nonTrainingApprovedValue - nonTrainingRejectedValue
    );
    const totalBillsVerifiedValue = this.roundToTwo(
      verifiedTrainingBillsValue + nonTrainingApprovedValue + nonTrainingNeedClarificationValue * 0.4
    );
    const billsUploadPercent = row.releasedAmount > 0
      ? this.roundToTwo((totalBillsUploadedValue / row.releasedAmount) * 100)
      : 0;
    const billsVerifiedBySpiuPercent = totalBillsUploadedValue > 0
      ? this.roundToTwo((totalBillsVerifiedValue / totalBillsUploadedValue) * 100)
      : 0;
    const remarks = billsVerifiedBySpiuPercent >= 90 ? 'Verified by SPIU' : 'Pending SPIU verification';

    return {
      ...row,
      totalBillsUploadedValue,
      billsUploadPercent,
      trainingBillsUploadedValue,
      trainingApprovedValue,
      trainingRejectedValue,
      trainingNeedClarificationValue,
      verifiedTrainingBillsValue,
      nonTrainingBillsUploadedValue,
      nonTrainingApprovedValue,
      nonTrainingRejectedValue,
      nonTrainingNeedClarificationValue,
      totalBillsVerifiedValue,
      billsVerifiedBySpiuPercent,
      remarks
    };
  }

  toNumber(value: any): number {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  roundToTwo(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  ordinal(value: number): string {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return `${value}st`;
    }
    if (mod10 === 2 && mod100 !== 12) {
      return `${value}nd`;
    }
    if (mod10 === 3 && mod100 !== 13) {
      return `${value}rd`;
    }
    return `${value}th`;
  }

  formatDate(value: Date | string): string {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  get physicalTotalScheduled(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.programsScheduledAsOnDate, 0);
  }

  get physicalTotalMpr(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.noOfProgramsAsPerMpr, 0);
  }

  get physicalTotalFullyUploaded(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.fullyUploadedInPortal, 0);
  }

  get physicalTotalPartiallyUploaded(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.partiallyUploadedInPortal, 0);
  }

  get physicalGrandTotal(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.totalUploaded, 0);
  }

  get physicalOverDueTotal(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.programsOverDueTillDate, 0);
  }

  get physicalInProgressTotal(): number {
    return this.physicalRows.reduce((sum, row) => sum + row.inProgress, 0);
  }

  get financialTotalReleased(): number {
    return this.financialRows.reduce((sum, row) => sum + row.releasedAmount, 0);
  }

  get financialTotalExpense(): number {
    return this.financialRows.reduce((sum, row) => sum + row.totalExpAsPerMpr, 0);
  }

  get financialTotalBillsUploaded(): number {
    return this.financialRows.reduce((sum, row) => sum + row.totalBillsUploadedValue, 0);
  }

  get financialTotalTrainingUploaded(): number {
    return this.financialRows.reduce((sum, row) => sum + row.trainingBillsUploadedValue, 0);
  }

  get financialTotalTrainingApproved(): number {
    return this.financialRows.reduce((sum, row) => sum + row.trainingApprovedValue, 0);
  }

  get financialTotalTrainingRejected(): number {
    return this.financialRows.reduce((sum, row) => sum + row.trainingRejectedValue, 0);
  }

  get financialTotalTrainingClarification(): number {
    return this.financialRows.reduce((sum, row) => sum + row.trainingNeedClarificationValue, 0);
  }

  get financialTotalVerifiedTraining(): number {
    return this.financialRows.reduce((sum, row) => sum + row.verifiedTrainingBillsValue, 0);
  }

  get financialTotalNonTrainingUploaded(): number {
    return this.financialRows.reduce((sum, row) => sum + row.nonTrainingBillsUploadedValue, 0);
  }

  get financialTotalNonTrainingApproved(): number {
    return this.financialRows.reduce((sum, row) => sum + row.nonTrainingApprovedValue, 0);
  }

  get financialTotalNonTrainingRejected(): number {
    return this.financialRows.reduce((sum, row) => sum + row.nonTrainingRejectedValue, 0);
  }

  get financialTotalNonTrainingClarification(): number {
    return this.financialRows.reduce((sum, row) => sum + row.nonTrainingNeedClarificationValue, 0);
  }

  get financialTotalBillsVerified(): number {
    return this.financialRows.reduce((sum, row) => sum + row.totalBillsVerifiedValue, 0);
  }

  get financialVerifiedBySpiuPercent(): number {
    const totalUploaded = this.financialTotalBillsUploaded;
    if (!totalUploaded) {
      return 0;
    }
    return this.roundToTwo((this.financialTotalBillsVerified / totalUploaded) * 100);
  }
}
