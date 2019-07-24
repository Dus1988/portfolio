export interface ITableAction {
    Name: string;
    Icon: string;
    ActionFn: Function;
    DisplayFn?: Function;
}


export class TableAction implements ITableAction {



    constructor(options?: ITableAction) {
        if (options) {
           const keys = Object.keys(options);
           keys.forEach(key => {
             this[key] = options[key];
           });
        }

        if (!this.ActionFn) {
            this.ActionFn = () => { console.error('action not set up...'); };
        }
        if (!this.DisplayFn) {
            this.DisplayFn = () => true;
        }

        if (!this.Icon) {
            this.Icon = 'question';
        }
        
    }

    Name: string;
    Icon: string;
    ActionFn: Function;
    DisplayFn?: Function;
}
