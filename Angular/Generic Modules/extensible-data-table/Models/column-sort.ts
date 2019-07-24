import { ColumnConfig } from "./column-config";

export class ColumnSort {

    public sortByColumn: ColumnConfig;
    public order: string;

    constructor(col: string = '', ord: string = 'desc') {
        this.sortByColumn = new ColumnConfig({ColumnName: ''});
        this.order = ord;
    }

    public swapSort():void {
        if (this.order === 'desc') {
            this.order = 'asc';
        } else if (this.order === 'asc') {
            // this.order = 'desc';
            this.sortByColumn = new ColumnConfig({ColumnName: ''});
            this.order = 'desc';
        }
    }

}
