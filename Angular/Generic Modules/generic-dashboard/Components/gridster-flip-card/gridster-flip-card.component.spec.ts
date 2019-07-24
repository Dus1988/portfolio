import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsterFlipCardComponent } from './gridster-flip-card.component';

describe('GridsterFlipCardComponent', () => {
  let component: GridsterFlipCardComponent;
  let fixture: ComponentFixture<GridsterFlipCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridsterFlipCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridsterFlipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
