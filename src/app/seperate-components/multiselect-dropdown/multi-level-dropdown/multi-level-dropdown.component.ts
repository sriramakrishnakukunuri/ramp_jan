// dropdown.component.ts
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
export interface DropdownItem {
  name: string;
  children?: DropdownItem[];
  isDisabled?: boolean;
}

@Component({
  selector: 'app-multi-level-dropdown',
  templateUrl: './multi-level-dropdown.component.html',
  styleUrls: ['./multi-level-dropdown.component.css'],
   providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLevelDropdownComponent),
      multi: true
    }
  ]
})
 
 export class MultiLevelDropdownComponent implements ControlValueAccessor {
  @Input() items: DropdownItem[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() formControlName: string = '';
  @Output() itemSelected = new EventEmitter<string>();

  selectedItem: string | null = null;
  isOpen = false;
  disabled = false;
  openSubmenuIndex: number | null = null;

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.selectedItem = value || null;
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

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.openSubmenuIndex = null;
      this.onTouched();
    }
  }

  closeDropdown() {
    this.isOpen = false;
    this.openSubmenuIndex = null;
  }

  toggleSubmenu(index: number, event: Event) {
    event.stopPropagation();
    this.openSubmenuIndex = this.openSubmenuIndex === index ? null : index;
  }

  selectItem(item: DropdownItem,main?:any) {
    if(main?.children){
          if (!item.children && !item.isDisabled && !this.disabled) {
      this.selectedItem = main?.name+':'+item.name
      this.onChange(item.name);
      this.itemSelected.emit(main?.name+':'+item.name);
      this.closeDropdown();
    }
    }
    else{
       if (!item.children && !item.isDisabled && !this.disabled) {
      this.selectedItem = item.name
      this.onChange(item.name);
      this.itemSelected.emit(item.name);
      this.closeDropdown();
    }
    }
  }

  isSubmenuOpen(index: number): boolean {
    return this.openSubmenuIndex === index;
  }
}