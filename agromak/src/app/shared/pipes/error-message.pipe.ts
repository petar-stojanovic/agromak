import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'errorMessage'
})
export class ErrorMessagePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
