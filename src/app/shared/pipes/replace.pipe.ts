import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
  standalone: true
})
export class ReplacePipe implements PipeTransform {

  transform(value:string,replace:string,replaceTo:string): string {
    return value.split(replace).join(replaceTo);
  }

}
