import { FilterTypes } from "../Enums/filter-types.enum";

export class ColumnFilter {

    public Operation: string;
    public Value: string;
    public and: boolean;

    constructor(type: string = FilterTypes.Contains, val: string = '', and: boolean = true) {
        this.Operation = type;
        this.Value = val;
        this.and = and;
    }
}
