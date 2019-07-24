import { Component, OnInit, Input, ContentChild, TemplateRef, OnDestroy, ViewChildren, EventEmitter, Output, QueryList } from '@angular/core';
import { IChartConfiguration } from '../../../../@core/interfaces/chart-configuration.interface';
import { CardSizes } from '../../../../@core/Enums/card-sizes.enum';
import { FleetListService } from '../../../../@core/data/services/fleet-list.service';
import { ApiService } from '../../../../@core/data/services/api.service';
import { first, debounceTime } from 'rxjs/operators';
import { ExcelSheet, ExportElementUtil, ExportTypes } from '../../../../@core/data/services/Export/export-element.util';
import { ObjectCopyUtil } from '../../../../@shared/util/object-copy-util';
import { DataMapFormatter } from '../../../../@core/utils/DataMapFormatter/data-map-formatter.util';
import { Subject, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartDataTransferService } from '../../../../@core/data/services/chart-data-transfer.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { ExtensibleTableConfig } from '../../../extensible-data-table/Models/extensible-table-config';
import { ExtensibleTableComponent } from '../../../extensible-data-table/Components/extensible-table/extensible-table.component';
import { ColumnConfig } from '../../../extensible-data-table/Models/column-config';
import { FlipCardActions } from '../../Models/flip-card-actions';
import * as moment from 'moment';
import { HomeComponent } from '../../../../pages/dashboard/dash-layout/home/home.component';

@Component({
  selector: 'gridster-flip-card',
  templateUrl: './gridster-flip-card.component.html',
  styleUrls: ['./gridster-flip-card.component.scss']
})
export class GridsterFlipCardComponent implements OnInit, OnDestroy {

  @Input()
  ClientGroup: number;
  @Input()
  DateFrom: string;
  @Input()
  DateTo: string;
  @Input()
  Model: IChartConfiguration;
  @Input()
  clientDemoRead: boolean;
  @Input()
  Actions: FlipCardActions;

  @Output()
  DataLoaded: EventEmitter<any>;

  @ContentChild('Front')
  public front: TemplateRef<any>; // Injected template for front
  @ContentChild('Back')
  public back: TemplateRef<any>; // Injected template for back
  @ViewChildren('chart')
  public chart: any;
  @ViewChildren('table')
  public table: QueryList<ExtensibleTableComponent>;

  public flipped: boolean; // is card flipped over?
  public slideIn: boolean; // is card slide up active?
  public showMinMax: boolean; // can show min max filters on back?
  public showUnitCounts: boolean; // can show unit counts in chart
  public showUnitCountToggle: boolean;
  public hasUnitCounts: boolean;
  public exporting: boolean; // is currently exporting
  public ready: boolean; // is done with GET call
  public showAction: boolean;

  public originalData: Array<any>;
  public Data: Array<any>; // data for chart view
  public measures: Array<any>; // measures to show in sort 
  public dimensions: Array<any>; // dimensions to show in sort
  public additionalFiltersJSON: any; // filters to add to Model.filterjson on new GET

  public sort: any; // sort object
  public min: number; // min filter
  public max: number; // max filter

  public tableView: boolean;

  public _CardSizes = CardSizes; // access enum values from template view
  public _ExportTypes = ExportTypes; // access enum values from template view
  toastConfig: ToasterConfig;

  public tableConfig: ExtensibleTableConfig;

  public showAddToHome: boolean;
  public addingToHome: boolean;
  
  @Output()
  emitToast: EventEmitter<string>;
  @Output()
  ChartRemoved: EventEmitter<any>;

  constructor(
    private FleetService: FleetListService,
    private apiService: ApiService,
    public ExportUtil: ExportElementUtil,
    private router: Router,
    private route: ActivatedRoute,
    private chartDataTransfer: ChartDataTransferService,
  ) {
    this.flipped = false;
    this.slideIn = false;
    this.exporting = false;
    this.ready = false;
    this.showUnitCounts = false;
    this.tableView = false;
    this.measures = [];
    this.dimensions = [];
    this.additionalFiltersJSON = [];
    this.emitToast = new EventEmitter();
    this.ChartRemoved = new EventEmitter();
    this.showAction = true;
    this.DataLoaded = new EventEmitter();
    this.showAddToHome = this.route.component !== HomeComponent;
    this.addingToHome = false;
  }

  ngOnInit() {
    if (!this.Actions) {
      this.Actions = {
        export: true,
        tableView: true,
        sort: true,
        flip: true,
        save: false,
      };
    } 

    this.showMinMax = this.Model.ChartType !=='pie' && this.Model.ChartType !== 'gauge' && this.Model.ChartType !== 'gaugeV2'  && this.Model.ChartType !== 'stacked bar';


    this.chartDataTransfer.data.subscribe((res: IChartConfiguration) => {

      if (res.ChartInteraction && this.Model.ChartID !== res.ChartID) {

        let currentFilter;

        if (this.Model && this.Model.FilterJSON) {
          currentFilter = JSON.parse(this.Model.FilterJSON);
        }

        const newFilter = JSON.parse(res.FilterJSON);

        //Add to newFilter if currentFilter exists
        if (currentFilter) {
          this.additionalFiltersJSON.push({
            Dimension: res.Dimension,
            Value: res.ChartValue,
          });
        }

        this.Model.ClientGroup = res.ClientGroup;
        this.Model.DateFrom = res.DateFrom;
        this.Model.DateTo = res.DateTo;
        
        this.getData();
      } else if (res.ResetChart) {
        this.additionalFiltersJSON = [];
        this.getData();
      } else if (this.Model && this.Model.ChartID === res.ChartID) {
        this.additionalFiltersJSON = res.ChartFilters;
        // this.ready = false;
        // setTimeout(() => {
        // this.ready = true;
        // }, 0);
      }

    });

    this.getData();

  }

  public addToHome() {
    this.addingToHome = true;
    this.apiService.postJsonData('/atlaas/addClientChartConfiguration', this.Model, 'application/json')
      .subscribe((data: any) => {
        this.addingToHome = false;
        if(data){
          // this.makeToast('Notification', 'Chart added to Home Dash.', 'success');
          console.log('successfully added to home');
        }else{
          // this.makeToast('Notification', 'Unable to add to Home Dash.', 'error');
          console.log('failed to add to home');
        }
      });
  }

  public clearMinMax() {
    this.min = undefined;
    this.max = undefined;
    this.updateData();
  }

  clearFilter() {
    this.chartDataTransfer.sendData({ResetChart: true});
    this.emitToast.emit('');
    // this.makeToast('Filter removed', 'success', 3000, false);
    // localStorage.removeItem("individualColor");
  }

  public chartClicked(activeElems: Array<any>) {
    if(activeElems.length > 0 && !this.router.url.includes('settings')){
      let elemSelected = this.additionalFiltersJSON.find(prop => prop.Value === activeElems[0]._model['label']);
      if(!elemSelected) {

        //console.log('chartElement', activeElems, this.additionalFiltersJSON);
        this.additionalFiltersJSON.push({Dimension: this.Model.Dimension, Value: activeElems[0]._model['label']});

        const selectedFilters = this.additionalFiltersJSON.map(prop => prop.Value).toString();
        this.emitToast.emit(selectedFilters);

        const data: IChartConfiguration = {
          ClientGroup: this.ClientGroup.toString(),
          DateTo: this.DateTo, //present
          DateFrom: this.DateFrom, //past
          Dimension: this.Model.Dimension,
          FilterJSON: this.Model.FilterJSON,
          ChartID: this.Model.ChartID,
          ChartInteraction: true,
          ChartValue: activeElems[0]._model['label'],
          ChartFilters: this.additionalFiltersJSON,
        };

        //console.log('comboBarData', data);
        this.chartDataTransfer.sendData(data);
      }
    }
  }

  public editChart() {
    // debugger;
    const url = `../home/settings/chart/edit/${this.Model.ChartID}`;
    this.router.navigate([url]);
  }

  public exportChartToImage(type: string) {
    this.ExportUtil.exportToImage(type,'export-' + this.Model.ChartID, this.Model.ChartName + '-' + this.Model.ChartSubtitle, this.DateFrom, this.DateTo );
  }

  public exportChartToXLSX(): void {
    if (!this.exporting) {
      const data = JSON.parse(JSON.stringify(this.originalData));
      this.exporting = true;
      if (this.Model.ChartType === 'pie') {
        // If chart is of type PIE we want to show the percentage.
        // As percentage is not returned from the DB or stored on the this.Model,
        // we have to calc it here.
        let total = 0;
        let measure = '';
        // find the key that is not the memeber caption
        // store so we dont have to itterate over each objects keys later
        Object.keys(data[0]).forEach((key) => {
          if (key.indexOf('MEMBER_CAPTION') < 0) {
            measure = key;
          }
        });
        // Calculate the total value first
        data.forEach((datum) => {
          total += Number(datum[measure]);
        });
        // calcuate the ratio of current / total and store on export data
        data.forEach((datum) => {
          const calc = (parseFloat(datum[measure].toString()) / total) * 100;
          datum['Percent'] = Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(Number(calc)) + '%';
        });
      }
      // debugger;
      const fileName = this.Model.ChartName + '-' + this.Model.ChartSubtitle;
      this.FleetService.FleetListAvailable.pipe(first()).subscribe(() => {
        const sheets: Array<ExcelSheet> = [];
        const chart: ExcelSheet = new ExcelSheet(fileName, <Array<any>> data);
        const chartFilters = JSON.parse(this.Model.FilterJSON);
        const filters = [];
        chartFilters.Filters.Record.forEach((filter) => {
          filters.push(filter.Value);
        });
        chart.Filters = filters;
        const fl: ExcelSheet = this.FleetService.FullFleetList;
        fl.Name = 'Fleet List';
        fl.Filters = this.FleetService.filtersExport;
        sheets.push(chart, fl);
        this.ExportUtil.exportDataToXLSX(sheets, fileName, this.DateFrom, this.DateTo).pipe().subscribe(() => {
          this.exporting = false;
        });
      });
      this.FleetService.getFleetList();
    }
    
  }

  public filterMinMax(arr: Array<any> = this.originalData)  {

    let removeSets = [];
    const newDataSet: Array<any> = ObjectCopyUtil.deepCopy(arr);

    newDataSet.forEach((set, i) => {

      Object.keys(set).forEach((key) => {
        if (key.indexOf('MEMBER_CAPTION') !== -1) return;
        const num = Number(set[key]);
        if ((this.min && num < this.min) || (this.max && num > this.max) ) {
          // newDataSet[i][key] = null;
          if (this.showUnitCounts && key === 'Units_Count') return;
          delete newDataSet[i][key];
        }
      });

      //check if the dimension should still be in the data
      // essentially, does it still contain the necessary data
      const newKeys = Object.keys(set);
      if ((newKeys.length < 2 && !this.showUnitCounts) || (newKeys.length < 3 && this.showUnitCounts)) {
        // this set has no measures left after filtering so remove the set
        removeSets.push(i);
      }
    });

    // makes sure to order indexes to remove in descending order
    // this is important because if you loop through and splice on lower 
    // indexes before higher ones, the index's will be off and you will get the wrong items spliced out
    removeSets = removeSets.sort((a, b) => {
      if (a > b) {
        return -1
      } else if (a > b ) {
        return 1;
      } else {
        return 0;
      }
    });

    // remove sets from dataset
    removeSets.forEach((setIndex) => {
      newDataSet.splice(setIndex, 1);
    });
    
    if (this.sort.sortBy) {
      this.sortFunction(newDataSet);
    } else {
      // this.Data = newDataSet;
      this.updateData(newDataSet, false);
    }
  }

  public refreshChart(updateData: boolean = false) {
    if (updateData) {
      this.getData();

    } else {
      this.ready = false;
      setTimeout(() => {
      this.ready = true;
    }, 0);
    }
    
  }

  public removeChart() {
    this.apiService.getData(`/atlaas/removeClientChartConfiguration/${this.Model.ChartID}`)
    .pipe(first()).subscribe((data: Response) => {
      // let removed: boolean = data.body as any;
        this.ChartRemoved.emit(data.body);
    });
  }

  public sortBy(sortBy: any) {

    const newDataSet: Array<any> = ObjectCopyUtil.deepCopy(this.originalData);

      if (this.sort.sortBy === sortBy) {
        if (this.sort.order === 'desc') {
          this.sort.order = 'asc';
        } else if (this.sort.order === 'asc') {
          this.sort = {
            order: 'desc',
            sortBy: '',
          };
        }
      } else {
        this.sort.sortBy = sortBy;
      }

      
      if (this.min || this.max) {
        this.filterMinMax(newDataSet);
      } else {
        this.sortFunction(newDataSet);
      }
  }

  private sortFunction(newDataSet: Array<any>) {
    if (!this.sort.sortBy) {
      // this.Data = newDataSet;
      this.updateData(newDataSet, false);
    } else {
      const data = newDataSet.sort((a, b) => {
        const numA = Number(a[this.sort.sortBy]);
        const numB = Number(b[this.sort.sortBy]);
        if (!isNaN(numA) && !isNaN(numB)) {
            if (numA > numB) {
              if (this.sort.order === "desc") {
                return -1;
              } else return 1;
            } else if (numA < numB) {
              if (this.sort.order === "desc") {
                return 1;
              } else return -1;
            } else {
              return 0;
            }
        } else {
          const isDate = moment(a[this.sort.sortBy]).isValid();

          if (isDate) {
            const aDate = moment(a[this.sort.sortBy]);
            const bDate = moment(b[this.sort.sortBy]);
            if (aDate.isAfter(bDate)) {
              if (this.sort.order === "desc") {
                return -1;
              } else return 1;
            } else if (aDate.isBefore(bDate)){
              if (this.sort.order === "desc") {
                return 1;
              } else return -1;
            } else {
              return 0;
            }
          } else {
            if (a[this.sort.sortBy] > b[this.sort.sortBy]) {
              if (this.sort.order === "desc") {
                return -1;
              } else return 1;
            } else if (a[this.sort.sortBy] < b[this.sort.sortBy]) {
              if (this.sort.order === "desc") {
                return 1;
              } else return -1;
            } else {
              return 0;
            }
          }
        }
      });
      this.updateData(newDataSet, false);
    }
  }

  public getData() {
    this.dimensions = [];
    this.measures = [];
    this.sort = {
      order: 'desc',
      sortBy: '',
    };
    //this.ready = false;
    let filters;
    if (this.additionalFiltersJSON.length > 0) {
      filters = JSON.parse(this.Model.FilterJSON);

      this.additionalFiltersJSON.forEach((filter) => {
        filters.Filters.Record.push(filter);
      });
    }
    const body = new URLSearchParams();
    body.set('ClientId', this.ClientGroup.toString());
    body.set('DateFrom', this.DateFrom);
    body.set('DateTo', this.DateTo);
    body.set('Dimension', this.Model.Dimension);
    body.set('Measure', this.Model.Measure);
    body.set('FilterJSON', filters ? JSON.stringify(filters) : this.Model.FilterJSON);

    this.apiService.postData('/diagram/getCubeData/28', body).pipe(first()).subscribe((data: Response) => {
      const apiData: Array<any> = data.body as unknown as Array<any>;
      this.originalData = apiData;
      this.showUnitCounts = true;

      if (this.originalData && this.originalData.length > 0) {
        const keys = Object.keys(this.originalData[0]);
        // if unit counts is the only measure, do not display unit count toggle
      // do include unit_counts in chart
      // fuzzy logic: if showUnitsCounts === false, hide toggle and show data in chart
      // if true, show toggle and hide data in chart

      this.hasUnitCounts = keys.indexOf('Units_Count') !== -1;
      this.showUnitCountToggle = false;

      if (this.hasUnitCounts && 
      keys.length > 2 && 
      (this.Model.ChartType === 'combo bar' || this.Model.ChartType === 'normal bar') ) {
        this.showUnitCounts = false;
        this.showUnitCountToggle = true;
      } 

      keys.forEach((key) => {
        if (key.indexOf('MEMBER_CAPTION') !== -1){
          // this is a dimension
          const split = key.replace('MEMBER_CAPTION', '').split('_');
          let title = '';
          split.forEach((s, i) => {
            if (title.indexOf(s) === -1) {
              title += s;
              if (i !== split.length - 1)
              title += ' ';
            }
          });
          const dimension = {
            name: key,
            title: title,
          }
          this.dimensions.push(dimension);
        } else if (key !== 'Units_Count' || (key === 'Units_Count' && this.showUnitCounts)) {
            const measure = {
              name: key,
              title: DataMapFormatter.mapTitle(key)
            };
            this.measures.push(measure);
        }
      });

      this.tableConfig = new ExtensibleTableConfig();
      this.tableConfig.TableName = this.Model.ChartName + ' | ' + this.Model.ChartSubtitle;
      this.tableConfig.ItemsPerPage = 0;
      this.tableConfig.ItemsPerPageConfigurable = false;
      this.tableConfig.AllColumns = {};
      this.tableConfig.AllowAdvancedFiltering = true;

      Object.keys(this.originalData[0]).forEach((key, i) => {
        let col;
        if (key.indexOf('MEMBER_CAPTION') !== -1){
          let k = key.replace('MEMBER_CAPTION', '');
          const strings = k.split('_');
          let title = '';
          strings.forEach(( str, idx) => {
            if (idx !== 0) {
              str = ' ' + str; 
            }
            if (title.indexOf(str) === -1) {
              title += str;
            }
          });
          col = new ColumnConfig({
            ColumnName: key,
            Title: title,
            FormatCode: 's',
          }, false);
        } else if (key === 'Units_Count') {
          col = new ColumnConfig({ColumnName: key, Title: DataMapFormatter.mapTitle(key), FormatCode: 'n'}, false);
        }else {
          col = new ColumnConfig({ColumnName: key, Title: DataMapFormatter.mapTitle(key), FormatCode: this.Model.Format}, false);
        }
        this.tableConfig.AllColumns[key] = col;
      });

      if (this.Model.ChartType === 'pie'){
        this.tableConfig.AllColumns['Percent'] = new ColumnConfig({
        ColumnName: 'Percent',
        Title: 'Percent',
        FormatCode: 'p.2md',
      }, false);
      }
      
      }
      
      this.updateData();
      this.DataLoaded.emit(true);
      
    });
  }

  public toggleTableView() {
    this.tableView = !this.tableView;
    if (this.tableView) {
      setTimeout(() => {
        if (this.Model.ChartType === 'pie') {
          const data = ObjectCopyUtil.deepCopy(this.originalData);
          let total = 0;
          let measure = '';
          Object.keys(data[0]).forEach((key, i) => {
            if (key.includes('MEMBER_CAPTION')) return;
            data.forEach((dataset, idx) => {
              measure = key;
              total += Number(dataset[key]);
            });
          });
          data.forEach((set, i) => {
            set['Percent'] = Number(set[measure]) / total;
          });
          this.table.first.load(data, Object.keys(data[0]));
        } else {
          this.table.first.load(this.originalData, Object.keys(this.originalData[0]));
        }
        
      }, 100);
      
    }
  }

  public toggleUnitCounts() {
    this.showUnitCounts = !this.showUnitCounts;
    this.updateData();
  }

  // manipulates data to be shown
  public updateData(newDataSet = ObjectCopyUtil.deepCopy(this.originalData), manipulate: boolean = true) {

    if (this.hasUnitCounts && !this.showUnitCounts) {
      newDataSet.forEach((set, i) => {
        if (set['Units_Count']){
          delete newDataSet[i]['Units_Count'];
        }
      });
    }

    if (manipulate && (this.max || this.min)) {
      this.filterMinMax(newDataSet);
    } else if (manipulate && this.sort.sortBy) {
      this.sortFunction(newDataSet);
    } else {
      this.Data = newDataSet;
      //this.ready = true;
    }
    this.ready = true;
  }

  ngOnDestroy() {
  }

}
