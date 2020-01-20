import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'busTime'
})
export class BusTimePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value === 'DUE') {
      return 'Due';
    }
    if (value === 'DLY') {
      return 'Delayed';
    }
    return value + 'm';
  }

}
