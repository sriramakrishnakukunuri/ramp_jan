import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.css'],
   providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectDropdownComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiselectDropdownComponent),
      multi: true
    }
  ]
})
export class MultiselectDropdownComponent implements ControlValueAccessor, Validator {

  difficulties = ['Financial', 'Supply Chain', 'Labor', 'Market Demand', 'Regulatory', 'Other'];
  selectedDifficulties: string[] = [];
  disabled = false;
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: string[]): void {
    this.selectedDifficulties = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: FormControl) {
    return null; // No custom validation in this example
  }

  onDifficultyChange(difficulty: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      this.selectedDifficulties = [...this.selectedDifficulties, difficulty];
    } else {
      this.selectedDifficulties = this.selectedDifficulties.filter(d => d !== difficulty);
    }
    
    this.onChange(this.selectedDifficulties);
    this.onTouched();
  }

  isDifficultySelected(difficulty: string): boolean {
    return this.selectedDifficulties.includes(difficulty);
  }
}