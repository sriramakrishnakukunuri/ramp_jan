import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { A, Z, ZERO, NINE, SPACE } from '@angular/cdk/keycodes';

@Component({
  selector: 'mat-select-filter',
  template: `
    <form [formGroup]="searchForm" class="mat-filter" [ngStyle]="{'background-color': color ? color : 'white'}">
      <div>
        <input #input class="mat-filter-input" matInput [placeholder]="placeholder || 'Search...'"
          formControlName="value" (keydown)="handleKeydown($event)">
        <mat-spinner *ngIf="localSpinner" class="spinner" diameter="16"></mat-spinner>
      </div>
      <div *ngIf="noResults" class="noResultsMessage">{{noResultsMessage}}</div>
    </form>
  `,
  styles: [`
    .mat-filter { border-bottom: 1px solid grey; box-sizing: border-box; padding: 16px; position: sticky; top: 0; z-index: 100; }
    .mat-filter-input { appearance: none; background-color: unset; border: 0; color: grey; outline: none; width: 100%; }
    .spinner { position: absolute; right: 16px; top: calc(50% - 8px); }
    .noResultsMessage { font-family: Roboto, sans-serif; font-size: 16px; margin-top: 10px; }
  `]
})
export class MatSelectFilterComponent implements OnInit, OnDestroy {
  @ViewChild('input', { static: true }) input!: ElementRef;
  @Input('array') array: any[] = [];
  @Input('placeholder') placeholder: string = 'Search...';
  @Input('color') color: string = '';
  @Input('displayMember') displayMember: string | null = null;
  @Input('showSpinner') showSpinner: boolean = true;
  @Input('noResultsMessage') noResultsMessage: string = 'No results';
  @Input('hasGroup') hasGroup: boolean = false;
  @Input('groupArrayName') groupArrayName: string = '';
  @Output() filteredReturn = new EventEmitter<any[]>();

  searchForm: FormGroup;
  noResults = false;
  localSpinner = false;
  private sub!: Subscription;

  constructor(fb: FormBuilder) {
    this.searchForm = fb.group({ value: '' });
  }

  ngOnInit() {
    this.sub = this.searchForm.valueChanges.subscribe(value => {
      if (this.showSpinner) this.localSpinner = true;
      const term = value['value'];
      let filtered: any[];
      if (term) {
        if (this.displayMember == null) {
          filtered = this.array.filter(item => item.toLowerCase().includes(term.toLowerCase()));
        } else if (this.hasGroup && this.groupArrayName && this.displayMember) {
          filtered = this.array.map(a => {
            const copy = { ...a };
            copy[this.groupArrayName] = copy[this.groupArrayName].filter((g: any) =>
              g[this.displayMember!].toLowerCase().includes(term.toLowerCase()));
            return copy;
          }).filter(x => x[this.groupArrayName].length > 0);
        } else {
          filtered = this.array.filter(item => item[this.displayMember!].toLowerCase().includes(term.toLowerCase()));
        }
        this.noResults = !filtered || filtered.length === 0;
      } else {
        filtered = this.array.slice();
        this.noResults = false;
      }
      this.filteredReturn.emit(filtered);
      setTimeout(() => { if (this.showSpinner) this.localSpinner = false; }, 2000);
    });
    setTimeout(() => this.input.nativeElement.focus(), 500);
  }

  handleKeydown(event: KeyboardEvent) {
    if ((event.key && event.key.length === 1) ||
      (event.keyCode >= A && event.keyCode <= Z) ||
      (event.keyCode >= ZERO && event.keyCode <= NINE) ||
      (event.keyCode === SPACE)) {
      event.stopPropagation();
    }
  }

  ngOnDestroy() {
    this.filteredReturn.emit(this.array);
    this.sub.unsubscribe();
  }
}
