import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExpensesComponent } from './import-expenses.component';

describe('ImportExpensesComponent', () => {
  let component: ImportExpensesComponent;
  let fixture: ComponentFixture<ImportExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
