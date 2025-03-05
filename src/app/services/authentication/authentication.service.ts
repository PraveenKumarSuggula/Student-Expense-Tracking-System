import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private dbPath = '/users'; // Firebase path for users
  userLoggedIn!: Observable<boolean>; // An observable to subscribe in other components
  observableLoginChange = new BehaviorSubject<boolean>(false);

  constructor(private db: AngularFireDatabase) {
    this.userLoggedIn = this.observableLoginChange.asObservable();
  }

  // Sign up user by storing user in Firebase Realtime Database
  signUp(user: any): Observable<boolean> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('username').equalTo(user.username))
      .valueChanges()
      .pipe(
        map((users: any[]) => {
          if (users.length === 0) {
            this.db.list(this.dbPath).push(user);
            return true; // Successfully registered
          } else {
            return false; // User already exists
          }
        })
      );
  }

  // Login by checking Firebase Realtime Database
  login(credentials: any): Observable<boolean> {
    return this.db.list(this.dbPath, ref => ref.orderByChild('username').equalTo(credentials.username))
      .valueChanges()
      .pipe(
        map((users: any[]) => {
          const user = users.find((u: any) => u.password === credentials.password);
          if (user) {
            // Optionally, store user info in local storage if needed
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            return true; // Login successful
          }
          return false; // Login failed
        })
      );
  }

  // Logout functionality (can clear any local storage or Firebase auth sessions if needed)
  logout() {
    localStorage.removeItem('loggedInUser');
    this.observableLoginChange.next(false);
  }
}
