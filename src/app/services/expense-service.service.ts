import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

interface Expense {
  name: string;
  totalAmount: number;
  taxAmount: number;
  category: string;
  date: string;
  paymentType: string;
  comments: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private db: AngularFireDatabase) {}

  // Fetch expenses for a specific user
  getExpenses(username: string): Observable<Expense[]> {
    return this.db.list<Expense>(`expenses/${username}`).valueChanges();
  }

  // Save expense to Firebase
  saveExpense(username: string, expense: Expense): void {
    this.db.list<Expense>(`expenses/${username}`).push(expense);
  }
}
