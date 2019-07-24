import { Component, ViewChild } from "@angular/core";

import { BootstrapColumns, CardComponentVM, CardTypes, OverlayVm } from "./index";

import { OverlayComponent } from "./Overlay.component"

@Component({
    selector: "card-component",
    templateUrl: './card.html'
})

export class ExampleUsageComponent {
    private _CardVM: CardComponentVm;
    private _OverlayVM: OverlayVm;
    
    @ViewChild("ContentOverlay")
    private _ContentOverlay: OverlayComponent;
    
    constructor(){
        this._CardVM = new CardComponentVM();
        this._OverlayVM = new OverlayVm();
    }
    
    private openOverlay():void {
        this._ContentOverlay.showOverlay("/content");
    }
}