import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GridsterModule } from 'angular-gridster2';
import { GridsterModule } from 'angular2gridster';
import { GenericDashboardComponent } from './Components/generic-dashboard/generic-dashboard.component';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../@shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { GridsterFlipCardComponent } from './Components/gridster-flip-card/gridster-flip-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { ExtensibleDataTableModule } from '../extensible-data-table/extensible-data-table.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GenericDashboardComponent, GridsterFlipCardComponent],
  imports: [
    ThemeModule,
    GridsterModule.forRoot(),
    SharedModule,
    NgbModule,
    ExtensibleDataTableModule,
    ToasterModule.forChild(),
    RouterModule,
  ],
  exports: [GenericDashboardComponent, GridsterFlipCardComponent],
})
export class GenericDashboardModule { }
