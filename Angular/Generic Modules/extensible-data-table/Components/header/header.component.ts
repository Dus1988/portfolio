import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnConfig } from '../../Models/column-config';

@Component({
  selector: '[headerCell]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input()
  public Column: ColumnConfig;

  @Output()
  public Clicked: EventEmitter<ColumnConfig>;

  constructor() {
    this.Clicked = new EventEmitter();
  }

  public clickFired(): void {
    this.Clicked.emit(this.Column);
  }

  ngOnInit() {
  }

}
