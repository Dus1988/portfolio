import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensibleTableComponent } from './Components/extensible-table/extensible-table.component';
import { CellComponent } from './Components/cell/cell.component';
import { HeadersComponent } from './Components/headers/headers.component';
import { HeaderComponent } from './Components/header/header.component';
import { FilterComponent } from './Components/filter/filter.component';
import { PagingControlComponent } from './Components/paging-control/paging-control.component';
import { CheckOverflowDirective } from './Directives/check-overflow.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModalComponent } from './Components/filter-modal/filter-modal.component';
import { DataCellComponent } from './Components/cellTypes/data-cell/data-cell.component';
import { InputCellComponent } from './Components/cellTypes/input-cell/input-cell.component';
import { SelectCellComponent } from './Components/cellTypes/select-cell/select-cell.component';
import { IdentifierCellComponent } from './Components/cellTypes/identifier-cell/identifier-cell.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DropListScrollerDirective } from './Directives/drop-list-scroller.directive';
import { MassModCellComponent } from './Components/cellTypes/mass-mod-cell/mass-mod-cell.component';
import { MaterialDatePickerModule } from '../material-date-picker/material-date-picker.module';

import { NbCardModule, NbThemeModule, NbPopoverModule } from '@nebular/theme';
import { NgxMaskModule } from 'ngx-mask';
//import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  declarations: [ExtensibleTableComponent, CellComponent, HeadersComponent, HeaderComponent, 
    FilterComponent, PagingControlComponent, CheckOverflowDirective, FilterModalComponent, DataCellComponent, 
    InputCellComponent, SelectCellComponent, IdentifierCellComponent, DropListScrollerDirective, MassModCellComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgbModule, 
    ReactiveFormsModule,
    DragDropModule,
    //ThemeModule,
    NbCardModule,
    NbThemeModule,
    //NbBadgeModule,
    NbPopoverModule,
    MaterialDatePickerModule,
    NgxMaskModule,
    //ThemeModule
  ], 
  exports: [ExtensibleTableComponent, CellComponent, HeadersComponent, HeaderComponent, FilterComponent],
  entryComponents: [FilterModalComponent]
})
export class ExtensibleDataTableModule { }
