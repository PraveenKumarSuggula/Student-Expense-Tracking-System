import { Component, OnInit } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { environment } from 'src/environments/environment';

interface PaymentReminder {
  type: string;
  amount: number;
  currency: string; // Currency type
  dueDate: string;
}

@Component({
  selector: 'app-payment-reminder',
  templateUrl: './payment-reminder.component.html',
  styleUrls: ['./payment-reminder.component.scss'],
})
export class PaymentReminderComponent implements OnInit {
  paymentType: string = '';
  amount: number | null = null;
  currency: string = 'USD'; // Default currency
  dueDate: string = '';
  reminders: PaymentReminder[] = [];
  availableCurrencies: string[] = ['USD', 'EUR', 'GBP', 'INR'];
  userDetails: any;

  constructor() {}

  ngOnInit(): void {
    this.reminders = [
      { type: 'Rent', amount: 1200, currency: 'USD', dueDate: '2024-11-05' },
      {
        type: 'Electricity Bill',
        amount: 150,
        currency: 'EUR',
        dueDate: '2024-11-10',
      },
      {
        type: 'Internet Subscription',
        amount: 60,
        currency: 'GBP',
        dueDate: '2024-11-15',
      },
    ];
    this.loadLoggedInUser();
  }

  loadLoggedInUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        this.userDetails = JSON.parse(loggedInUser);
      } catch (error) {
        console.error('Failed to parse logged-in user data', error);
      }
    }
  }

  addReminder(): void {
    if (this.isValidReminder()) {
      const newReminder: PaymentReminder = {
        type: this.paymentType.trim(),
        amount: this.amount!,
        currency: this.currency,
        dueDate: this.dueDate,
      };
      this.reminders.push(newReminder);
      this.clearFields();
    } else {
      alert('Please fill in all fields correctly with valid values.');
    }
  }

  isValidReminder(): boolean {
    return (
      this.paymentType.trim() !== '' &&
      this.amount !== null &&
      this.amount > 0 &&
      this.dueDate.trim() !== ''
    );
  }

  clearFields(): void {
    this.paymentType = '';
    this.amount = null;
    this.currency = 'USD';
    this.dueDate = '';
  }

  sendEmail(reminder: PaymentReminder): void {
    const templateParams = {
      type: reminder.type,
      amount: `${reminder.amount} ${reminder.currency}`,
      due_date: reminder.dueDate,
      email: localStorage.getItem('username') || 'praveenkumar.suggula0@gmail.com',
      username: this.userDetails?.firstName,
      from_name: 'Expense Tracker System',
      to_email: localStorage.getItem('username') || '',
      payment_link: "https://student-expense-tracking-system.vercel.app/login"
    };

    emailjs
      .send(
        environment.emailjsConfig.serviceId,
        environment.emailjsConfig.templateId,
        templateParams,
        environment.emailjsConfig.userId
      )
      .then(
        (response: EmailJSResponseStatus) => {
          alert(`Email sent successfully! Status: ${response.status}`);
        },
        (error) => {
          console.error('Failed to send email.', error);
          alert('Failed to send email. Please try again.');
        }
      );
  }
}
