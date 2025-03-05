import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as Highcharts from 'highcharts';

interface Expense {
  name: string;
  totalAmount: number;
  taxAmount: number;
  category: string;
  date: string;
  paymentType: string;
  comments: string;
  currency: string;
}

interface CategoryData {
  name: string;
  y: number;
}

@Component({
  selector: 'app-visualize-expense',
  templateUrl: './visualize-expense.component.html',
  styleUrls: ['./visualize-expense.component.scss'],
})
export class VisualizeExpenseComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  pieChartOptions!: Highcharts.Options;
  taxPieChartOptions!: Highcharts.Options;
  barChartOptions!: Highcharts.Options;
  lineChartOptions!: Highcharts.Options;
  tableData: Expense[] = [];
  stackedBarChartOptions!: Highcharts.Options;
  movingAverageLineOptions!: Highcharts.Options;
  heatmapOptions!: Highcharts.Options;
  expenses: Expense[] = []; 
  summaryData: any[] = [];
  totalAmount: number = 0;
  totalTax: number = 0;
  hasData: boolean = false;
  filteredExpenses: Expense[] = [];

  // Currency conversion rates (for example purposes)
  private conversionRates: { [key: string]: number } = {
    '€': 1.06, // Example rate: 1 EUR = 1.1 USD
    '₹': 0.012, // Example rate: 1 INR = 0.012 USD
    '£': 1.26, // Example rate: 1 GBP = 1.3 USD
    '$': 1
  };

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.loadLoggedInUserExpenses();
  }

  loadLoggedInUserExpenses() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const username = loggedInUser.username;
    console.log('Logged in user:', username);
    this.fetchExpenses(username);
  }

  fetchExpenses(username: string): void {
    const sanitizedUsername = this.sanitizeUsername(username);
    const expensesRef = this.db.list<Expense>(`expenses/${sanitizedUsername}`);

    expensesRef.valueChanges().subscribe((expenses) => {
      console.log('Fetched expenses:', expenses);
      this.expenses = expenses; 
      this.filteredExpenses = this.expenses.map(x => x);
      this.tableData = this.expenses; 
      this.convertExpensesToUSD(this.expenses);

      this.updateCharts(this.expenses);
      
    });
  }

  convertExpensesToUSD(expenses: Expense[]) {
    expenses.forEach(expense => {
      if (this.conversionRates[expense.currency]) {
        const conversionRate = this.conversionRates[expense.currency];
        expense.totalAmount *= conversionRate; // Convert totalAmount to USD
        expense.taxAmount *= conversionRate; // Convert taxAmount to USD
      }
    });
  }

  onTimePeriodChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const period = target.value;
    this.filteredExpenses = [];
    const today = new Date();
    const todayString = today.toLocaleDateString('en-CA');
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-CA');
    const startOfYear = new Date(today.getFullYear(), 0, 1).toLocaleDateString('en-CA');
  
    switch (period) {
      case 'today':
        this.filteredExpenses = this.expenses.filter(expense => {
          return expense.date === todayString; 
        });
        break;
  
      case 'month':
        this.filteredExpenses = this.expenses.filter(expense => {
          const expenseDate = new Date(expense.date).toLocaleDateString('en-CA');
          return expenseDate >= startOfMonth;
        });
        break;
  
      case 'year':
        this.filteredExpenses = this.expenses.filter(expense => {
          const expenseDate = new Date(expense.date).toLocaleDateString('en-CA');
          return expenseDate >= startOfYear;
        });
        break;
  
      case 'total':
      default:
        this.filteredExpenses = this.expenses; 
        break;
    }
  
    this.updateCharts(this.filteredExpenses);
  }

  // Method to update all charts based on expenses
  updateCharts(expenses: Expense[]) {
    this.pieChartOptions = this.getPieChartOptions(expenses);
    this.taxPieChartOptions = this.getTaxPieChartOptions(expenses);
    this.barChartOptions = this.getBarChartOptions(expenses);
    this.lineChartOptions = this.getLineChartOptions(expenses);
    this.stackedBarChartOptions = this.getStackedBarChartOptions(expenses);
    this.movingAverageLineOptions = this.getMovingAverageLineOptions(expenses);
    this.heatmapOptions = this.getHeatmapOptions(expenses);
    this.calculateSummary(expenses); // Pass filtered expenses to calculate summary
  }

  // Sanitize username for Firebase key (replace . with _)
  sanitizeUsername(username: string): string {
    return username.replace(/\./g, '_'); 
  }

  getPieChartOptions(expenses: Expense[]): Highcharts.Options {
    const categoryData: CategoryData[] = this.getCategoryData(expenses);
    return {
      chart: { type: 'pie' },
      title: { text: 'Category Summary' },
      series: [
        {
          name: 'Expenses',
          type: 'pie',
          data: categoryData.map(item => ({ name: item.name, y: item.y })),
        },
      ],
    } as Highcharts.Options;
  }

  getBarChartOptions(expenses: Expense[]): Highcharts.Options {
    const categories = [...new Set(expenses.map(expense => expense.category))];
    const data = categories.map(category => {
      const totalAmount = expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.totalAmount, 0);
      return totalAmount;
    });

    return {
      chart: { type: 'column' },
      title: { text: 'Expense Summary' },
      xAxis: { categories: categories },
      yAxis: { title: { text: 'Total Spending Amount (USD)' } },
      series: [
        {
          name: 'Amount',
          type: 'column',
          data: data,
          color: '#3CB371',
        },
      ],
    } as Highcharts.Options;
  }

  getLineChartOptions(expenses: Expense[]): Highcharts.Options {
    const categories = expenses.map(expense => expense.date);
    const data = expenses.map(expense => expense.totalAmount);

    return {
      chart: { type: 'line' },
      title: { text: 'Expense Trend' },
      xAxis: { categories: categories },
      yAxis: { title: { text: 'Total Amount (USD)' } },
      series: [
        {
          name: 'Expenses',
          type: 'line',
          data: data,
          color: 'rgb(0, 102, 204)',
        },
      ],
    } as Highcharts.Options;
  }

  getStackedBarChartOptions(expenses: Expense[]): Highcharts.Options {
    const categories = [...new Set(expenses.map(expense => expense.date))]; // Dates for x-axis
    const categoryMap: { [key: string]: number[] } = {};

    expenses.forEach(expense => {
      const date = expense.date;
      const category = expense.category;
      if (!categoryMap[category]) {
        categoryMap[category] = Array(categories.length).fill(0);
      }
      const index = categories.indexOf(date);
      if (index > -1) {
        categoryMap[category][index] += expense.totalAmount;
      }
    });

    const series = Object.entries(categoryMap).map(([category, data]) => ({
      name: category,
      data: data,
      stack: 'total',
    }));

    return {
      chart: { type: 'column' },
      title: { text: 'Expenses by Category' },
      xAxis: { categories: categories },
      yAxis: { title: { text: 'Total Amount (USD)' } },
      series: series,
    } as Highcharts.Options;
  }

  getMovingAverageLineOptions(expenses: Expense[]): Highcharts.Options {
    const data = expenses.map(expense => expense.totalAmount);
    const movingAverage = this.calculateMovingAverage(data);

    return {
      chart: { type: 'line' },
      title: { text: 'Moving Average of Expenses' },
      xAxis: { categories: expenses.map(exp => exp.date) },
      yAxis: { title: { text: 'Total Amount (USD)' } },
      series: [
        {
          name: 'Expenses',
          type: 'line',
          data: data,
          color: 'rgb(0, 102, 204)',
        },
        {
          name: 'Moving Average',
          type: 'line',
          data: movingAverage,
          color: '#FFD700',
          dashStyle: 'ShortDash',
        },
      ],
    } as Highcharts.Options;
  }

  calculateMovingAverage(data: number[], period: number = 3): number[] {
    const movingAverage: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        movingAverage.push(0);
      } else {
        const avg = data.slice(i - period + 1, i + 1).reduce((sum, value) => sum + value, 0) / period;
        movingAverage.push(avg);
      }
    }
    return movingAverage;
  }

  getHeatmapOptions(expenses: Expense[]) {
    const heatmapData: any[] = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const day = date.getDay(); 
      const categoryIndex = day === 0 ? 6 : day - 1; 
      heatmapData.push([categoryIndex, expense.category, expense.totalAmount]);
    });

    return {
      chart: { type: 'heatmap', plotBorderWidth: 1 },
      title: { text: 'Heatmap of Expenses by Day and Category' },
      xAxis: { categories: daysOfWeek },
      yAxis: { categories: [...new Set(expenses.map(exp => exp.category))] },
      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: '#FF0000',
      },
      series: [{
        type: 'heatmap',
        name: 'Expenses',
        borderWidth: 1,
        data: heatmapData,
        dataLabels: {
          enabled: true,
          color: '#000000',
        },
      }],
    } as Highcharts.Options;
  }

  getCategoryData(expenses: Expense[]): CategoryData[] {
    const categoryMap = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.totalAmount;
      return acc;
    }, {});

    return Object.entries(categoryMap).map(([name, totalAmount]) => ({
      name,
      y: totalAmount,
    }));
  }

  calculateSummary(expenses: Expense[]) {
    const summaryMap = new Map<string, { totalAmount: number, taxAmount: number, expenseCount: number }>();

    expenses.forEach(expense => {
      const type = expense.paymentType; 
      if (!summaryMap.has(type)) {
        summaryMap.set(type, { totalAmount: 0, taxAmount: 0, expenseCount: 0 });
      }
      const summaryEntry = summaryMap.get(type)!;
      summaryEntry.totalAmount += expense.totalAmount;
      summaryEntry.taxAmount += expense.taxAmount;
      summaryEntry.expenseCount += 1;
    });

    this.summaryData = Array.from(summaryMap.entries()).map(([type, data]) => ({
      expenseType: type,
      totalAmount: data.totalAmount,
      taxAmount: data.taxAmount,
      expenseCount: data.expenseCount,
    }));
    this.hasData = this.summaryData.length > 0;
  }
  
  getTaxPieChartOptions(expenses: Expense[]): Highcharts.Options {
    const taxData: CategoryData[] = this.getTaxData(expenses); // New function for tax data
    return {
      chart: { type: 'pie' },
      title: { text: 'Tax Spending by Category' },
      series: [
        {
          name: 'Tax Spending',
          type: 'pie',
          data: taxData.map(item => ({ name: item.name, y: item.y })),
        },
      ],
    } as Highcharts.Options;
  }

  getTaxData(expenses: Expense[]): CategoryData[] {
    const taxMap = expenses.reduce((acc: { [key: string]: number }, expense: Expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.taxAmount; // Sum taxAmount by category
      return acc;
    }, {});

    return Object.entries(taxMap).map(([name, totalTax]) => ({
      name,
      y: totalTax,
    }));
  }
}
