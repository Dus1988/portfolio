import { ColumnConfig } from "./column-config";
import { ColumnSort } from "./column-sort";
import { ExtensibleTableComponent } from "../Components/extensible-table/extensible-table.component";
import { RowAction } from "./row-action";
import { TableAction } from "./table-action";
import { HistoricalDataComponent } from "../../../pages/dashboard/tipping-point/historical-data/historical-data.component";

export class ExtensibleTableConfig {

    // Extensible Table Config is designed as a config for the display and action properties of a table
    /** 
     * @description Table Name String. 
     * @defualt ''
     */
    public TableName: string;
    /** 
     * @description Data Array. Store Original Data here.
     */
    public Data: Array<object>;
    /** 
     * @description Data Array. ET's actionable (sort, filter, ect.) data set.
     */
    public FilteredData: Array<object>;
    /** 
     * @description All Columns Object. Should contain a config for every possible column.
     */
    public AllColumns: Object;
    /** 
     * @description Visible Columns Array. Should contain a config for all visible columns. Generated from ColumnStrings
     */
    public Columns: Array<ColumnConfig>;
    /** 
     * @description String Columns Array. Should contain a string for all visible columns.
     */
    public ColumnStrings: Array<string>;
    /** 
     * @description Number of rows to display per page.
     * @defualt 10
     */
    public ItemsPerPage: number;
    /** 
     * @description Boolean to determine if user should see row count dropdown option
     * @defualt true
     */
    public ItemsPerPageConfigurable: boolean;
    /** 
     * @description The current page the table is on
     * @defualt 1
     */
    public CurrentPage: number;
    /** 
     * @description The number of pages in the table. Determined by the Array.length / ItemsPerPage
     */
    public NumPages: Array<number>;
    /** 
     * @description Action for Identifier (1st) Column. If assigned 1st column cells will trigger action event assigned. Else, no click events.
     */
    public IdentifierAction: RowAction;
    /** 
     * @description Tooltip for Identifier (1st) Column.String should be key from dataset.
     */
    public IdentifierTooltip: string;
    /** 
     * @description Column Sort object. Has a order, and a Column reference.
     */
    public Sort: ColumnSort;
    /** 
     * @description Defines whether you can drag and drop columns. Default false;
     */
    public ColumnsOrderable: boolean;
    /** 
     * @description Boolean to auto sort data by identifier column
     * @defualt false
     */
    public AutoSortByIdentifier: boolean;
    /** 
     * @description An array of columns that currently have active filters
     */
    public FilteredCols: Array<ColumnConfig>;
    /** 
     * @description boolean to determine if filters are allowed
     * @defualt true
     */
    public AllowFilters: boolean;
    /** 
     * @description boolean to determine if advanced and multi filters are allowed
     * @defualt false
     */
    public AllowAdvancedFiltering: boolean;
    /** 
     * @description Array of Row Actions to be applied to rows
     */
    public RowActions: Array<RowAction>;
    /** 
     * NOT USED YET.
     * @description If RowActions.length > this, use a dropdown for actions instead
     */
    public MaxRowActionsBeforeDropdown: number;
    /** 
     * @description If table should show totals row
     */
    public ShowTotalsRow: boolean;
    /** 
     * @description If table should show average row
     */
    public ShowAverageRow: boolean;

    /**
     * @description Boolean to determine to show mass mod row
     */
    public enableMassMod: boolean;

    /**
     * @description Array of configurable actions to take on the whole table
     */
    public tableActions: Array<TableAction>;

    //add nbpopover
    //public historicalData: HistoricalDataComponent;

    /**
     * @description Component to show in cell popover (typically history data)
     */
    public popoverComponent;

    public pagingOptions;
    public dictionary: Array<any>;

    constructor() {
        
        this.TableName = '';

        this.Data = [];
        this.FilteredData = [];

        this.Columns = [];
        this.ColumnsOrderable = false;

        this.CurrentPage = 1;
        this.ItemsPerPage = 10;
        this.ItemsPerPageConfigurable = true;
        this.NumPages = Array();

        // this.IdentifierColClickable = false;
        // this.IdentifierTooltip = '';
        // this.IdentifierAction = new RowAction();

        this.AutoSortByIdentifier = false;
        this.Sort = new ColumnSort();
        this.FilteredCols = [];
        this.AllowFilters = true;
        this.AllowAdvancedFiltering = true;
        this.ShowTotalsRow = false;
        this.ShowAverageRow = false;
        this.enableMassMod = false;

        this.RowActions = new Array<RowAction>();
        this.tableActions = new Array<TableAction>();
        this.MaxRowActionsBeforeDropdown = 2;
        this.pagingOptions = [5, 10, 15];

    }
}
