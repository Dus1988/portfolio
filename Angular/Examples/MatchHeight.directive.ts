import {
    Directive, ElementRef, AfterViewChecked,
    Input, HostListener
} from '@angular/core';

import { EmittersService } from "./index"

@Directive({
    selector: '[matchHeight]'
})

export class MatchHeightDirective implements AfterViewChecked {

    @Input()
    private matchHeight: string;
    @Input() 
    private _Breakpoint: number;

    constructor(private element: ElementRef, private _emitters: EmittersService) {}

    ngAfterViewChecked(): void {
        if (!this._Breakpoint) {
            /*Defualt breakpoint is 768px*/
            this._Breakpoint = 768
        }
        this.fnMatchHeight(this.element.nativeElement, this.matchHeight, this._Breakpoint);
    }
    
    this._emitters.WindowResize.subscribe(() => {
        // call our matchHeight function here
        this.fnMatchHeight(this.element.nativeElement, this.matchHeight, this._Breakpoint);
    }); 

    this._emitters.ContentUpdated.subscribe(() => {
        // call our matchHeight function here
        this.fnMatchHeight(this.element.nativeElement, this.matchHeight, this._Breakpoint);
    }); 

    public fnMatchHeight(parent: HTMLElement, className: string, breakpoint:number):void {
        if (!parent) return;

        let windowWidth = window.innerWidth;

        

        // step 1: find all the child elements with the selected class name
        const children = parent.getElementsByClassName(className);

        if (!children) return;

        // step 1b: reset all children height
        Array.from(children).forEach((x: HTMLElement) => {
            x.style.height = 'auto';
        });

        

        // step 2a: get all the child elements heights
        const itemHeights = Array.from(children).map(x => x.getBoundingClientRect().height);

        // step 2b: find out the tallest
        const maxHeight = itemHeights.reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        }, 0);

        if (windowWidth >= breakpoint) {
            // step 3: update all the child elements to the tallest height, if not smaller than breakpoint
            Array.from(children).forEach((x: HTMLElement) => x.style.height = `${maxHeight}px`);
        } 
        
    }

}