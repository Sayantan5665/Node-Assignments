import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineClamp',
  standalone: true
})
export class LineClampPipe implements PipeTransform {

  transform(value: unknown, maxCharNo:number): unknown {
    if (typeof value === 'string' && maxCharNo > 0) {
      return value.length > maxCharNo? value.slice(0, maxCharNo) + '...' : value;
    }
    return null;
  }

}
