import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeperationIndia'
})
export class CommaSeperationIndiaPipe implements PipeTransform {

  transform(value: number | string | null | undefined, symbol: string = '₹', showDecimals: boolean = true): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return 'N/A';
    }

    // Format number with Indian numbering system
    const formattedAmount = this.formatIndianNumber(numValue, showDecimals);
    
    return `${symbol} ${formattedAmount}`;
  }

  private formatIndianNumber(num: number, showDecimals: boolean): string {
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    
    // Split into integer and decimal parts
    const parts = absNum.toFixed(showDecimals ? 2 : 0).split('.');
    let integerPart = parts[0];
    const decimalPart = showDecimals && parts[1] ? `.${parts[1]}` : '';
    
    // Apply Indian numbering system (lakhs, crores)
    if (integerPart.length > 3) {
      const lastThree = integerPart.substring(integerPart.length - 3);
      const otherNumbers = integerPart.substring(0, integerPart.length - 3);
      
      if (otherNumbers !== '') {
        integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
      } else {
        integerPart = lastThree;
      }
    }
    
    const result = integerPart + decimalPart;
    return isNegative ? `-${result}` : result;
  }
}


