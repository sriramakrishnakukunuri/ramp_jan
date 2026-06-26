import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectFilterComponent } from './mat-select-filter.component';

@NgModule({
  declarations: [MatSelectFilterComponent],
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatProgressSpinnerModule],
  exports: [MatSelectFilterComponent]
})
export class MatSelectFilterModule {}
