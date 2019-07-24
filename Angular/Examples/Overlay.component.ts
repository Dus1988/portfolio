import { Component, Input, OnInit, TemplateRef, ContentChild, EventEmitter, Output, HostListener } from "@angular/core";
import { Location } from "@angular/common";
import { OverlayVm, EmittersService } from "./index";
import { Router } from "@angular/router";

@Component({
    selector: "overlay-component",
    templateUrl: './Overlay.html'
})

export class OverlayComponent implements OnInit {

    /*
    Overlay Component is desiged to require an ng-template to be defined within the overlay-component tags.
    Ideally overlay component should be used within a logic container component that is a child of your main
    component. This allows a 1->1 relationship with overlay component and its displayed html.
    This reduces the inputs and controls needed in the main component when multiple overlays are needed.
    If neccessary, you can define the overlay component with a child component within your main page component instead,
    this allows for a 1->Many configuration and lets your overlay logic live in the main component.


    If you want the overlay to take up the entire screen, even the header, set the _OverlayConfig.FullScreen = true;
    */


    @ContentChild(TemplateRef)
    public _OverlayTemplate: TemplateRef<any>;

    @Input()
    public _OverlayConfig: OverlayVm;
    
    

    @Output()
    public parenthandleOverlayClose = new EventEmitter();
    

    private _param: string;

    constructor(private _router: Router, private _location: Location, private _emitters: EmittersService) {
        this._param = "";
    }

    this._emitters.Popstate.subscribe(() => {
        if (this._OverlayConfig.ShowOverlay && this._OverlayConfig.ParentHandlesClose) {
            this._location.go(this._param);
            this.parenthandleOverlayClose.emit();
        } else if (this._OverlayConfig.ShowOverlay) {
            this._OverlayConfig.ShowOverlay = false;
            this._param = "";
        }
    }); 
    
    public ngOnInit(): void {

    }

    public showOverlay(param: string = ""): void {
        this._OverlayConfig.ShowOverlay = true;
        this._param = param;
    }

    public tryCloseOverlay(): void {
        if (!this._OverlayConfig.ParentHandlesClose) {
            this.closeOverlay();
        } else {
            this.parenthandleOverlayClose.emit();
        }
    }

    public closeOverlay(): void {
        this._location.back();
        this._param = "";
        this._OverlayConfig.ShowOverlay = false;
    }
}