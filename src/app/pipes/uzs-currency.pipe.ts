import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uzsCurrency',
})
export class UzsCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) return '';

    const formattedNumber = new Intl.NumberFormat('uz-UZ').format(
      Number(value)
    );

    return `${formattedNumber} soʻm`;
  }
}
