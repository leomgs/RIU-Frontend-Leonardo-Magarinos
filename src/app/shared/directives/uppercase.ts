import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  private el = inject(ElementRef);
  private ngControl = inject(NgControl);

  @HostListener('input') onInput() {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const transformedValue = inputElement.value.toUpperCase();
    
    inputElement.value = transformedValue;
    
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.setValue(transformedValue, { emitEvent: false });
    }
  }
}