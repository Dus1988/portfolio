import { Component, Input, TemplateRef, ContentChild, AfterViewInit} from "@angular/core";

import { BootstrapColumns, CardComponentVM, CardTypes } from "../index";

@Component({
    selector: "card-component",
    templateUrl: './card.html'
})



export class CardComponent implements AfterViewInit  {

    /*
    Card Component is meant to consume a component (or static HTML if needed) within a ng-template.
    This ng-template needs to be placed within the card-component tags. The template gets injected
    into this component but the data is still accessible where you defined the template. Effectively, 
    Card Component is a generic wrapper component with injectable contents that is only responsible for controlling how it displays,
    based on the config vm from the parent component.
    */

    private readonly _FullCard: string = "col-xs-12";
    private readonly _HalfCard: string = "col-xs-12 col-sm-6";
    public readonly _ThirdCard: string = "col-xs-12 col-sm-4";
    

    @Input()
    public _CardVM: CardComponentVM;
    
    @ContentChild(TemplateRef)
    public _CardTemplate: TemplateRef<any>;

    private _CardWidth: string;
    private _Type: string;

    constructor() {}
    
    ngAfterViewInit(): void {
        if (this._CardVM.Width == BootstrapColumns.Full) {
            this._CardWidth = this._FullCard;
        } else if (this._CardVM.Width == BootstrapColumns.Half) {
            this._CardWidth = this._HalfCard;
        } else if (this._CardVM.Width == BootstrapColumns.Third) {
            this._CardWidth = this._ThirdCard;
        }
        
        if (this._CardTemplate) {
            this._Type = this._CardVM.Type;
        } else {
            this._Type = "alert";
        }
    }
}


