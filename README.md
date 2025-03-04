# Student Expense Tracker and Visualizer

## 🚀 About Me

Hiiii I am Praveen, I'm a passionate Full Stack Developer with a strong interest in creating efficient, user-friendly web applications, always eager to learn and collaborate on impactful projects.  
LinkedIn: www.linkedin.com/in/praveensuggula

## Project Description

The **Student Expense Tracker and Visualizer** is a web-based application designed to help students track and manage their daily expenses efficiently. The application allows students to set spending limits, categorize expenses, visualize spending patterns, and even export data. It provides valuable insights through graphical charts, alerts for overspending, and offers financial reminders, helping students make informed financial decisions and build better financial habits.

## Table of Contents

1. [Brief Problem Statement](#brief-problem-statement)
2. [Technologies Used](#technologies-used)
3. [Feature Requirements](#feature-requirements)
4. [Installation and Setup](#installation-and-setup)
5. [Environment Setup](#environment-setup)
6. [Usage](#usage)
7. [API References](#api-references)
8. [Contributing](#contributing)
9. [Authors](#authors)
10. [Contact Information](#contact-information)
---

## Brief Problem Statement

International students often face difficulties managing their finances, particularly in tracking and controlling their expenses. Existing tools may not meet their needs, especially when it comes to setting budgets, receiving spending alerts, or viewing trends. The **Student Expense Tracker and Visualizer** was created to fill this gap by providing a platform where students can log their expenses, categorize them, set and track budgets, receive alerts, and visualize their spending patterns. The goal is to help students make better financial decisions, reduce unnecessary expenses, and save money.

---

## Technologies Used

- **Frontend**: 
  - HTML, CSS, Bootstrap 5.0, TypeScript
  - Angular 16 (for building dynamic, responsive user interfaces)
  
- **Backend**:
  - Firebase API (for authentication and real-time database handling)
  - Firebase Realtime Database (for storing and syncing user data)

- **Testing**:
  - Karma and Jasmine (for unit and integration testing)

- **Deployment**:
  - Vercel Hosting (for deploying the application with CI/CD)
  - Git (for version control)

---

## Feature Requirements

### Functional Features

| No. | Feature Name            | Description                                                                  |
|-----|-------------------------|------------------------------------------------------------------------------|
| 1   | **Authentication & Registration** | Allows students to create an account and log in using personal credentials. |
| 2   | **Expense Logging**      | Allows students to log daily expenses into the system.                        |
| 3   | **Categorization**       | Enables categorization of expenses for better tracking and comparison.       |
| 4   | **Budget Setting**       | Lets students set daily, monthly, or yearly budgets to control their spending.|
| 5   | **Visual Analytics**     | Displays graphical representations (charts, graphs) of expenses over time.   |
| 6   | **Notifications**        | Sends alerts when the student's expenses exceed or approach their set budget. |
| 7   | **Import Expenses via CSV** | Allows students to import their expenses from a CSV file into the system. |
| 8   | **Export Expenses**      | Enables students to export their expenses to CSV format via email or WhatsApp.|
| 9   | **Payment Reminders**    | Sends email notifications to remind students about upcoming bills and payments.|
| 10  | **Expense Comparison**   | Allows students to compare their expenses over different periods (e.g., monthly, yearly). |
| 11  | **Download Reports**     | Enables students to download their expense reports in CSV or PDF format.    |
| 12  | **Share Reports**        | Allows students to share their financial reports with others via email.     |
| 13  | **Multi-Currency Support** | Supports expenses in multiple currencies for international students.        |
| 14  | **Tax Tracking**         | Tracks and analyzes taxes on student purchases.                              |
| 15  | **Financial Advice**     | Provides students with budget management tips and financial advice.         |

### Non-Functional Features

- **Performance**: Ensures quick access to expense reports and visualizations even with a high volume of data.
- **Security**: Secure handling of sensitive user data, especially financial and personal information.
- **Usability**: User-friendly interface with easy navigation and clear design.
- **Scalability**: The application can handle an increasing number of users without impacting performance.
- **Reliability**: High system uptime and data integrity.


## Installation and Setup

### Prerequisites

To get started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.io/cli)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Clone the Repository

```bash
git clone https://github.com/PraveenKumarSuggula/Student-Expense-Tracking-System.git
cd Expenses-Tracker-and-Visualizer
```

### Install Dependencies
Run the following command to install the required dependencies:

```bash
npm install
```

### Firebase Setup (for database/deployment)

To configure Firebase for your Angular application, follow these steps:

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new Firebase project.
- Obtain the Firebase config file (firebase-config.json).
- Place the config file in the `src/environments/` directory given in environment setup below.

### EmailJs Setup (for notifications)

To integrate EmailJS for sending emails in your Angular application, follow these steps:

- Create an account at EmailJS.
- In the EmailJS dashboard, create a new email service.
- Set up a new email template.
- Obtain your Service ID, Template ID, and User ID from the EmailJS dashboard.
- Store these values in `src/environments/` directory given in environment setup below.

### Vercel Deployment with CI/CD (DevOps)
Since Vercel offers free hosting, I used Vercel for Continuous Integration and Deployment (CI/CD) to automate deployments. If you would like to do the same, follow the steps below:

#### 1. Install Vercel CLI
First, install the Vercel CLI globally on your machine. Open a terminal and run:

```bash
npm install -g vercel
```

#### 2. Authenticate with Vercel
Log in to your Vercel account:
```bash
vercel login
```

#### 3. Link Your Angular Project to Vercel
Navigate to your Angular project folder and run:
```bash
vercel
```
Follow the prompts to set up your project.

#### 4. Configure vercel.json
Create a vercel.json file in the root directory of your project with the following content:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "angular.json",
      "use": "@vercel/angular"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```
#### 5. Set Up GitHub CI/CD with Vercel
- Push your Angular project to GitHub.
- Go to Vercel Dashboard.
- Click "New Project" and select your GitHub repository.
- Choose "Angular" as the framework and configure build settings if needed.
- Click Deploy – Vercel will handle the rest!

#### 6. Automatic Deployments
Whenever you push changes to the main or master branch, Vercel will automatically deploy your application.
To trigger a manual deployment, run:
```bash
vercel --prod
```

#### 7. Testing Deployment Locally
Before deploying, test the production build locally:
```bash
npm run build
vercel dev
```

## Environment Setup

Make sure to set the appropriate environment variables in `src/environments/environment.ts` or `src/environments/environment.prod.ts`. Here's an example of what to include:


5. Set up your Firebase configuration in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    databaseURL: 'YOUR_DATABASE_URL',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
  },
  emailjsConfig: {
    serviceId: 'YOUR_SERVICE_ID',  // Add your EmailJS service ID here
    templateId: 'YOUR_TEMPLATE_ID', // Add your EmailJS template ID here
    userId: 'YOUR_USER_ID'          // Add your EmailJS user ID here
  }
};

```
## Usage

### Running the Application Locally

To start the application locally, run:

```bash
ng serve -o
```

This will open the app in your browser at [http://localhost:4200](http://localhost:4200).

### Running Unit Tests

To run unit tests, use the following command:

```bash
ng test
```

### Building the Application

To build the application for production, use:

```bash
ng build --configuration=production
```

This will create a `dist/` folder with the optimized build files.


## API References

### 1. Expenses Management:
```json
{
  "amount": "number",
  "category": "string",
  "date": "string",
  "description": "string"
}
```
#### GET /expenses/{userId}
- Fetches all expenses for the specified user.
#### Response:
```json
{
  "expenses": [
    {
      "id": "expenseId1",
      "name": "Grocery",
      "totalAmount": 50,
      "taxAmount": 5,
      "category": "Food",
      "date": "2025-03-03",
      "paymentType": "Credit Card",
      "comments": "Monthly grocery shopping"
    },
    ...
  ]
}
```

#### POST /expenses/{userId}
-  Adds a new expense for the specified user.
#### Request Body:
```json
{
  "name": "Taxi ride",
  "totalAmount": 20,
  "taxAmount": 2,
  "category": "Transport",
  "date": "2025-03-03",
  "paymentType": "Debit Card",
  "comments": "Ridesharing to work"
}
```
#### Response:
```json
{
  "message": "Expense added successfully"
}
```

#### PUT /expenses/{userId}/{expenseId}
- Updates the details of an existing expense for the specified user.
#### Request Body:
```json
{
  "name": "Updated Grocery",
  "totalAmount": 60,
  "taxAmount": 6,
  "category": "Food",
  "date": "2025-03-03",
  "paymentType": "Credit Card",
  "comments": "Updated grocery shopping"
}
```
#### Response:
```json
{
  "message": "Expense updated successfully"
}
```

#### DELETE /expenses/{userId}/{expenseId}
- Deletes an expense for the specified user.
#### Response:
```json
{
  "message": "Expense deleted successfully"
}
```

### 2. Category Management

#### GET /categories/{userId}
- Fetches all categories for the specified user.
#### Response:
```json
{
  "categories": [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    ...
  ]
}
```

#### POST /categories/{userId}
- Adds a new category for the specified user.
#### Request Body:
```json
{
  "category": "Health"
}
```
#### Response:
```json
{
  "message": "Category added successfully"
}
```

#### DELETE /categories/{userId}/{categoryName}
- Removes a category for the specified user.
#### Response:
```json
{
  "message": "Category removed successfully"
}
```

### 3. Budget Management

#### GET /budget/{userId}
- Fetches the current budget for the specified user.
#### Response:
```json
{
  "budget": 500,
  "currency": "USD",
  "spendingPercentage": 60
}
```

#### POST /budget/{userId}
- Sets or updates the monthly budget for the specified user.
#### Request Body:
```json
{
  "budget": 600,
  "currency": "USD"
}
```
#### Response:
```json
{
  "message": "Budget set successfully"
}
```

#### DELETE /budget/{userId}
- Removes the monthly budget for the specified user.
#### Response:
```json
{
  "message": "Budget removed successfully"
}
```

### 4. Notifications and Alerts

#### GET /alerts/{userId}
- Fetches the alerts for the specified user.
#### Response:
```json
{
  "alerts": [
    {
      "alertId": "alert1",
      "message": "You have exceeded 80% of your budget!",
      "alertType": "Spending Alert",
      "date": "2025-03-03"
    },
    ...
  ]
}
```

#### POST /alerts/{userId}
- Creates a new alert for the specified user (e.g., custom alert based on certain spending criteria).
#### Request Body:
```json
{
  "message": "You have exceeded 50% of your budget!",
  "alertType": "Spending Alert",
  "thresholdPercentage": 50
}
```

#### Response:
```json
{
  "message": "Alert created successfully"
}
```

## Contributing
If you would like to contribute:

- Fork the repository.
- Create a new feature branch `(e.g., feature-xyz)`.
- Make your changes and commit them.
- Push your changes to your fork.
- Submit a pull request for review.

## Authors

- [@PraveenKumarSuggula](https://www.github.com/PraveenKumarSuggula)

## Contact Information

For any inquiries or feedback, feel free to reach out to:

**Praveen Kumar Suggula**  
Email: [praveenkumar.suggula0@gmail.com](mailto:praveenkumar.suggula0@gmail.com)  
LinkedIn: www.linkedin.com/in/praveensuggula
