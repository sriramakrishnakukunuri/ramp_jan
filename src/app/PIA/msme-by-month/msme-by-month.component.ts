import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '@app/_services/common-service.service';
import { ToastrService } from 'ngx-toastr';
import { API_BASE_URL, APIS } from '@app/constants/constants';
import { Role } from '@app/_models';
import { LoaderService } from '@app/common_components/loader-service.service';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-msme-by-month',
  templateUrl: './msme-by-month.component.html',
  styleUrls: ['./msme-by-month.component.css']
})
export class MsmeByMonthComponent implements OnInit {
  namemonth='Select Month'
  selectedAgencyId: any = null;
  selectedFinancialYear: any = '';
  financialYears: any[] = [];
  financialYRFiltered: any[] = [];
  selectedMonth: Date | null = null;

  agencyList: any[] = [];
  agencyListFiltered: any[] = [];

  constructor(
    private _commonService: CommonServiceService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.getAgenciesList();
    this.generateFinancialYears();
      // Set current month by default
  this.month.setValue(new Date());
  }

  getAgenciesList() {
    this._commonService.getDataByUrl(APIS.masterList.agencyList).subscribe({
      next: (res: any) => {
        this.agencyList = res.data;
        this.agencyListFiltered = this.agencyList;
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });
  }


  isAddingRow = false;
newRow: any = {};
tableData: any[] = []; // Your data array

showViewModal = false;
viewRowData: any = {};

addRow() {
  this.isAddingRow = true;
  this.newRow = {};
  this.viewRow()
}

saveRow() {
  this.tableData.push({ ...this.newRow });
  this.isAddingRow = false;
  this.newRow = {};
}

cancelRow() {
  this.isAddingRow = false;
  this.newRow = {};
}

viewRow(row?: any) {
  this.viewRowData = row;
  this.showViewModal = true;
}

closeViewModal() {
  this.showViewModal = false;
} 

  GetProgramsByAgency(value: any) {
    this.selectedAgencyId = value;
    // Add your logic here
  }

  generateFinancialYears() {
    const currentYear = new Date().getFullYear();
    const range = 2;
    for (let i = 2024; i < currentYear; i++) {
      const year = i;
      this.financialYears.push(`${year}-${year + 1}`);
    }
    for (let i = 0; i <= range; i++) {
      const year = currentYear + i;
      this.financialYears.push(`${year}-${year + 1}`);
    }
    this.financialYRFiltered = this.financialYears;
    this.selectedFinancialYear = this.getCurrentFinancialYear();
  }

  getCurrentFinancialYear(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  getBasedOnYearSelection(value: any) {
    this.selectedFinancialYear = value;
    // Add your logic here
  }
 onChangeDate(event:any){
      //  console.log(event,event.value,moment(event.value).format('MM-YYYY'));
      //  this.paymentForm.patchValue({paymentForMonth: moment(event.value).format('MM-YYYY')
      //  });
      // this.paymentForMonth= event.value ? moment(event.value).format('MM-YYYY') : '';
     }
   paymentForMonth: any = "09-2025";
  month = new FormControl<Date | null>(null);
  chosenYear!: number;
  chosenMonth!: number;

  setMonthAndYear(normalizedMonth: Date, datepicker: any) {
    const ctrlValue = this.month.value ?? new Date();
    ctrlValue.setMonth(normalizedMonth.getMonth());
    ctrlValue.setFullYear(normalizedMonth.getFullYear());
    this.month.setValue(ctrlValue);
    datepicker.close();
  }
}
