import { Component, OnInit } from '@angular/core';
import { CellComponent } from '../../cell/cell.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'select-cell',
  templateUrl: './select-cell.component.html',
  styleUrls: ['./select-cell.component.scss']
})
export class SelectCellComponent extends CellComponent implements OnInit {

  public control: FormControl;

  constructor() {
    super();
  }

  ngOnInit() {
    this.control = new FormControl(this.row.raw[this.col.ColumnName], {
      validators: this.col.Cell.ValidationRules,
    });
    this.control.valueChanges.subscribe((value) => {
      this.row.raw[this.col.ColumnName] = value;
    });
    this.row.Form.addControl(this.col.ColumnName, this.control);
  }

}
