import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddExpensesComponent } from './components/add-expenses/add-expenses.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ViewExpensesComponent } from './components/view-expenses/view-expenses.component';
import { VisualizeExpenseComponent } from './components/visualize-expense/visualize-expense.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ImportExpensesComponent } from './components/import-expenses/import-expenses.component';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PaymentReminderComponent } from './components/payment-reminder/payment-reminder.component';
import { FinancialAdviceComponent } from './components/financial-advice/financial-advice.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AddExpensesComponent,
    ViewExpensesComponent,
    VisualizeExpenseComponent,
    ImportExpensesComponent,
    PaymentReminderComponent,
    FinancialAdviceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(environment.firebase), // Firebase initialization
    AngularFireDatabaseModule,  // Firebase Database module
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
