import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingControlComponent } from './paging-control.component';

describe('PagingControlComponent', () => {
  let component: PagingControlComponent;
  let fixture: ComponentFixture<PagingControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagingControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagingControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
