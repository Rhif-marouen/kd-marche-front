// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true // Déclaration comme pipe standalone
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 100): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}