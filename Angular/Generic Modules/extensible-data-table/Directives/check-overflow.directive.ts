import { Directive, AfterViewChecked, ElementRef } from '@angular/core';

@Directive({
  selector: '[checkOverflow]'
})
export class CheckOverflowDirective implements AfterViewChecked  {

  constructor(private element: ElementRef) { }

  ngAfterViewChecked(): void {
    this.checkOverflow();
  }

  public checkOverflow():void {
    const elemWidth = this.element.nativeElement.clientWidth;
    const contentWidth = this.element.nativeElement.scrollWidth;

    if (elemWidth < contentWidth) {
      this.element.nativeElement.classList.add('overflowed');
    } else {
      this.element.nativeElement.classList.remove('overflowed');
    }
  }
}
