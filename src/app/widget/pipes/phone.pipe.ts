import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {
  transform(phone: string, countryCode: string = 'BR'): string {
    if (!phone) return '';

    const digits = phone.replace(/\D/g, '');

    if (countryCode === 'BR') {
      return digits.length === 11
        ? `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`
        : `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
    }

    return phone;
  }
}
