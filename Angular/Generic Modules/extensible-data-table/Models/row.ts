import { RowAction } from "./row-action";
import { NgForm, FormGroup } from "@angular/forms";

export interface RowOptions {
    originalData?: Array<any>;
    raw?: Array<any>;
    actions?: Array<RowAction>;
    isEditMode?: boolean;
}

export class Row {
    

    public originalData: Array<any>;
    public raw: any;
    public actions: Array<RowAction>;
    public isEditMode: boolean;
    public Form: FormGroup;
    public rowValid: boolean;

    /**
     * 
     */
    constructor(options: RowOptions = {}) {
        // defualts
        this.isEditMode = false;
        // this.data = [];
        this.raw = [];
        this.actions = [];
        this.Form = new FormGroup({});
        this.rowValid = true;
        // custom options over-ride
        Object.keys(options).forEach((key) => {
            this[key] = options[key];
        });

    }

    public checkActionsConditions() {
        this.actions.forEach((action) => {
            action.ConditionFunction(this);
          });
    }

    public checkValid(): boolean {
        // this triggers UI Validation errors to be seen
        Object.keys(this.Form.controls).forEach((key) => {
            this.Form.controls[key].markAsTouched();
        });
        return this.Form.valid;
    }

}
