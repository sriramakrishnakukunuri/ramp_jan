import { Component, Input, Output, EventEmitter ,OnInit} from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {

  constructor() { }
  ngOnInit(): void {
    // Initialize the rating if needed
    if (this.rating < 0) {
      this.rating = 0;
    } else if (this.rating > 5) {
      this.rating = 5;
    }
  }

  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  
  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  rate(rating: number, event?: MouseEvent) {
    this.rating = rating;
    this.ratingChange.emit(this.rating);
  }

  onMouseLeave() {
    this.hoverRating = 0;
  }
}
