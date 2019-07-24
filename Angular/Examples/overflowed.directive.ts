import { Directive, ElementRef, HostListener, AfterViewChecked } from '@angular/core';
import { EmittersService } from "./index"

@Directive({
    selector: '[checkOverflow]'
})
export class OverflowedDirective implements AfterViewChecked {
    
    /*This directive will detect overflow on an element, and apply a overflowed class to the element.*/
    constructor(private element: ElementRef, private _emitters: EmittersService) {
    }

    ngAfterViewChecked(): void {
        this.checkOverflow();
    }
    
    this._emitters.WindowResize.subscribe(() => {
        // call our matchHeight function here
        this.checkOverflow();
    }) 

    this._emitters.ContentUpdated.subscribe(() => {
        // call our matchHeight function here
        this.checkOverflow();
    }); 

    public checkOverflow(): void {
        let elmHeight = this.element.nativeElement.clientHeight;
        let contentHeight = this.element.nativeElement.scrollHeight;

        if (elmHeight < contentHeight) {
            this.element.nativeElement.classList.add("overflowed");
        } else {
            this.element.nativeElement.classList.remove("overflowed");
        }
    }
}