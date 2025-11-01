import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
  selector: 'app-indian-rupees-input',
  templateUrl: './indian-rupees-input.component.html',
  styleUrls: ['./indian-rupees-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IndianRupeesInputComponent),
      multi: true
    }
  ]
})
export class IndianRupeesInputComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string = 'Enter amount in rupees';
  @Input() label: string = 'Amount (₹)';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Output() valueChange = new EventEmitter<number>();
  random:any=Math?.random()
  displayValue: string = '';
  actualValue: number = 0;

  private onChange = (value: number) => {};
  private onTouched = () => {};

  ngOnInit(): void {}

  // Format number with Indian comma separation
  private formatIndianNumber(num: number): string {
    if (!num || num === 0) return '';
    
    const numStr = num.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    } else {
      return lastThree;
    }
  }

  // Remove commas and convert to number
  private parseIndianNumber(value: string): number {
    if (!value) return 0;
    const cleanValue = value.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    return isNaN(numValue) ? 0 : numValue;
  }

  // Handle input event
  onInput(event: any): void {
    let inputValue = event.target.value;
    
    // Remove all non-numeric characters except decimal point
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Convert to number
    const numberValue = this.parseIndianNumber(inputValue);
    
    // Format with Indian comma separation
    let formattedValue = '';
    if (inputValue.includes('.')) {
      const [integerPart, decimalPart] = inputValue.split('.');
      const formattedInteger = this.formatIndianNumber(parseInt(integerPart) || 0);
      formattedValue = formattedInteger + (decimalPart !== undefined ? '.' + decimalPart : '');
    } else {
      formattedValue = this.formatIndianNumber(numberValue);
    }
    
    this.displayValue = formattedValue;
    this.actualValue = numberValue;
    
    // Update the input field
    event.target.value = this.displayValue;
    
    // Emit changes
    this.onChange(this.actualValue);
    this.valueChange.emit(this.actualValue);
  }

  // Handle blur event
  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.actualValue = value || 0;
    this.displayValue = this.formatIndianNumber(this.actualValue);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}