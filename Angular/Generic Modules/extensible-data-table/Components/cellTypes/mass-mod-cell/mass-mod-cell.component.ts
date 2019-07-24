import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ColumnConfig } from '../../../Models/column-config';
import { CustomFormatter } from '../../../../../@shared/util/custom-util';
import * as moment from 'moment';
import { CellTypes } from '../../../Enums/cell-types.enum';

@Component({
  selector: '[columnMassMod]',
  templateUrl: './mass-mod-cell.component.html',
  styleUrls: ['./mass-mod-cell.component.scss']
})
export class MassModCellComponent implements OnInit {

  @Input()
  public Column: ColumnConfig;

  @Input()
  public Data: Array<any>;

  public _CustomFormatter = CustomFormatter.formatValue;
  public tempDate: any;

  @Output()
  public MassModSaved: EventEmitter<any>;

  public _CellTypes = CellTypes;

  constructor() {
    this.MassModSaved = new EventEmitter();
   }

  ngOnInit() {
  }

  public datepickerChange(date: Date) {
    // debugger;
    if (date) {
      const momentDate = moment(date);
      this.Column.MassModValue = momentDate.format('MM/DD/YYYY');
    }
  }

  public datepickerOpen(datepicker) {
    this.tempDate = moment(this.Column.MassModValue);
    datepicker.openPicker();
  }

  public save() {
    if (this.Column.MassModValue && (this.Column.MassModValue.toString().length > 0)) {
      // const data = ;

      this.Data.forEach((record, i) => {
        // debugger;
        const cell = record[this.Column.ColumnName];
        record[this.Column.ColumnName] = this.Column.MassModValue;
      });

      this.MassModSaved.emit();
    }
  }
}
