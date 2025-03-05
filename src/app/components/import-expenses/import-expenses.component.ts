import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';

interface Expense {
  name: string;
  currency: string;
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
  selector: 'app-import-expenses',
  templateUrl: './import-expenses.component.html',
  styleUrls: ['./import-expenses.component.scss']
})
export class ImportExpensesComponent {
  importedExpenses: Expense[] = [];
  csvFileName: string = '';
  errorMessage: string = '';

  currencies: Currency[] = [
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'GBP' },
    { symbol: '₹', name: 'INR' },
  ];

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private toastr: ToastrService
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.csvFileName = file.name;
      this.parseCSVFile(file);
    }
  }

  parseCSVFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = reader.result as string;

      Papa.parse<Expense>(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<Expense>) => {
          if (result.errors.length === 0) {
            if (this.validateExpenses(result.data)) {
              this.mapToExpenses(result.data);
            }
          } else {
            this.errorMessage = 'Error parsing CSV file.';
          }
        },
        error: (error: any) => {
          console.error('Error reading file:', error);
          this.errorMessage = 'Error reading file. Please check the format.';
        },
      });
    };
    reader.readAsText(file);
  }
  validateExpenses(expenses: Expense[]): boolean {
    const dateFormatRegex = /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[01])\/(\d{4})$/; // MM/DD/YYYY format
    for (const expense of expenses) {
      if (!expense.name) {
        this.errorMessage = 'Expense name is required.';
        return false;
      }
      if (!this.getCurrencySymbol(expense.currency)) {
        this.errorMessage = `Invalid currency type: ${expense.currency}. Accepted values: USD, Euro, GBP, INR.`;
        return false;
      }
      if (isNaN(expense.totalAmount) || expense.totalAmount <= 0) {
        this.errorMessage = 'Total amount must be a positive number.';
        return false;
      }
      if (isNaN(expense.taxAmount) || expense.taxAmount < 0) {
        this.errorMessage = 'Tax amount must be a non-negative number.';
        return false;
      }
      if (expense.date && !dateFormatRegex.test(expense.date)) {
        this.errorMessage = `Invalid date format for ${expense.name}. Required format: MM/DD/YYYY.`;
        return false;
      }
    }
    this.errorMessage = '';
    return true;
  }

  mapToExpenses(parsedData: Expense[]) {
    this.importedExpenses = parsedData.map((expense) => {
      return {
        name: expense.name,
        currency: this.getCurrencySymbol(expense.currency) || '$', // Use the mapping function here
        totalAmount: +expense.totalAmount,
        taxAmount: +expense.taxAmount,
        category: expense.category || 'Unassigned',
        date: this.convertDate(expense.date),
        paymentType: expense.paymentType || 'Debit',
        comments: expense.comments || 'No comments',
      };
    });
  }

  // New method to get currency symbol
  getCurrencySymbol(currencyName: string): string | undefined {
    const currency = this.currencies.find((c) => c.name.toLowerCase() === currencyName.toLowerCase());
    return currency ? currency.symbol : undefined;
  }

  convertDate(dateStr: string): string {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  }

  saveImportedExpenses() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const userDetails = JSON.parse(loggedInUser);
      const sanitizedEmail = this.sanitizeEmail(userDetails.username);
      const userExpensesRef = this.db.list<Expense>(
        `expenses/${sanitizedEmail}`
      );
      const fileKey = `${sanitizedEmail}_${this.csvFileName}`;
      userExpensesRef.query.ref
        .once('value')
        .then((snapshot) => {
          if (localStorage.getItem(fileKey) && snapshot.exists()) {
            this.toastr.error('You have already uploaded expenses. Please check your existing expenses.', 'Error');
            return;
          } else {
            let successCount = 0;
            this.importedExpenses.forEach((expense) => {
              userExpensesRef.push(expense)
                .then(() => {
                  successCount++;
                })
                .catch((error) => {
                  console.error('Error saving expenses to Firebase:', error);
                  this.toastr.error(
                    'Error saving some expenses to Firebase.',
                    'Error'
                  );
                })
                .finally(() => {
                  if (successCount === this.importedExpenses.length) {
                    localStorage.setItem(fileKey, 'uploaded');
                    this.toastr.success(
                      'Imported expenses saved to Firebase successfully!',
                      'Success'
                    );
                    this.router.navigate(['/view-expenses']);
                  }
                });
            });
            if (this.importedExpenses.length === 0) {
              this.toastr.warning('No expenses to import.', 'Warning');
              this.router.navigate(['/view-expenses']);
            }
          }
        })
        .catch((error) => {
          console.error('Error checking existing expenses:', error);
          this.toastr.error('Error checking existing expenses.', 'Error');
        });
    } else {
      this.toastr.error('User not logged in.', 'Error');
    }
  }

  private sanitizeEmail(email: string): string {
    return email.replace(/\./g, '_');
  }
}
