import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ExtensibleTableConfig } from '../../Models/extensible-table-config';

@Component({
  selector: '[pagingControls]',
  templateUrl: './paging-control.component.html',
  styleUrls: ['./paging-control.component.scss']
})
export class PagingControlComponent implements OnInit, OnChanges {


  @Input()
  public NumPages: Array<number>;

  @Input()
  public CurrentPage: number;

  @Output()
  public PageClicked: EventEmitter<any>;

  private maxDisplayPages: number;
  public displayedPageControls: Array<number>;

  constructor() {
    this.maxDisplayPages = 9;
    this.PageClicked = new EventEmitter();
  }

  ngOnInit() {
    this.setDisplyedControls(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.CurrentPage && !changes.CurrentPage.firstChange) {
      this.checkActivePosition();
    }

    if (changes.NumPages && !changes.NumPages.firstChange) {
      if (this.CurrentPage > this.NumPages.length) {
        this.CurrentPage = this.NumPages.length;
        this.setDisplaySet(this.CurrentPage);
      }
      if (this.NumPages.length <= this.maxDisplayPages){
        this.setDisplyedControls(0);
      } else {
        this.checkActivePosition();
      }
      
    }
  }

  public setDisplyedControls(start: number, count: number = this.maxDisplayPages) {
    this.displayedPageControls = this.NumPages.slice(start, start + count);
  }

  public checkActivePosition() {
    if (this.NumPages.length <= this.maxDisplayPages) {
      // there are not enough pages to cause a truncated control set
      // just exit the function without calculating new control set
      return;
    } else {

      const idx = this.displayedPageControls.indexOf(this.CurrentPage);
      const pagesAfterCurrent = (this.NumPages.length - 1) - this.NumPages.indexOf(this.CurrentPage);
      const pagesBeforeCurrent = this.CurrentPage - 1;
      if (idx !== -1) {
        if (idx > 4) {
          
          // user has navigated into the last half of the control set
          if (pagesAfterCurrent > 4) {
            this.setDisplyedControls(this.NumPages.indexOf(this.CurrentPage) - 4);
          } else {
            this.setDisplyedControls(this.NumPages.length - 9)
          }

        } else if (idx < 4) {

          if (pagesBeforeCurrent > 4) {
            this.setDisplyedControls(this.NumPages.indexOf(this.CurrentPage) - 4);
          } else {
            this.setDisplyedControls(0);
          }

        } else {
          if (pagesBeforeCurrent > 4) {
            this.setDisplyedControls(this.NumPages.indexOf(this.CurrentPage) - 4);
          } else if (pagesAfterCurrent > 4) {
            this.setDisplyedControls(this.NumPages.indexOf(this.CurrentPage) - 4);
          } else {
            //when in doubt go back to 1
            this.setDisplyedControls(0);
          } 
        }
      } else {
        let start;
        
        if (this.NumPages.indexOf(this.CurrentPage) === this.NumPages.length - 1){
          start = this.NumPages.indexOf(this.CurrentPage) - 8;
        } else if (this.CurrentPage === 1) {
          start = 0;
        }

        this.setDisplyedControls(start);
      }


    }
  }

  public setDisplaySet(set: string | number): void {
    this.PageClicked.emit(set);
  }

}
