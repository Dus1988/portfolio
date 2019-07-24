import { Directive, ElementRef, HostListener, AfterViewChecked } from "@angular/core";

@Directive({
    selector: "[auto-grow]"
})

export class TextAreaAutoGrowDirective implements AfterViewChecked {

    constructor(public el: ElementRef) { }

    @HostListener("keyup") onChange() {

        this.adjust();

    }

    @HostListener("window:resize") onResize() {
        this.adjust();
    }

    ngAfterViewChecked(): void {
        if ($(this.el.nativeElement).is(":visible")) {
            this.adjust();
        }
    }

    private adjust(): void {
        let nativeElement = this.el.nativeElement;
        nativeElement.style.overflow = 'hidden';
        nativeElement.style.height = 'auto';
        nativeElement.style.height = nativeElement.scrollHeight + "px";
    }
}