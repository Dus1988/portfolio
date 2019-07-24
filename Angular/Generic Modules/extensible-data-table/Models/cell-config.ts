import { CellTypes } from "../Enums/cell-types.enum";
import { ValidatorFn } from "@angular/forms";

export interface CellOptions {
    ColumnName?: string;
    ColorFunction?: Function;
    EditComponent?: number;
    ValidationRules?: Array<ValidatorFn>;
    DisplayComponent: number;
    HasHistory?: boolean;
    /**
     * @description function to run on cell init, to determine if popover icon should show
     */
    popoverEnabledFunction?: Function;
    popoverIcon?: String;
    selectOptions?: Array<any>;
}

export class CellConfig implements CellOptions {

    public ColumnName: string;
    public ColorFunction: Function;
    public popoverEnabledFunction: Function;
    public popoverIcon: String;
    public EditComponent: number;
    public ValidationRules: Array<ValidatorFn>;
    public DisplayComponent: number;
    public HasHistory: boolean;
    public selectOptions: Array<any>;

    constructor(options: CellOptions = {DisplayComponent: CellTypes.Data} ) {
        // defaults
        this.ColumnName = '';
        this.DisplayComponent = CellTypes.Data;
        this.popoverIcon = 'info';
        this.selectOptions = [];

        // custom options over-ride 
        Object.keys(options).forEach((key) => {
            this[key] = options[key];
        });
    }

}