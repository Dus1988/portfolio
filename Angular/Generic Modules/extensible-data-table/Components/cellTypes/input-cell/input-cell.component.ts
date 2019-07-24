import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CellComponent } from '../../cell/cell.component';
import { NgForm, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { CustomFormatter } from '../../../../../@shared/util/custom-util';
import { init } from 'echarts';
import { DatumFormats } from '../../../../../@core/utils/DataMapFormatter/data-formats.enum';
import { FormatCodes } from '../../../../../@core/Enums/format-codes.enum';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'input-cell',
  templateUrl: './input-cell.component.html',
  styleUrls: ['./input-cell.component.scss']
})
export class InputCellComponent extends CellComponent implements OnInit, OnDestroy {

  public control: FormControl;
  public tempDate: any;
  public mask: string | RegExp;

  constructor() {
    super();
  }

  public datepickerOpen(datepicker) {
    this.tempDate = moment(this.row.raw[this.col.ColumnName]);
    datepicker.openPicker();
  }

  public datepickerChange(date: Date) {
    // debugger;
    if (date) {
      const momentDate = moment(date);
      // this.row.raw[this.col.ColumnName] = momentDate.format('MM/DD/YYYY');
      this.control.setValue(momentDate.format('MM/DD/YYYY'), {});
      this.row.Form.markAsDirty();
    }
  }

  ngOnInit() {
    let initValue = this.row.raw[this.col.ColumnName];

    if (this.col.DataType === 'p') {
      initValue = Number(initValue) * 100;
      switch(this.col.FormatCode) {
        case (FormatCodes.PercWhole): {
          this.mask = /^(?:100|\d{1,2})$/;
          break;
        }
        case (FormatCodes.Perc2Dec): {
          this.mask = /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/;
          break;
        } case (FormatCodes.Perc3Dec): {
          this.mask = /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/;
          break;
        }
      }
    }
    
    if (this.col.DataType === 'd') {
     initValue = CustomFormatter.formatValue(initValue, this.col.FormatCode);
    }

    this.control = new FormControl(initValue, {
      validators: this.col.Cell.ValidationRules,
    });
    this.control.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.row.raw[this.col.ColumnName] = Number(value) / 100;
      debugger;
    });
    this.row.Form.addControl(this.col.ColumnName, this.control);
  }

  
  ngOnDestroy(): void {
    this.row.Form.removeControl(this.col.ColumnName);
  }

}
