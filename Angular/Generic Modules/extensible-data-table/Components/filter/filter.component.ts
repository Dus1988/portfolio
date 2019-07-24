import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { debounceTime, first } from 'rxjs/operators';
import { ColumnConfig } from '../../Models/column-config';
import { FilterAction } from '../../Models/filter-action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { ColumnFilter } from '../../Models/column-filter';
import { FilterTypes } from '../../Enums/filter-types.enum';

@Component({
  selector: '[columnFilter]',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  

  @Input()
  public Column: ColumnConfig;
  @Input()
  public AdvancedFilters: boolean;

  @Output()
  public filterChanged: EventEmitter<FilterAction>;

  public stringChanged: Subject<any>;
  private stringSubscriber: Subscription;

  public filterTypes = FilterTypes;
  public filterTypeKeys = Object.keys(FilterTypes);

  constructor(
    private modalService: NgbModal) {
    this.stringChanged = new Subject();
    this.filterChanged = new EventEmitter();
  }

  ngOnInit() {
    this.stringSubscriber = this.stringChanged.pipe(debounceTime(500)).subscribe(() => {
      this.updateSimpleFilter();
    });
  }

  public clearFilters(): void {
    this.Column.resetFilters();
    this.filterChanged.emit({action: 'clear', column: this.Column});
  }

  public changeFilterType(type: any): void {
    this.Column.Filters[0].Operation = FilterTypes[type];
    this.updateSimpleFilter();
  }

  public filterStringModelChange(): void {
    this.stringChanged.next();
  }

  public triggerAdvancedFilter(): void {

    if (!this.Column.ReadAllowed) { return; }
    const activeModal = this.modalService.open(FilterModalComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.load(this.Column);
    activeModal.componentInstance.Saved.pipe(first()).subscribe(() => {
      if (this.Column.Filters.length === 0) {
        this.Column.resetFilters();
        this.filterChanged.emit({action: 'clear', column: this.Column});
      } else {
        this.filterChanged.emit({action: 'update', column: this.Column});
      }
      
    });
  }

  public updateSimpleFilter(): void {
    // alert('Testing this: ' + this.Column.Filters[0].Value + '.');
    if (this.Column.Filters[0].Value === '') {
      this.filterChanged.emit({action: 'clear', column: this.Column});
    } else {
      this.filterChanged.emit({action: 'update', column: this.Column});
    }
  }

  ngOnDestroy(): void {
    this.stringSubscriber.unsubscribe();
    this.Column.resetFilters();
  }

}
