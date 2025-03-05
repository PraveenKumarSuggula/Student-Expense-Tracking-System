import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface Expense {
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

interface BudgetData {
  monthlyBudget: number;
  selectedCurrency: Currency;
}

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss'],
})
export class AddExpensesComponent implements OnInit {
  expenseForm!: FormGroup;
  categories: string[] = [
    'Groceries',
    'Insurance',
    'Entertainment',
    'Dining out',
  ];
  newCategory: string = '';
  loggedInUser: any;
  expenses: Expense[] = [];
  currencies: Currency[] = [
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'GBP' },
    { symbol: '₹', name: 'INR' },
  ];
  selectedCurrency: Currency;
  monthlyBudgetValue: number = 0;
  monthlyBudget: number = 0;
  spendingPercentage: number = 0;
  totalSpent: number = 0;
  selectedCurrencyValue: Currency = { symbol: '$', name: 'USD' };

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private db: AngularFireDatabase // Inject AngularFireDatabase
  ) {
    this.selectedCurrency = this.currencies[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.loadBudgetAndCurrency(); // Load budget from Firebase
    this.loadCategories();
    this.loadExpenses();
    this.calculateSpendingPercentage();
    this.selectedCurrencyValue = this.currencies.find(currency => currency.symbol === '$') || this.currencies[0];
  }

  initForm() {
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      totalAmount: [null, [Validators.required, Validators.min(1)]],
      taxAmount: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      currency: ['', Validators.required],
      paymentType: ['', Validators.required],
      comments: [''],
    });
  }

  loadCategories() {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
  
    if (!this.loggedInUser.username) {
      this.toastr.error('User not found in local storage.', 'Error');
      return;
    }
  
    const sanitizedEmail = this.sanitizeEmail(this.loggedInUser.username);
    const userCategoriesRef = this.db.object<{ categories: string[] }>(`categories/${sanitizedEmail}`);
  
    userCategoriesRef.valueChanges().subscribe(categoriesData => {
      if (categoriesData && categoriesData.categories) {
        this.categories = categoriesData.categories;
        // this.toastr.success('Categories loaded successfully from Firebase!', 'Success');
      } else {
        // this.toastr.warning('No categories found for the user in Firebase.', 'Warning');
        this.categories = [
          'Groceries',
          'Insurance',
          'Entertainment',
          'Dining out',
        ];
      }
    }, error => {
      this.toastr.error('Failed to load categories from Firebase.', 'Error');
      console.error('Firebase loading error:', error);
    });
  }
  

  addCategory() {
    const trimmedCategory = this.newCategory.trim();
    if (trimmedCategory && !this.categories.includes(trimmedCategory)) {
      // Update only local object
      this.categories.push(trimmedCategory);
      this.newCategory = '';
    } else {
      this.toastr.error(
        'Please enter a valid, non-duplicate category name.',
        'Error'
      );
    }
  }

  removeCategory(category: string) {
    const index = this.categories.indexOf(category);
    if (index > -1) {
      this.categories.splice(index, 1);
      this.saveCategories(); // Save categories after removing one
    }
  }

  saveCategories() {
    const uniqueCategories = Array.from(new Set(this.categories)); // Ensure unique categories
    this.saveCategoriesToFirebase(uniqueCategories);
  }

  private saveCategoriesToFirebase(categories: string[]) {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    const sanitizedEmail = this.sanitizeEmail(this.loggedInUser.username);
    const userCategoriesRef = this.db.object(`categories/${sanitizedEmail}`);
    userCategoriesRef.set({ categories }); // Save the updated categories to Firebase
    this.toastr.success('Categories saved to Firebase successfully!', 'Success');
  }

  submitExpense() {
    if (this.expenseForm.valid) {
      if (this.monthlyBudget === 0) {
        this.toastr.error(
          'Please set a monthly budget before adding expenses.',
          'Error'
        );
        return;
      }

      const expense: Expense = { ...this.expenseForm.value };
      this.saveExpenseToFirebase(expense);
      this.toastr.success('Expense saved successfully!', 'Success');
      this.resetExpenseForm();
      this.calculateSpendingPercentage();
    } else {
      this.toastr.error(
        'Please fill all the required fields correctly.',
        'Error'
      );
    }
  }

  private sanitizeEmail(email: string): string {
    return email?.replace(/\./g, '_'); // Replace dots with underscores
  }

  saveExpenseToFirebase(expense: Expense) {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    const sanitizedEmail = this.sanitizeEmail(this.loggedInUser.username);
    const userExpensesRef = this.db.list(`expenses/${sanitizedEmail}`);
    userExpensesRef.push(expense); // Save the expense to Firebase
  }

  loadExpenses() {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    const sanitizedEmail = this.sanitizeEmail(this.loggedInUser.username);
    const userExpensesRef = this.db.list<Expense>(`expenses/${sanitizedEmail}`).valueChanges();

    userExpensesRef.subscribe(expenses => {
      this.expenses = expenses;
      this.calculateSpendingPercentage();
    });
  }

  resetExpenseForm() {
    this.expenseForm.reset();
    this.expenseForm.controls['paymentType'].setValue('')
    this.expenseForm.controls['category'].setValue('')
    this.expenseForm.controls['currency'].setValue('')
    this.newCategory = '';
    this.categories = [
      'Groceries',
      'Insurance',
      'Entertainment',
      'Dining out',
    ];
  }

  saveBudget() {
    this.monthlyBudget = this.monthlyBudgetValue; // Assign the value from the input
    this.selectedCurrency = this.selectedCurrencyValue;

    const budgetData: BudgetData = {
      monthlyBudget: this.monthlyBudget,
      selectedCurrency: this.selectedCurrency,
    };

    this.monthlyBudgetValue = this.monthlyBudget;
    this.calculateSpendingPercentage();

    // Save budget data to Firebase
    this.saveBudgetToFirebase(budgetData);
    this.toastr.success('Budget and Currency saved successfully!', 'Success');
  }

  loadBudgetAndCurrency() {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    const sanitizedEmail = this.sanitizeEmail(this.loggedInUser.username);
    const userBudgetRef = this.db.object<BudgetData>(`budgets/${sanitizedEmail}`);

    userBudgetRef.valueChanges().subscribe(budgetData => {
      if (budgetData) {
        this.monthlyBudget = budgetData.monthlyBudget || 0;
        this.selectedCurrency = budgetData.selectedCurrency || {
          symbol: '$',
          name: 'USD',
        };
        this.monthlyBudgetValue = this.monthlyBudget;

        // Find the corresponding currency object from the currencies array
        this.selectedCurrencyValue = this.currencies.find(
          (currency) =>
            currency.symbol === this.selectedCurrency.symbol &&
            currency.name === this.selectedCurrency.name
        ) || { symbol: '$', name: 'USD' }; // Default fallback
      } else {
        this.monthlyBudget = 0; // Set default value if no budget data is found
        this.selectedCurrency = { symbol: '$', name: 'USD' }; // Set default currency
      }
    });
  }

  saveBudgetToFirebase(budgetData: BudgetData) {
    this.loggedInUser = JSON.parse(
      localStorage.getItem('loggedInUser') || '{}'
    );
    const sanitizedEmail = this.sanitizeEmail(this.loggedInUser.username);
    const userBudgetRef = this.db.object(`budgets/${sanitizedEmail}`);
    userBudgetRef.set(budgetData); // Save the budget to Firebase
  }

  calculateSpendingPercentage() {
    this.totalSpent = this.expenses.reduce(
      (acc, expense) => acc + expense.totalAmount,
      0
    );
    this.spendingPercentage = (this.totalSpent / this.monthlyBudget) * 100 || 0;
  }

  getSpendingColor(): string {
    const currentSpending = this.expenses.reduce(
      (acc, expense) => acc + expense.totalAmount,
      0
    );
    if (currentSpending < this.monthlyBudget) {
      return 'green';
    } else if (currentSpending === this.monthlyBudget) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  get f() {
    return this.expenseForm.controls;
  }
}
