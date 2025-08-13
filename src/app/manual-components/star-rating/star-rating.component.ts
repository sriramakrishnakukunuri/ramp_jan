import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit, OnChanges {

  constructor() { }
  ngOnInit(): void {
    // Convert percentage to star rating
    this.updateStarRating();
  }

  @Input() percentage: number = 0; // Accept percentage (0-100)
  @Input() rating: number = 0; // Keep for backward compatibility
  @Output() ratingChange = new EventEmitter<number>();
  @Output() percentageChange = new EventEmitter<number>();
  
  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;
  displayRating: number = 0; // The actual rating to display

  ngOnChanges(): void {
    this.updateStarRating();
  }

  private updateStarRating(): void {
    if (this.percentage !== undefined && this.percentage !== null) {
      // Convert percentage (0-100) to star rating (0-5)
      this.displayRating = (this.percentage / 100) * 5;
      // Clamp between 0 and 5
      this.displayRating = Math.max(0, Math.min(5, this.displayRating));
    } else {
      // Use the rating input if percentage is not provided
      this.displayRating = Math.max(0, Math.min(5, this.rating));
    }
  }

  rate(rating: number, event?: MouseEvent) {
    this.rating = rating;
    this.displayRating = rating;
    
    // Convert rating back to percentage
    const newPercentage = (rating / 5) * 100;
    this.percentage = newPercentage;
    
    this.ratingChange.emit(this.rating);
    this.percentageChange.emit(this.percentage);
  }

  onMouseLeave() {
    this.hoverRating = 0;
  }

  // Helper method to get percentage display
  getPercentageDisplay(): string {
    return `${Math.round(this.percentage)}%`;
  }

  // Helper method to get star rating display  
  getStarRatingDisplay(): string {
    return `${this.displayRating.toFixed(1)} / 5`;
  }

  // Get color class based on percentage range
  getColorClass(): string {
    const percentage = this.percentage || (this.rating / 5) * 100;
    
    if (percentage < 25) {
      return 'red-rating';
    } else if (percentage >= 25 && percentage <= 75) {
      return 'orange-rating';
    } else {
      return 'green-rating';
    }
  }
}
