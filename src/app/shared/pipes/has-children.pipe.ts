import { Pipe, PipeTransform } from '@angular/core';
import { Route } from '@angular/router';

@Pipe({
  name: 'hasChildren',
  standalone: true
})
export class HasChildrenPipe implements PipeTransform {

  transform(route: Route): boolean {
    const {children} = route;
    if (!children) return false;

    return children.some((c)=>!!c.title);
  }

}
