import { DataMapFormatter } from '../../../@core/utils/DataMapFormatter/data-map-formatter.util';
import { ColumnFilter } from './column-filter';
import { SortFunctions } from '../Utils/sort-functions';
import { FilterFunctions } from '../Utils/filter-functions';
import { CloseScrollStrategyConfig } from '@angular/cdk/overlay/typings/scroll/close-scroll-strategy';
import { CellConfig } from './cell-config';
import { AppConfig } from '../../../app.config';
import { IColumns } from '../../../@core/interfaces/data-base-columns.interface';
import { CustomFormatter } from '../../../@shared/util/custom-util';

export interface ColumnOptions {
    ColumnName: string;
    Title?: string;
    DataType?: any;
    Tooltip?: string;
    SortFunction?: Function;
    FilterFunction?: Function;
    FormatCode?: string;
    Filters?: Array<ColumnFilter>;
    ShowRawData?: boolean;
    Cell?: CellConfig;
    ReadAllowed?: boolean;
    EditAllowed?: boolean;
    ShowTotal?: boolean;
    ShowAverage?: boolean;
    ColumnID?: number;
    AvgFormula?: string;
}

export class ColumnConfig implements ColumnOptions {

    /** 
     * @param options: Column Option object (ColumnName, Title?, DataType?, Tooltip?, SortFunction?, FilterFunction?, FormatCode?, Filters?, ShowRawData?, Cell)
     * @param dbColumn: Boolean, default true. Set false to not populate from DB Columns Title, ect.
     */
    constructor(options: ColumnOptions, dbColumn: boolean = true, dictionary: Array<any> = AppConfig.columns) {
        this.Id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.ColumnID = 0;
        this.ReadAllowed = true;
        this.EditAllowed = true;
        this.ShowTotal = false;
        this.ShowAverage = false;
        this.total = '—';
        this.average = '—';
        this.uniqueValues = [];
        this.MassModValue = '';
        Object.keys(options).forEach((key) => {
            this[key] = options[key];
        });
        if (dbColumn) {
            this.Title = DataMapFormatter.mapTitle(this.ColumnName, dictionary);
            this.Tooltip = DataMapFormatter.mapToolTip(this.ColumnName, dictionary);
            this.FormatCode = DataMapFormatter.mapFormat(this.ColumnName, dictionary);
        } else {
            // custom column is not in AppConfig.columns so export does not have access to it 
            // unless we do this. Code makes sure to not add dupe cols.
            if (!AppConfig.columns.some(col => col.Name === this.ColumnName)) {
                const customCol: IColumns = {
                    Name: this.ColumnName,
                    Description: this.Title,
                    Format: this.FormatCode,
                    ToolTip: this.Tooltip,
                    Type: 0,
                };
                AppConfig.columns.push(customCol);
            }
        }
        
        if (!this.FormatCode) {
            console.error('column missing format code:', this.ColumnName ); 
            this.FormatCode = 's';
        }
        this.DataType = this.FormatCode.split('.')[0];
        this.SortFunction = SortFunctions.getSortFunction(this.FormatCode);
        this.FilterFunction = FilterFunctions.getFilterFunction(this.FormatCode);
        
        if (!this.Cell) {
            this.Cell = new CellConfig();
        }

        if (!this.Cell.ColumnName) {
            this.Cell.ColumnName = this.ColumnName;
        }
        
        
        // if (this.DataType === 's' || this.DataType === 'd') {
        //     this.ShowRawData = false;
        // } else {
        //     this.ShowRawData = true;
        // }
        this.ShowRawData = false;

        this.resetFilters();
    }

    public Id: string;
    public ColumnID: number;
    public ColumnName: string;
    public Title: string;
    public DataType: any;
    public Tooltip: string;
    public SortFunction: Function;
    public FilterFunction: Function;
    public FormatCode: string;
    public Filters: Array<ColumnFilter>;
    public ShowRawData: boolean;
    public Cell: CellConfig;
    public ReadAllowed: boolean;
    public EditAllowed: boolean;
    public ShowTotal: boolean;
    public ShowAverage: boolean;

    public rawTotal: number;
    public total: string;
    public rawAverage: number;
    public average: string;
    public uniqueValues: Array<any>;
    public MassModValue: any;
    public AvgFormula: string;
    
    public resetFilters(): void {
        this.Filters = [new ColumnFilter()];
    }

    public checkUniqueValues(data: Array<any>) {
        if (!this.uniqueValues || this.uniqueValues.length === 0) {
            data.forEach((row, i) => {
              const value = row[this.ColumnName];
              if (this.uniqueValues.indexOf(value) === -1) {
                this.uniqueValues.push(value);
              }
            });
          }
    }

    public populateAverage(data) {
        if (!this.ShowAverage) return;
        if (this.AvgFormula) {
            const split = this.AvgFormula.split('/');
            const numerator = split[0];
            const denominator = split[1];

            // get numerator total
            const numTotal = ColumnConfig.calcTotal(data, numerator);
            // get denominator total
            const denomTotal = ColumnConfig.calcTotal(data, denominator);

        } else {

            if ( this.DataType === 'n' || this.DataType === 'c' || this.DataType === 'p' ) {
              this.rawAverage = this.rawTotal / data.length;
              this.average = CustomFormatter.formatValue( this.rawAverage, this.FormatCode );
            }

        }
        
    }

    public populateTotals(data) {
        if ((this.DataType === 'n' || this.DataType === 'c' || this.DataType === 'p')) {
            this.rawTotal = ColumnConfig.calcTotal(data, this.ColumnName);

            if (this.ShowTotal) {
            this.total = CustomFormatter.formatValue(this.rawTotal, this.FormatCode);
            }
        }
    }

    static calcTotal(data, key): number {
        let tot = 0;
        tot = data.reduce((prev, cur) => {
            return Number(prev) + Number(cur[key]);
        }, 0);
        return tot;
    }

    public populateTotalAndAvg(data) {
        this.populateTotals(data);
        this.populateAverage(data);
    }
}
