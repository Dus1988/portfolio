import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDashboardComponent } from './generic-dashboard.component';

describe('GenericDashboardComponent', () => {
  let component: GenericDashboardComponent;
  let fixture: ComponentFixture<GenericDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
