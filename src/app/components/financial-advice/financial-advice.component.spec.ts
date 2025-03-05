import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAdviceComponent } from './financial-advice.component';

describe('FinancialAdviceComponent', () => {
  let component: FinancialAdviceComponent;
  let fixture: ComponentFixture<FinancialAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAdviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
