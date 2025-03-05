import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Expense {
  name: string;
  totalAmount: number;
  taxAmount: number;
  category: string;
  date: string;
  paymentType: string;
  comments: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userDetails: any;
  username: string = '';  
  expenses: any[] = [];    
  showNoExpenses: boolean = false;

  constructor(private router: Router, private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.loadLoggedInUser();
    this.loadExpenses();
  }

  loadLoggedInUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        this.userDetails = JSON.parse(loggedInUser);
        this.username = this.userDetails.username;
      } catch (error) {
        console.error('Failed to parse logged-in user data', error);
      }
    }
  }

  loadExpenses() {
    if (this.username) {
      const sanitizedEmail = this.sanitizeEmail(this.username);
      const userExpensesRef = this.db.list<Expense>(`expenses/${sanitizedEmail}`).valueChanges();

      userExpensesRef.subscribe(expenses => {
        this.expenses = expenses;
        this.showNoExpenses = this.expenses.length === 0;
      }, error => {
        console.error('Error loading expenses from Firebase:', error);
      });
    } else {
      this.expenses = [];
      this.showNoExpenses = true;
    }
  }

  private sanitizeEmail(email: string): string {
    return email.replace(/\./g, '_');
  }

  updateNoExpensesStatus(hasExpenses: boolean) {
    this.showNoExpenses = !hasExpenses;
  }

  AddExpenses() {
    this.router.navigate(['/addexpense']);
  }
}
