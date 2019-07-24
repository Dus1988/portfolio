import { Component, OnInit, Input } from '@angular/core';
import { ColumnConfig } from '../../Models/column-config';
import { CellTypes } from '../../Enums/cell-types.enum';
import { Row } from '../../Models/row';
import { CustomFormatter } from '../../../../@shared/util/custom-util';

@Component({
  selector: '[table-cell]',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input()
  public col: ColumnConfig;
  
  @Input()
  public row: Row;

  @Input()
  public popoverComponent;

  public displayValue: string;

  public _CellTypes = CellTypes;

  constructor() { }

  ngOnInit() {}

}
