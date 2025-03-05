import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddExpensesComponent } from './components/add-expenses/add-expenses.component';
import { ViewExpensesComponent } from './components/view-expenses/view-expenses.component';
import { VisualizeExpenseComponent } from './components/visualize-expense/visualize-expense.component';
import { ImportExpensesComponent } from './components/import-expenses/import-expenses.component';
import { PaymentReminderComponent } from './components/payment-reminder/payment-reminder.component';
import { FinancialAdviceComponent } from './components/financial-advice/financial-advice.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'addexpense', component: AddExpensesComponent },
  { path: 'view-expenses', component: ViewExpensesComponent },
  { path: 'visualize', component: VisualizeExpenseComponent },
  { path: 'remainders', component: PaymentReminderComponent },
  { path: 'advices', component: FinancialAdviceComponent },
  { path: 'import-expenses', component: ImportExpensesComponent },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
