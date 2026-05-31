import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-search-filter',
  template: `
    <div style="padding: 8px;">
      <input
        matInput
        type="text"
        [(ngModel)]="searchText"
        (ngModelChange)="onSearch()"
        (keydown)="$event.stopPropagation()"
        [placeholder]="placeholder"
        style="width:100%; border:1px solid #ccc; border-radius:4px; padding:6px 8px; font-size:14px; outline:none;"
      />
    </div>
  `
})
export class SelectSearchFilterComponent implements OnChanges {
  @Input() array: any[] = [];
  @Input() displayMember: string = '';
  @Input() placeholder: string = 'Search...';
  @Output() filteredReturn = new EventEmitter<any[]>();

  searchText = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['array']) {
      this.searchText = '';
      this.filteredReturn.emit(this.array);
    }
  }

  onSearch(): void {
    const term = this.searchText.toLowerCase();
    if (!term) {
      this.filteredReturn.emit(this.array);
      return;
    }
    const filtered = this.array.filter(item => {
      if (this.displayMember && typeof item === 'object') {
        return String(item[this.displayMember] ?? '').toLowerCase().includes(term);
      }
      return String(item).toLowerCase().includes(term);
    });
    this.filteredReturn.emit(filtered);
  }
}
