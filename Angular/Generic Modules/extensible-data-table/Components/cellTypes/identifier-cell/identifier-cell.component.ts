import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CellComponent } from '../../cell/cell.component';
import { CustomFormatter } from '../../../../../@shared/util/custom-util';
import { RowAction } from '../../../Models/row-action';
import { ColumnConfig } from '../../../Models/column-config';
import { Row } from '../../../Models/row';

@Component({
  selector: '[identifier-cell]',
  templateUrl: './identifier-cell.component.html',
  styleUrls: ['./identifier-cell.component.scss']
})
export class IdentifierCellComponent extends CellComponent implements OnInit {
  
  @Input()
  public action: RowAction;
  @Input()
  public toolTip: string;
  @Output()
  Clicked: EventEmitter<any>;

  public color: string;

  constructor() {
    super();
    this.Clicked = new EventEmitter();
    this.color = '';
   }

  ngOnInit() {
    this.displayValue = CustomFormatter.formatValue(this.row.raw[this.col.ColumnName], this.col.FormatCode);
    if (this.col.Cell.ColorFunction){
      this.color = this.col.Cell.ColorFunction(this.row, this.col);
    }
    // debugger;
    if (this.row.raw[this.toolTip]) {
      this.toolTip = this.row.raw[this.toolTip];
    }
  }

  public actionClicked(action, row) {
    this.Clicked.emit({Action: action, Row: this.row});
  }

}
