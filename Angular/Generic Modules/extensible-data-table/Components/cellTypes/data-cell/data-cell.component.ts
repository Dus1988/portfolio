import { Component, OnInit } from '@angular/core';
import { CellComponent } from '../../cell/cell.component';
import { CustomFormatter } from '../../../../../@shared/util/custom-util';
import { IHistoricalData } from '../../../../../@core/interfaces/historical-data.interface';

@Component({
  selector: 'data-cell',
  templateUrl: './data-cell.component.html',
  styleUrls: ['./data-cell.component.scss']
})
export class DataCellComponent extends CellComponent implements OnInit {

  public color: string;
  hasHistory: boolean = false;

  constructor() {
    super();
    this.color = '';
   }

  ngOnInit() {
    //Testing
    // if(this.row.raw.HistoricalData && this.row.raw.HistoricalData.length > 0){
    //   // this.row.raw.HistoricalData.forEach((data: IHistoricalData) => {
    //   //   this.hasHistory = (this.col.ColumnName === data.ColumnName);
    //   // });
    //   this.hasHistory = this.row.raw.HistoricalData.find((data: IHistoricalData) => (this.col.ColumnName === data.ColumnName));
    // }
    
    this.displayValue = CustomFormatter.formatValue(this.row.raw[this.col.ColumnName], this.col.FormatCode);
    if (this.col.Cell.ColorFunction){
      this.color = this.col.Cell.ColorFunction(this.row, this.col);
    }

    if (this.col.Cell.popoverEnabledFunction) {
      this.col.Cell.popoverEnabledFunction(this);
    }
  }
}