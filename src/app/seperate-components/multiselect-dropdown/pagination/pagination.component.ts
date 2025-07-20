import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChange = new EventEmitter<{page: number, pageSize: number}>();
 @Input() key: any;
  private prevKey: any;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
 ngOnChanges(changes: SimpleChanges): void {
    if (changes['key'] && changes['key'].currentValue !== this.prevKey) {
      this.prevKey = changes['key'].currentValue;
      this.currentPage = 1;
      this.pageSize = 10;
    }
  }
  onPageSizeChange(): void {
    this.currentPage = 1; // Reset to first page when page size changes
    this.emitPageChange();
  }

  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.emitPageChange();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPageChange();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitPageChange();
    }
  }

  goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.emitPageChange();
    }
  }

  private emitPageChange(): void {
    this.pageChange.emit({
      page: this.currentPage,
      pageSize: this.pageSize
    });
  }
}