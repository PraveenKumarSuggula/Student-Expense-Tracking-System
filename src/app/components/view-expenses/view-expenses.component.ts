import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

interface Expense {
  id?: string; // Add an optional id field
  name: string;
  totalAmount: number;
  taxAmount: number;
  category: string;
  date: string;
  paymentType: string;
  comments: string;
}

interface Currency {
  symbol: string;
  name: string;
}

@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.scss'],
})
export class ViewExpensesComponent implements OnInit {
  expenses: any[] = [];
  username: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedExpenses: any[] = [];
  totalPages: number = 0;
  selectedExpenseId: string | null = null;
  private bootstrapModal: bootstrap.Modal | null = null;
  VALID_CURRENCIES = ['USD', 'Euro', 'GBP', 'INR'];
  currencies: Currency[] = [
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'GBP' },
    { symbol: '₹', name: 'INR' },
  ];

  constructor(private db: AngularFireDatabase, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadLoggedInUser();
    this.loadExpenses();
  }

  loadLoggedInUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        this.username = userData.username;
      } catch (error) {
        console.error('Failed to parse logged-in user data', error);
      }
    }
  }

  loadExpenses() {
    if (this.username) {
      const sanitizedUsername = this.sanitizeUsername(this.username);
      this.db
        .list<Expense>(`expenses/${sanitizedUsername}`)
        .snapshotChanges() // Use snapshotChanges to get the key with the data
        .subscribe({
          next: (expenses) => {
            this.expenses = expenses.map((e) => ({
              id: e.payload.key,
              ...e.payload.val(),
            })); // Include id
            this.totalPages = Math.ceil(
              this.expenses.length / this.itemsPerPage
            );
            this.paginateExpenses();
          },
          error: (error) => {
            console.error('Error fetching expenses:', error);
            this.toastr.error('Failed to load expenses.', 'Error');
          },
        });
    } else {
      this.expenses = [];
    }
  }

  sanitizeUsername(username: string): string {
    return username.replace(/\./g, '_');
  }

  paginateExpenses() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedExpenses = this.expenses.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateExpenses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateExpenses();
    }
  }

  getCurrentTimestamp(): string {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }

  formatDate(dateString: any) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`; // Change format to MM/DD/YYYY
  }
  downloadExpenses() {
    try {
      const timestamp = this.getCurrentTimestamp();
      const headers =
        'name,currency,totalAmount,taxAmount,category,date,paymentType,comments';

      const csvContent = [
        headers,
        ...this.expenses.map((expense) => {
          const category = expense.category || 'Unassigned';
          const paymentType = expense.paymentType || 'Debit';
          const formattedDate = this.formatDate(expense.date);

          // Use currency name instead of symbol
          const currencyName = this.getCurrencyName(expense.currency); // Get the name based on the symbol
          if (!this.VALID_CURRENCIES.includes(currencyName)) {
            console.error(
              `Invalid currency type: ${currencyName}. Accepted values: USD, Euro, GBP, INR.`
            );
            return `${expense.name},Invalid currency,${expense.totalAmount},${
              expense.taxAmount
            },${category},${formattedDate},${paymentType},${
              expense.comments || ''
            }`;
          }

          return `${expense.name},${currencyName},${expense.totalAmount},${
            expense.taxAmount
          },${category},${formattedDate},${paymentType},${
            expense.comments || ''
          }`;
        }),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      this.toastr.success('Expenses downloaded successfully!', 'Success');
    } catch (error) {
      this.toastr.error('Failed to download expenses.', 'Error');
    }
  }

  shareExpenses() {
    try {
      const timestamp = this.getCurrentTimestamp();
      const headers =
        'name,currency,totalAmount,taxAmount,category,date,paymentType,comments';

      const csvContent = [
        headers,
        ...this.expenses.map((expense) => {
          const category = expense.category || 'Unassigned';
          const paymentType = expense.paymentType || 'Debit';
          const formattedDate = this.formatDate(expense.date);

          // Use currency name instead of symbol
          const currencyName = this.getCurrencyName(expense.currency); // Get the name based on the symbol
          if (!this.VALID_CURRENCIES.includes(currencyName)) {
            console.error(
              `Invalid currency type: ${currencyName}. Accepted values: USD, Euro, GBP, INR.`
            );
            return `${expense.name},Invalid currency,${expense.totalAmount},${
              expense.taxAmount
            },${category},${formattedDate},${paymentType},${
              expense.comments || 'No comments'
            }`;
          }

          return `${expense.name},${currencyName},${expense.totalAmount},${
            expense.taxAmount
          },${category},${formattedDate},${paymentType},${
            expense.comments || 'No comments'
          }`;
        }),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], `expenses_${timestamp}.csv`, {
        type: 'text/csv',
      });

      if (navigator.share) {
        navigator
          .share({
            title: 'Expense Report',
            text: 'Here is the expense report.',
            files: [file],
          })
          .catch((err) =>
            this.toastr.error('Failed to share expenses.', 'Error')
          );
      } else {
        this.toastr.warning(
          'Sharing is not supported in this browser.',
          'Warning'
        );
      }
    } catch (error) {
      this.toastr.error('Failed to share expenses.', 'Error');
    }
  }

  // Helper method to get the currency name from the symbol
  getCurrencyName(symbol: string): string {
    const currency = this.currencies.find((c) => c.symbol === symbol);
    return currency ? currency.name : 'Unknown Currency';
  }

  confirmDelete(expenseId: string) {
    this.selectedExpenseId = expenseId;
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      this.bootstrapModal = new bootstrap.Modal(modalElement);
      this.bootstrapModal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  deleteConfirmed() {
    if (this.selectedExpenseId) {
      this.deleteExpense(this.selectedExpenseId);
      this.selectedExpenseId = null;

      if (this.bootstrapModal) {
        this.bootstrapModal.hide();
      }
    }
  }

  private sanitizeEmail(email: string): string {
    return email.replace(/\./g, '_');
  }

  deleteExpense(expenseId: string) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const userDetails = JSON.parse(loggedInUser);
      const sanitizedEmail = this.sanitizeEmail(userDetails.username);
      const userExpensesRef = this.db.list<Expense>(
        `expenses/${sanitizedEmail}`
      );

      userExpensesRef
        .remove(expenseId)
        .then(() => {
          this.toastr.success('Expense deleted successfully!', 'Success');
          this.loadExpenses(); // Reload the expenses after deletion
        })
        .catch((error) => {
          console.error('Error deleting expense:', error);
          this.toastr.error('Error deleting the expense.', 'Error');
        });
    } else {
      this.toastr.error('User not logged in.', 'Error');
    }
  }
}
