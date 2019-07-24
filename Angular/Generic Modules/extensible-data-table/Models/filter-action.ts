import { ColumnConfig } from "./column-config";

export interface FilterAction {
    action: string;
    column: ColumnConfig;
}
