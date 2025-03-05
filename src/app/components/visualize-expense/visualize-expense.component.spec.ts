import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeExpenseComponent } from './visualize-expense.component';

describe('VisualizeExpenseComponent', () => {
  let component: VisualizeExpenseComponent;
  let fixture: ComponentFixture<VisualizeExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizeExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
