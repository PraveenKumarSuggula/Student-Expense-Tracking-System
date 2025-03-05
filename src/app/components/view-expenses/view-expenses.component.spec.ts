import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpensesComponent } from './view-expenses.component';

describe('ViewExpensesComponent', () => {
  let component: ViewExpensesComponent;
  let fixture: ComponentFixture<ViewExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
