/**
 * *Extensible Table
 * The Extensible Table is designed to be built upon, and is therefore generic in nature.
 * > It is designed to typically have a parent component that acts as a custom logic wrapper.
 * 
 * It can have header and footer sections injected into it using ng-templates with repective #HeaderTemplate and #FooterTemplate refs. 
 * > IMPORTANT NOTE: Injected Templates logic exists in parent logic wrapper component
 * 
 * 
 */

import { Component, OnInit, Input, ContentChild, TemplateRef, Output, EventEmitter, ViewEncapsulation, SimpleChanges, OnChanges, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ExtensibleTableConfig } from '../../Models/extensible-table-config';
import { ColumnConfig } from '../../Models/column-config';
import { DataMapFormatter } from '../../../../@core/utils/DataMapFormatter/data-map-formatter.util';
import { FilterAction } from '../../Models/filter-action';
import { FilterTypes } from '../../Enums/filter-types.enum';
import { CustomFormatter, CustomSortFilter } from '../../../../@shared/util/custom-util';
import { filter } from 'rxjs/operators';
import { ColumnFilter } from '../../Models/column-filter';
import { RowAction } from '../../Models/row-action';
import { KeyEventsPlugin } from '@angular/platform-browser/src/dom/events/key_events';
import { Row } from '../../Models/row';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { compileComponent } from '@angular/core/src/render3/jit/directive';

@Component({
  selector: 'extensible-table',
  templateUrl: './extensible-table.component.html',
  styleUrls: ['./extensible-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExtensibleTableComponent implements OnInit {

  @ContentChild('HeaderTemplate')
  public InjectedHeaderTemplate: TemplateRef<any>;
  @ContentChild('FooterTemplate')
  public InjectedFooterTemplate: TemplateRef<any>;
  @ViewChildren('header')
  public headers: QueryList<ElementRef>;
  public headerMinHeight: number;

  @Input()
  public Config: ExtensibleTableConfig;
  @Input()
  public busy: boolean;

  @Output()
  public VisibleDataChanged: EventEmitter<any>;
  @Output()
  public FilteredDataChanged: EventEmitter<any>;
  @Output()
  public OpenDetails: EventEmitter<any>;
  @Output()
  public RowActionClicked: EventEmitter<any>;
  @Output() 
  public ColumnDropped: EventEmitter<any>;
  @Output() 
  public MassModEdits: EventEmitter<any>;

  public Rows: Array<Row>;
  public RowCountClass: string;

  public _CustomFormatter = CustomFormatter.formatValue;


  // tabName: string;

  constructor() {
    this.Rows = [];
    this.headerMinHeight = 0;
    // this.OpenDetails = new EventEmitter();
    this.VisibleDataChanged = new EventEmitter();
    this.FilteredDataChanged = new EventEmitter();
    this.RowActionClicked = new EventEmitter();
    this.ColumnDropped = new EventEmitter();
    this.MassModEdits = new EventEmitter();
  }

  public assignSort(col: ColumnConfig, getDataAfter: boolean = true): void {
    // Assign Sort will assign the sort or flip the order if the sort is already active
    
    if (this.Config.Sort.sortByColumn === col) {
      this.Config.Sort.swapSort();
    } else {
      this.Config.Sort.sortByColumn = col;
      this.Config.Sort.order = 'desc';
    }

    if (getDataAfter){
      this.getFilteredData(false);
    }

    // debugger;
    if (!this.Config.Sort.sortByColumn.ColumnName){
      this.calculateHeaderHeight();
    } else {
      this.calculateHeaderHeight(false);
    }
    
  }

  public applySort(): void {
    // Apply sort is called after we have the filtered down data
    // if the sorted column does not exist in the data set, or there is no sorted column, do nothing.
    const key = this.Config.Sort.sortByColumn.ColumnName;
    const existsInData: boolean = this.Config.Data && this.Config.Data.length > 0 && this.Config.Data[0][key] !== undefined;
    if (key === '' || !existsInData) {
      this.Config.Sort.sortByColumn = new ColumnConfig({ColumnName: ''});
      return;
    };
    this.Config.FilteredData.sort((a, b) => this.Config.Sort.sortByColumn.SortFunction(a, b, key, this.Config.Sort.order, this.Config.Sort.sortByColumn.FormatCode));
  }

  public clearAllFilters(): void {
    // clears all filters
    this.Config.FilteredCols.forEach((col) => {
      col.resetFilters();
    });
    this.Config.FilteredCols = [];
    this.getFilteredData();
  }

  public calculateHeaderHeight(reset: boolean = true): void {
    // function calculates the tallest header and sets all headers to the same height
    if (reset) {
      this.headerMinHeight = 35;
    }
    setTimeout(() => {
      this.headers.forEach((ref) => {
        const height = Math.ceil(ref.nativeElement.clientHeight);
        if (height > this.headerMinHeight) {
          this.headerMinHeight = height;
        }
      });
    }, 0);
    
  }

  public checkUniqueValues(col: ColumnConfig) {
      if (!col.uniqueValues || col.uniqueValues.length === 0) {
        this.Config.FilteredData.forEach((row, i) => {
          const value = row[col.ColumnName];
          if (col.uniqueValues.indexOf(value) === -1) {
            col.uniqueValues.push(value);
          }
        });
      }
  }

  public checkAllRowsActions() {
    this.Rows.forEach((row) => {
      row.checkActionsConditions();
    });
  }

  public createColumns(): void {
    // * Creates Display Columns based on string array, Seperating this from the data Columns.
    const oldCols = this.Config.Columns;
    this.Config.Columns = [];

    this.Config.ColumnStrings.forEach((key: string) => {
      // this.Config.Columns.push(cols[key]);
      let col;
      if (this.Config.AllColumns[key]) {
        col = this.Config.AllColumns[key];
      }

      if (col) {
        this.Config.Columns.push(col);
        if (this.Config.AutoSortByIdentifier && (this.Config.Sort.sortByColumn.ColumnName === '' || this.Config.Sort.sortByColumn.ColumnName !== this.Config.Columns[0].ColumnName)) {
          this.assignSort(this.Config.Columns[0], false);
        }
      } else {
        console.error('Column not found: ' + key);
      }
    });

    if (this.Config.Columns.some((col) => { return col.ShowTotal })) {
      this.Config.ShowTotalsRow = true;
    }

    if (this.Config.Columns.some((col) => { return col.ShowAverage })) {
      this.Config.ShowAverageRow = true;
    }
    
    this.getFilteredData();
  }

  public drop(event: CdkDragDrop<string[]>) {
    // drop event from drag and drop angular CDK, moves the item in the array to location dropped.
    // debugger;
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.Config.ColumnStrings, event.previousIndex + 1, event.currentIndex + 1);
      this.createColumns();
      this.ColumnDropped.emit();
    }
  }

  public filterChanged(evt: FilterAction): void {
    // logic to determine if a filter on a column should be removed or created/updated
    const idx = this.Config.FilteredCols.indexOf(evt.column);
    if (evt.action === 'clear' && idx > -1) {
      this.Config.FilteredCols.splice(idx, 1);
    } else if (evt.action === 'update'){
      if (idx > -1){
        this.Config.FilteredCols[idx] = evt.column;
      } else {
        this.Config.FilteredCols.push(evt.column);
      }

    }
    this.getFilteredData(false);
  }
  
  public getDisplaySet(updateHeaderHeight: boolean = true): void {
    // this function gets the current display set, based on the number of rows per page and current page number.

    if (this.Config.ItemsPerPage !== 0) {
      // Gets the display set of rows based on config pagination and formats the display set
    const start = (this.Config.ItemsPerPage * this.Config.CurrentPage) - this.Config.ItemsPerPage;
    const end = start + this.Config.ItemsPerPage;
    const rawDisplayData = JSON.parse(JSON.stringify(this.Config.FilteredData.slice(start, end)));
    // const displayData = DataMapFormatter.mapAndFormat(JSON.parse(JSON.stringify(rawDisplayData)));
    this.Rows = [];

    rawDisplayData.forEach((data: any, i: number) => {
      const newRow = new Row({
        originalData: rawDisplayData[i],
        raw: JSON.parse(JSON.stringify(rawDisplayData[i])),
      });
      this.Rows.push(newRow);
    });

    this.actionsSetVisibility();
    if (updateHeaderHeight){
      this.calculateHeaderHeight();
    }

    this.VisibleDataChanged.emit(); // let the parent know that data has changed
    } else {
      const rawDisplayData = JSON.parse(JSON.stringify(this.Config.FilteredData));
    // const displayData = DataMapFormatter.mapAndFormat(JSON.parse(JSON.stringify(rawDisplayData)));
    this.Rows = [];

    rawDisplayData.forEach((data: any, i: number) => {
      const newRow = new Row({
        originalData: rawDisplayData[i],
        raw: JSON.parse(JSON.stringify(rawDisplayData[i])),
      });
      this.Rows.push(newRow);
    });

    this.actionsSetVisibility();
    if (updateHeaderHeight) {
      this.calculateHeaderHeight();
    }

    this.VisibleDataChanged.emit(); // let the parent know that data has changed
    }

  }

  public getFilteredData(updateHeaderHeight: boolean = true):void {
    // creates a deep copy of config's data set and filters down on it before calling functions to apply sort order and pagecount
    // this.removeUnusedColumnFilters();
    this.Config.FilteredData = JSON.parse(JSON.stringify(this.Config.Data));
    if (this.Config.FilteredCols.length > 0){
      this.Config.FilteredCols.forEach((col, idx) => {
        const filters = col.Filters;
        filters.forEach((filter, i) => {

          this.Config.FilteredData = this.Config.FilteredData.filter((item) => {
            const value = item[col.ColumnName];
            return col.FilterFunction(value, filter.Value, filter.Operation);
          });

          // switch (filter.Operation) {
          //   case (FilterTypes.Contains): {
          //     this.Config.FilteredData = this.Config.FilteredData.filter((item) => {
          //       const value = item[col.ColumnName];
          //       // return CustomSortFilter.FormattedFilter(value, filter.Value);
          //       const keep = col.FilterFunction(value, filter.Value, filter.Operation);
          //       if (keep === true) debugger;
          //       return keep;
          //     });
          //     break;
          //   }
          //   case (FilterTypes.EndsWith): {
          //     break;
          //   }
          //   default: {
          //     break;
          //   }
          // }
        });
      });
    }

    

    if (this.Config.ShowTotalsRow || this.Config.ShowAverageRow) {
      this.populateTotals();
    }

    if (this.Config.ShowAverageRow) {
      this.populateAverage();
    }

    this.applySort();
    this.getPageCount();
    this.FilteredDataChanged.emit();
    this.getDisplaySet(updateHeaderHeight);
  }

  public getPageCount(): void {
    // determines the number pf pages nescessary to house all the the rows in the filtered data set.
    if (this.Config.ItemsPerPage === 0) {
      this.Config.NumPages = [1];
      this.Config.CurrentPage = 1;
    } else {
      // calculates the number of pages needed for the filtered data set
      let nums = this.Config.FilteredData.length / this.Config.ItemsPerPage;
      if (nums % 1 !== 0) {
        nums = Math.trunc(nums);
        nums++;
      }
    
      this.Config.NumPages = Array(nums).fill(0).map((item, index) => 1 + index);
      if (nums === 0) {
        this.Config.CurrentPage = 0;
      } else if (this.Config.CurrentPage === 0) {
        this.Config.CurrentPage = 1;
      } else if (this.Config.CurrentPage > this.Config.NumPages.length) {
        this.Config.CurrentPage = this.Config.NumPages.length;
      }
    }
    
  }

  public insertMassModValue(val: string, col: ColumnConfig) {
    col.MassModValue = val;
  }

  public ItemsPerPageChange(rowCount: string) {
    // user changed the number of items per page, so reinitialize the view
    this.Config.ItemsPerPage = Number(rowCount);
    window.localStorage.setItem(this.Config.TableName + '-RowCount', rowCount);
    this.getPageCount();
    this.setRowCountClass();
    this.getDisplaySet();
  }

  //First Param: Should be all columns
  //Second Param: Should be active columns
  public load(data: Array<any>, cols: Array<string>): void {
    // main entry point for updating data. Pass a data set and a Array<string> of column names.
    // Having a string[] of colNames allows to pass in as much data as we want but still control what data is displayed on the table
    this.Config.Data = data;
    this.Config.ColumnStrings = cols;
    this.createColumns();
  }

  public reLoad():void {
    // will reinitialize the table's view by getting a new set of filtered data. 
    // useful when a change to the dataset or row actions has occured.
    this.getFilteredData(false);
  }

  public massModSave( evt , col: ColumnConfig) {
      this.MassModEdits.emit(col);
  }

  public openDetailView(row: any) {
    // emits to the parent element so that it can handle the details component
    this.OpenDetails.emit(row);
  }

  public populateAverage() {
    this.Config.Columns.forEach((col, i) => {

      // if (!col.ShowAverage) return;
      // if (col.DataType === 'n' || col.DataType === 'c' || col.DataType === 'p') {
      //   col.rawAverage = col.rawTotal / this.Config.FilteredData.length;
      //   col.average = CustomFormatter.formatValue(col.rawAverage, col.FormatCode);
      // }
      col.populateAverage(this.Config.FilteredData);
    });
  }

  public populateTotals() {
    // set column total based on filtered data set
    this.Config.Columns.forEach((col, i) => {
      // if ((col.DataType === 'n' || col.DataType === 'c' || col.DataType === 'p')) {
      //   col.rawTotal = 0;
      //   col.rawTotal = this.Config.FilteredData.reduce((prev, cur) => {
      //     return Number(prev) + Number(cur[col.ColumnName]);
      //   }, 0);

      //   if (col.ShowTotal){
      //     col.total = CustomFormatter.formatValue(col.rawTotal, col.FormatCode);
      //   }
      // }
      col.populateTotals(this.Config.FilteredData);
    });
  }

  public setDisplaySet(set: string | number): void {
    // user changed pages so reinitialize the view
    if (!isNaN(Number(set))){
      this.Config.CurrentPage = <number>set;
    } else {
      if (set === '-') {
        this.Config.CurrentPage--;
      } else if (set === '--') {
        this.Config.CurrentPage = 1;
      } else if (set === '+') {
        this.Config.CurrentPage++;
      } else if (set === '++') {
        this.Config.CurrentPage = this.Config.NumPages.length;
      }
    }

    this.getDisplaySet(false);
    
  }

  public setRowCountClass(): void {
    // changes the css class the table body gets so that it is only large enough to fit the number of rows in the config
    // this class sets a min height so that the page does not jump around when changing data sets
      switch(this.Config.ItemsPerPage){
        case 0: {
          this.RowCountClass = 'no-paging';
          break;
        }
        case 5: {
          this.RowCountClass = 'r5';
          break;
        }
        case 10: {
          this.RowCountClass = 'r10';
          break;
        }
        case 15: {
          this.RowCountClass = 'r15';
          break;
        }
        case 25: {
          this.RowCountClass = 'r25';
          break;
        }
        default: {
          this.RowCountClass = '';
          break;
        }
      }
  }

  public removeUnusedColumnFilters(): void {
    // deprecated I think. 
    const filters = this.Config.FilteredCols;
    this.Config.FilteredCols = [];

    filters.forEach((f) => {
      if (this.Config.Columns.some(col => col.ColumnName === f.ColumnName)){
        this.Config.FilteredCols.push(f);
      }
    });
  }

  public actionClicked(Action: RowAction, row: Row): void {
    // user clicked on a row action, this emits out to the parent to handle the custom implementation
    if (Action.emitOnAction){

    this.RowActionClicked.emit({action: Action.ActionName, row: row});
    } else {
      Action.ActionFunction(row);
      this.actionsSetVisibility();
    }
  }

  public identifierClicked(evt: any) {
    this.actionClicked(evt.Action, evt.Row);
  }

  public actionsSetVisibility(): void {
    // determines which defined row actions should appear for each row, allowing each row to run a conditional check on each action
    this.Rows.forEach((row: Row, idx: number) => {
      const actions = [];
      this.Config.RowActions.forEach((action: RowAction, i: number) => {
        let show = true;
        if (action.ConditionFunction) {
          show = action.ConditionFunction(row);
        }

        if (show) {
          actions.push(action);
        }
      });
      row.actions = actions;
    });
  }

  public trackByFn(index) {
    return index;
  }

  ngOnInit() {
    this.setRowCountClass();
    // console.log('smart table', this);
  }
}