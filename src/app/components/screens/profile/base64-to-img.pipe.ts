import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64ToImage'
})
export class Base64ToImagePipe implements PipeTransform {

  transform(base64: string): string {
    const blob = new Blob([atob(base64.split(',')[1])], { type: base64.split(',')[0].split(':')[1] });
    return URL.createObjectURL(blob);
  }
}