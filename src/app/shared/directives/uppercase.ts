import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  constructor(private el: ElementRef, private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const transformedValue = inputElement.value.toUpperCase();
    
    inputElement.value = transformedValue;
    
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(transformedValue, { emitEvent: false });
    }
  }
}