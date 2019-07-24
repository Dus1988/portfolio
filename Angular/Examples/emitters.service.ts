import { Injectable, EventEmitter, HostListener } from "@angular/core";

@Injectable()
export class EmittersService {
    public PopState: EventEmitter<any>;
    public ContentUpdated: EventEmitter<any>;
    public WindowResize: EventEmitter<any>;
    
    constructor() {
        this.PopState = new EventEmitter<any>();
        this.ContentUpdated = new EventEmitter<any>();
        this.WindowResize = new EventEmitter<any>();
    }
    
    @HostListener('window:resize')
    onResize() {
        this.WindowResize.emit();
    }
    
    @HostListener('window:contentupdated')
    onContentUpdate() {
        this.ContentUpdated.emit();
    }
    
    @HostListener('window:popstate')
    OnPop() {
        this.PopState.emit();
    }
}