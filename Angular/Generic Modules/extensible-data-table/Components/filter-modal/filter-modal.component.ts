import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnConfig } from '../../Models/column-config';
import { Subject } from 'rxjs';
import { ColumnFilter } from '../../Models/column-filter';
import { FilterTypes } from '../../Enums/filter-types.enum';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'ngx-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {

  public Column: ColumnConfig;
  public filtersLocalCopy: Array<ColumnFilter>;
  public changed: boolean;
  public Saved: Subject<any>;
  public _FilterTypes = FilterTypes;

  @ViewChild('FiltersForm')
  private FiltersForm: NgForm;

  constructor(private activeModal: NgbActiveModal) { 
    this.changed = false;
    this.Saved = new Subject<any>();
  }

  ngOnInit() {

  // this.FiltersForm.valueChanges.pipe(first()).subscribe(() => {
  //   this.changed = true;
  // });
  }

  public addFilter() {
    this.filtersLocalCopy.push(new ColumnFilter());
    this.changeOccured();
  }
  
  public changeOccured() {
    this.changed = true;
  }

  public closeModal() {
    this.activeModal.close();
  }

  public load(column: ColumnConfig): void {
    this.Column = column;
    this.reset();
  }

  public removeFilter(idx: number) {
    this.filtersLocalCopy.splice(idx, 1);
    this.changeOccured();
  }

  public reset() {
    this.filtersLocalCopy = JSON.parse(JSON.stringify(this.Column.Filters));
    this.changed = false;
  }

  public save(): void {
    if (this.changed) {
      
      this.Column.Filters = this.filtersLocalCopy.filter((val, idx) => {
        // only save filters with a value
        return val.Value !== '';
      });
      this.Saved.next();
    }
    this.closeModal();
  }

  

}
