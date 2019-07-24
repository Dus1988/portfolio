import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassModCellComponent } from './mass-mod-cell.component';

describe('MassModCellComponent', () => {
  let component: MassModCellComponent;
  let fixture: ComponentFixture<MassModCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassModCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassModCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
