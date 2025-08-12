# Star Rating Component - Percentage Based

This Angular component displays star ratings based on percentage values (0-100%) and supports both percentage and traditional star rating inputs.

## Features

- ✅ **Percentage Input**: Accept percentage values (0-100) and convert to star display (0-5 stars)
- ✅ **Backward Compatibility**: Still supports traditional rating input (0-5)
- ✅ **Interactive**: Users can click to change ratings
- ✅ **Half Stars**: Supports half-star increments for precise ratings
- ✅ **Hover Effects**: Visual feedback on hover
- ✅ **Dual Outputs**: Emits both percentage and star rating values

## Usage

### Basic Usage with Percentage

```html
<!-- Display 75% as stars (3.75 out of 5 stars) -->
<app-star-rating [percentage]="75"></app-star-rating>

<!-- Interactive rating with percentage -->
<app-star-rating 
  [percentage]="currentPercentage" 
  (percentageChange)="onPercentageChange($event)"
  (ratingChange)="onRatingChange($event)">
</app-star-rating>
```

### Component Properties

#### Inputs
- `percentage: number` - Percentage value (0-100). Takes priority over rating input.
- `rating: number` - Traditional star rating (0-5). Used when percentage is not provided.

#### Outputs
- `percentageChange: EventEmitter<number>` - Emits when percentage changes
- `ratingChange: EventEmitter<number>` - Emits when star rating changes

### Examples

```typescript
export class MyComponent {
  // Example percentages
  performanceScore = 85;    // Shows as 4.25 stars
  satisfactionRate = 60;    // Shows as 3 stars
  efficiencyRate = 92;      // Shows as 4.6 stars

  onPercentageChange(percentage: number) {
    console.log('New percentage:', percentage);
  }

  onRatingChange(rating: number) {
    console.log('New rating:', rating);
  }
}
```

```html
<!-- Performance indicators -->
<div class="metrics">
  <div class="metric">
    <label>Performance ({{performanceScore}}%):</label>
    <app-star-rating [percentage]="performanceScore"></app-star-rating>
  </div>
  
  <div class="metric">
    <label>Satisfaction ({{satisfactionRate}}%):</label>
    <app-star-rating [percentage]="satisfactionRate"></app-star-rating>
  </div>
  
  <div class="metric">
    <label>Efficiency ({{efficiencyRate}}%):</label>
    <app-star-rating [percentage]="efficiencyRate"></app-star-rating>
  </div>
</div>
```

## Conversion Logic

- **Percentage to Stars**: `stars = (percentage / 100) * 5`
- **Stars to Percentage**: `percentage = (stars / 5) * 100`

### Examples:
- 0% = 0 stars
- 20% = 1 star
- 50% = 2.5 stars
- 75% = 3.75 stars
- 100% = 5 stars

## Styling

The component uses the existing CSS with orange stars for active/filled states. You can customize the colors by modifying the CSS:

```css
.star-half-left.active,
.star-half-right.active {
  color: orange; /* Change this to your preferred color */
}
```

## Helper Methods

The component includes helper methods for display:

```typescript
// Get percentage as formatted string
getPercentageDisplay(): string // Returns "75%"

// Get star rating as formatted string  
getStarRatingDisplay(): string // Returns "3.8 / 5"
```

## Migration from Rating-Based

If you're currently using the rating-based version, the component is backward compatible:

```html
<!-- Old way (still works) -->
<app-star-rating [rating]="3.5"></app-star-rating>

<!-- New way with percentage -->
<app-star-rating [percentage]="70"></app-star-rating>
```
