import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doubleToIntString',
  standalone: true
})
export class DoubleToIntStringPipe implements PipeTransform {

  transform(value: number|string,): string {
    if(typeof value === 'string') value = parseInt(value);
    return Math.floor(value).toString();
  }

}
