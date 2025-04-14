import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';

const modules = [MatTabsModule, MatInputModule, MatDialogModule, MatIconModule, MatSidenavModule, CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, MatCheckboxModule, MatDatepickerModule,
  MatNativeDateModule,  MatDatepickerModule,  MatNativeDateModule,  MatFormFieldModule,MatTableModule,MatRadioModule]

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule { }

