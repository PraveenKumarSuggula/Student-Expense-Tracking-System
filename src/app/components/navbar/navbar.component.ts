import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  isMenuToggled = false;
  loginHeader: boolean = false;
  userDetails: any;
  userLoggedIn = false;
  @Output() menuToggled = new EventEmitter<boolean>();
  @Output() logoutUser = new EventEmitter<any>();
  userName: string = '';
  isDropdownOpen = false;

  constructor(private router: Router, private translate: TranslateService) {
    this.userName = localStorage.getItem('username') || '';
    this.loadLoggedInUser();
    translate.setDefaultLang('en');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.isDropdownOpen = false;
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
  
  logout(){
    this.logoutUser.emit(false);
    this.router.navigate(['/login'])
  }

  toggleMenu() {
    this.isMenuToggled = !this.isMenuToggled;
    this.menuToggled.emit(this.isMenuToggled);
  }
  
}
