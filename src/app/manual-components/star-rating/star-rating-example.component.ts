import { Component } from '@angular/core';

@Component({
  selector: 'app-star-rating-example',
  templateUrl: './star-rating-example.component.html',
  styleUrls: ['./star-rating-example.component.css']
})
export class StarRatingExampleComponent {
  currentPercentage: number = 60;
  currentRating: number = 3;

  onPercentageChange(percentage: number): void {
    console.log('Percentage changed:', percentage);
    this.currentPercentage = percentage;
  }

  onRatingChange(rating: number): void {
    console.log('Rating changed:', rating);
    this.currentRating = rating;
  }

  getDisplayText(percentage: number): string {
    const stars = (percentage / 100) * 5;
    return `${percentage}% (${stars.toFixed(1)} stars)`;
  }
}
