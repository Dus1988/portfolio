
export interface RowActionOptions {
    ActionName: string;
    IconFAClass: string;
    ConditionFunction?: Function;
    ActionFunction?: Function;
}
export class RowAction {

    public ActionName: string;
    public IconFAClass: string;
    public ConditionFunction: Function;
    public ActionFunction: Function;
    public emitOnAction: boolean;

    // constructor(name: string = '', icon: string = '', actionFunction: Function = () => {}, conditionFunction?: Function) {
    //     this.ActionName = name;
    //     this.IconFAClass = icon;
    //     if (conditionFunction) {
    //         this.ConditionFunction = conditionFunction;
    //     }
    // }

    /**
     * 
     * @param options Options object from RowActionsOptions Interface
     * @param emitOnAciton defaults to true. If true, parent of ET handles action, else ET handles action
     */
    constructor(options: RowActionOptions, emitOnAciton: boolean = true) {
        Object.keys(options).forEach((key) => {
            this[key] = options[key];
        });
        this.emitOnAction = emitOnAciton;
    }
}
