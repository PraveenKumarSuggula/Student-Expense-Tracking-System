import { TestBed } from '@angular/core/testing';

import { ExpenseService } from './expense-service.service';

describe('ExpenseServiceService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
