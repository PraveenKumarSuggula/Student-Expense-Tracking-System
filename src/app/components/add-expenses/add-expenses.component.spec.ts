import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpensesComponent } from './add-expenses.component';

describe('AddExpensesComponent', () => {
  let component: AddExpensesComponent;
  let fixture: ComponentFixture<AddExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
