import { Component, OnInit, AfterViewInit, Input, ContentChildren, ContentChild, TemplateRef, ViewChild, OnChanges, SimpleChanges, OnDestroy, QueryList, ViewChildren, HostListener } from '@angular/core';
// import { GridsterConfig, GridsterItem, GridsterComponent, GridsterItemComponentInterface } from 'angular-gridster2';
import { DashboardConfig } from '../../Models/dashboard-config';
import { IChartConfiguration } from '../../../../@core/interfaces/chart-configuration.interface';
import { ApiService } from '../../../../@core/data/services/api.service';
import { AppConfig } from '../../../../app.config';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { NbSidebarService } from '@nebular/theme';
import { WindowService } from '../../../../@core/data/services/window.service';
import { debounceTime, first } from 'rxjs/operators';
import { GridsterComponent, GridsterOptions, GridsterItemComponent } from 'angular2gridster';
import { NGB_DATEPICKER_DATE_ADAPTER_FACTORY } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { DataTransferService } from '../../../../@core/data/services/data-transfer.service';
import { ObjectCopyUtil } from '../../../../@shared/util/object-copy-util';
import { IGridItemOptions } from '../../Models/igrid-item-options';
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass';
import { ChartDataTransferService } from '../../../../@core/data/services/chart-data-transfer.service';

@Component({
  selector: 'generic-dashboard',
  templateUrl: './generic-dashboard.component.html',
  styleUrls: ['./generic-dashboard.component.scss']
})
export class GenericDashboardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  Config: DashboardConfig;

  @ViewChildren('gridster')
  private gridster: QueryList<GridsterComponent>;
  @ViewChildren(GridsterItemComponent)
  private gridsterItems: QueryList<GridsterItemComponent>;

  @ContentChild('TopContent')
  public topContent: TemplateRef<any>;
  @ContentChild('bottomContent')
  public bottomContent: TemplateRef<any>;

  public options: any;
  public draggableOptions: any;
  // public dashboard: Array<any>;
  public allChartCreation: Array<IChartConfiguration> = [];
  public originalAllChartCreation: Array<IChartConfiguration> = [];
  public clientDemoRead: boolean;
  public roles: Array<any>;
  public ready: boolean;
  public resizing: boolean;
  public toastConfig: ToasterConfig;
  private sideBarSubscription: Subscription;
  private windowResizeSubscriber: Subscription;
  private filterSubscriber: Subscription;
  private chartUpdated: Subject<any>;
  //chartUpdated: BehaviorSubject<any>;
  private updatedCharts: Array<IChartConfiguration>;
  private chartFilter: any;

  dashItemsChanged: Array<any> = [];

  @HostListener('window:resize', ['$event']) onresize(event) {

  }

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private toasterService: ToasterService,
    private sideBarService: NbSidebarService,
    private winService: WindowService,
    private chartDataTransfer: ChartDataTransferService,
    private dataTransfer: DataTransferService,
    ) {
    this.ready = false;
    this.resizing = false;
      
    this.roles = JSON.parse(localStorage.getItem('userRole'));
    const headerHeight = window.document.getElementsByTagName('nb-layout-header')[0].clientHeight;
    const gridHeight = window.document.documentElement.clientHeight - headerHeight;
    this.updatedCharts = [];
    this.chartUpdated = new BehaviorSubject<any>({});

    this.options = {
      lanes: 12,
      direction: 'vertical',
      dragAndDrop: true,
      resizable: true,
      shrink: true,
      floating: true,
      useCSSTransforms: true,
      responsiveSizes: true,
      responsiveDebounce: 300,
      cellHeight: gridHeight / 6,
      responsiveOptions: [
        {
          breakpoint: 'sm',
          minWidth: 0,
          resizable: false,
          dragAndDrop: false,
        },
        {
          breakpoint: 'md',
          minWidth: 768,
          resizable: false,
          dragAndDrop: false,
        },
        {
          breakpoint: 'lg',
          minWidth: 1250,
        },
        {
          breakpoint: 'xl',
          minWidth: 1800,
        }
      ],
      options: { minWidth: 3, minHeight: 3, maxHeight: 5, maxWidth: 12 },
      lines: {
        visible: true,
        always: false,
        color: '#dadada',
        width: 2
        // backgroundColor: 'pink',
      }
    };
    this.draggableOptions = {
      handlerClass: 'drag-handler',
    };
    this.originalAllChartCreation = [];
    this.chartFilter = {};

    //Persists chart filter
    let chartData = this.chartDataTransfer.data.getValue();
    if(chartData && chartData.ChartFilters && chartData.ChartFilters.length > 0){
      let filters:Array<string> = chartData.ChartFilters.map(obj => obj.Value);

      if(filters && filters.length > 0){
        this.makeToast(`Filter: ${filters.toString()}`, 'info', 0, true);
      }
    }
  }

  public chartRemoved(removed, idx) {
    if (removed) {
      // const test = this.gridsterItems.toArray()[idx];
      this.allChartCreation.splice(idx, 1);
      // this.dashboard.splice(idx, 1);
    }
  }

  public dashItemChanged(changed, idx) {
    let hasChanged = false;
    if(!this.clientDemoRead && (changed.breakpoint === 'xl' || changed.breakpoint === 'lg') && Object.keys(this.chartFilter).length === 0) {
      this.allChartCreation[idx].IsDefault = true;
      const dashItem = this.allChartCreation[idx].GridOption;
      changed.changes.forEach((prop: any, index: number) => {
        if (dashItem[prop] !== changed.item[prop]) {
          hasChanged = true;
          dashItem[prop] = changed.item[prop];
        }
      });

      if (hasChanged) {
        this.updatedCharts.push(this.allChartCreation[idx]);
        this.chartUpdated.next();
      }
    }
  }

  //Testing
  // dashItemChanged(changed, idx) {
  //   if(!this.clientDemoRead && (changed.breakpoint === 'xl' || changed.breakpoint === 'lg') && Object.keys(this.chartFilter).length === 0) {
  //     const dashItem = this.allChartCreation[idx].GridOption;
  //     changed.changes.forEach((prop: any, index: number) => {
  //       if (dashItem[prop] !== changed.item[prop]) {
  //         this.allChartCreation[idx].GridOption[prop] = changed.item[prop];
  //         this.allChartCreation[idx].ResetChart = true;

  //         if(index === changed.changes.length - 1){
  //           if(this.allChartCreation[idx].ResetChart){
  //             this.updatedCharts.push(this.allChartCreation[idx]);
  //             this.dashItemsChanged.push(changed);
  //           }
  //         }
  //       }
  //     });

  //     let chartChanging: IChartConfiguration = {};
  //     if(Object.keys(changed.oldValues).length > 0){//Chart Swaps
  //       if(changed.changes.length === 1){
  //         let chart = this.allChartCreation.filter((c) => 
  //         c.GridOption.x === this.allChartCreation[idx].GridOption.x && 
  //         c.GridOption.y === this.allChartCreation[idx].GridOption.y 
  //         && this.allChartCreation[idx].ChartID !== c.ChartID);
  //         if(chart.length > 0){ chartChanging = JSON.parse(JSON.stringify(chart[0])); }
  //       }
  //     }
      
  //     if(idx === (this.allChartCreation.length - 1)){ //All Charts Init
  //       if(this.updatedCharts.length === this.allChartCreation.length){
  //         debugger;
  //         this.chartUpdated.next({});
  //       }
  //     }else{
  //       if(Object.keys(changed.oldValues).length > 0){
  //         if(Object.keys(chartChanging).length === 0){ //Single Chart update
  //           debugger;
  //           this.chartUpdated.next({});
  //         }
  //       }
  //     }
  //   }
  // }

  public reposition(item: any, event: any){
    console.log('positionsChanged', event);
  }

  public getSavedConfigurations(clientDemoOnly: boolean = false): void {
    //this.allChartCreation = [];
    let url;
    if (!this.Config.dashRoute || this.Config.dashRoute === 'home') {
      url = `/atlaas/getSavedClientChartConfigurations/${clientDemoOnly}`;
    } else {
      url = `/atlaas/getClientChartConfigurations/${this.Config.dashRoute}/${clientDemoOnly}/true`;
    }
    this.apiService.getData(url)
    .subscribe((data: Response) => {
        if(data.body) {
          let apiData: Array<IChartConfiguration> = data.body as any;
          this.originalAllChartCreation = apiData;

          if(this.originalAllChartCreation.length > 0){
            this.allChartCreation = ObjectCopyUtil.deepCopy(this.originalAllChartCreation);
            this.populateDash();
          }

          this.ready = true;
        }

        // this.busy = false;
        // this.Ready.emit(this.busy);
    });
  }

  makeToast(message: string, type: string, timeout: number, showCloseButton: boolean) {
    this.toasterService.clear();
    this.showToast(type, 'Notification', message, timeout, showCloseButton);
  }

  public optionsChanged(changes) {
    setTimeout(()=>{
      const headerHeight = window.document.getElementsByTagName('nb-layout-header')[0].clientHeight;
      const gridHeight = window.document.documentElement.clientHeight - headerHeight;
      if (this.gridster.first)
      this.gridster.first.setOption('cellHeight', gridHeight / 6).reload();
    }, 0);
    
  }

  public populateDash() {
    // this.dashboard = [];

    //this.allChartCreation = ObjectCopyUtil.deepCopy(this.originalAllChartCreation);

    if(this.chartFilter.ChartType) {
      if(this.chartFilter.ChartType === 'bar'){
        this.allChartCreation = this.allChartCreation.filter(item => item.ChartType.includes('normal') || item.ChartType.includes('combo'));
      }else{
        this.allChartCreation = this.allChartCreation.filter(item => item.ChartType === this.chartFilter.ChartType);
      }
    }

    if(this.chartFilter.ChartName) {
      this.allChartCreation = this.allChartCreation.filter(item => item.ChartName.toLowerCase().indexOf(this.chartFilter.ChartName.toLowerCase()) > -1);
    }

    if(this.chartFilter.ChartSubtitle) {
      this.allChartCreation = this.allChartCreation.filter(item => item.ChartSubtitle.toLowerCase().indexOf(this.chartFilter.ChartSubtitle.toLowerCase()) > -1);
    }

    this.allChartCreation.forEach((chart, idx) => {
      // let item: IGridItemOptions;
      
      if (!chart.GridOption) {
        if (chart.Size === 3) {
          chart.GridOption = {
            w: 12,
            wSm: 12,
            wMd: 12,
            h: 4,
            x: undefined,
            y: undefined,
            options: this.options.options,
          };
        } else if (chart.Size === 2 || !chart.Size) {
          chart.GridOption = {
            w: 6, 
            wSm: 12,
            wMd: 12,
            h: 4, 
            x: undefined,
            y: undefined,
            options: this.options.options,
          };
        } else {
          chart.GridOption = {
            w: 4,
            wSm: 12,
            wMd: 6,
            h: 4,
            x: undefined,
            y: undefined,
            options: this.options.options,
          };
        }
        // chart.GridOption = item;
      } else {
        const opt = chart.GridOption;

        if (opt.w < 12 && opt.w >= 6) {
          opt.wSm = 12;
        } else if (opt.w < 6) {
          opt.wMd = 6;
          opt.wSm = 12;
        }

        opt.options = opt.options ? opt.options : this.options.options;
        opt.x = opt.x === null ? undefined : opt.x;
        opt.y = opt.y === null ? undefined : opt.y;
      }

      // this.dashboard.push(item);
    });
  }

  showToast(type: string, title: string, body: string, timeout: number, showCloseButton: boolean) {
    this.toastConfig = new ToasterConfig({
      positionClass: 'toast-top-center',
      timeout: timeout,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: 'fade',
      limit: 1,
    });

    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: timeout,
      showCloseButton: showCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml,
      //onHideCallback: (toast) => this.clearFilter(toast)
    };

    this.toasterService.popAsync(toast);
  }

  public toastEmitted(msg: string) {
    if (msg){
      this.makeToast(`Filter: ${msg}`, 'info', 0, true);
    } else {
      this.toasterService.clear();
    }
  }

  subscribeToChartUpdate(){
    this.chartUpdated.pipe(debounceTime(5)).subscribe(() => {
      //debugger;
      if (this.updatedCharts.length > 0) {
        const changes = this.updatedCharts;

        let url = !this.Config.dashRoute || this.Config.dashRoute === 'home' ? `/atlaas/saveClientChartConfigurationOrder` : `/atlaas/saveClientChartConfigurationOrder/false`;

        this.apiService.postJsonData(url, this.updatedCharts, 'application/json').subscribe((res: Array<IChartConfiguration>) => {
          //debugger;
          if (res && res.length > 0) {
            this.updatedCharts.forEach((chart, idx) => {
              const allChart = this.allChartCreation.find((ch, idx) => {
                return ch.ChartID === chart.ChartID;
              });

              const origChart = this.originalAllChartCreation.find((ch, idx) => {
                return ch.ChartID === chart.ChartID;
              });

              const resChart = res.find((ch, idx) => {

                if (ch.ChartID === chart.ChartID) {
                  return true;
                } else {
                  return ch.ClientChartConfigID === chart.ClientChartConfigID 
                  && ch.ChartType === chart.ChartType
                  && ch.Measure === chart.Measure
                  && ch.Dimension === chart.Dimension;
                }
                  
              });

              if (allChart && resChart && (!allChart.GridOption.GridOptionID || allChart.GridOption.GridOptionID !== resChart.GridOption.GridOptionID)) {
                allChart.GridOption.GridOptionID = resChart.GridOption.GridOptionID;
                allChart.ChartID = resChart.ChartID;
                allChart.UserChartConfigurationID = resChart.UserChartConfigurationID;

                origChart.UserChartConfigurationID = resChart.UserChartConfigurationID;
                origChart.ChartID = resChart.ChartID;

                if (origChart.GridOption) {
                  origChart.GridOption.GridOptionID = allChart.GridOption.GridOptionID;
                } else {
                  origChart.GridOption = ObjectCopyUtil.deepCopy(allChart.GridOption);
                }
              }
            });
            this.updatedCharts = [];
          }
        });
      }
    });
  }

  // subscribeToChartUpdate2(){
  //   this.chartUpdated.pipe(debounceTime(5)).subscribe(() => {
  //     if (this.updatedCharts.length > 0) {
  //       let url = !this.Config.dashRoute || this.Config.dashRoute === 'home' ? `/atlaas/saveClientChartConfigurationOrder` : `/atlaas/saveClientChartConfigurationOrder/false`;

  //       this.apiService.postJsonData(url, this.updatedCharts, 'application/json').subscribe((res: Array<IChartConfiguration>) => {
  //         //debugger;
  //         if (res && res.length > 0) {

  //           res.forEach((chart, idx) => {
  //             const origAllChart = this.allChartCreation.find((ch, idx) => { return ch.ClientChartConfigID === chart.ClientChartConfigID; });

  //             if(origAllChart.ClientChartConfigID === chart.ClientChartConfigID){
  //               origAllChart.ResetChart = false;
  //               origAllChart.GridOption = chart.GridOption;
  //               origAllChart.UserChartConfigurationID = chart.UserChartConfigurationID;
  //             }
  //           });

  //           this.updatedCharts = [];
  //           this.originalAllChartCreation = ObjectCopyUtil.deepCopy(this.allChartCreation);
  //         }
  //       });
  //     }
  //   });
  // }

  ngOnInit() {
    this.filterSubscriber = this.dataTransfer.searchCriteria.subscribe((res: IChartConfiguration) => {
      this.chartFilter = res;
      if(this.originalAllChartCreation.length > 0) {
        this.populateDash();
      }
    });

    this.subscribeToChartUpdate();
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clientDemoRead = this.Config.clientGroup == 435 && this.roles && AppConfig.clientDemoReadOnlyRoles.some(e => this.roles.includes(e));
    this.getSavedConfigurations(this.clientDemoRead);
  }

  ngOnDestroy() {
    if (this.sideBarSubscription) {
      this.sideBarSubscription.unsubscribe();
    }
    if (this.windowResizeSubscriber) {
      this.windowResizeSubscriber.unsubscribe();
    }
    if (this.filterSubscriber) {
      this.filterSubscriber.unsubscribe();
    }
  }
}