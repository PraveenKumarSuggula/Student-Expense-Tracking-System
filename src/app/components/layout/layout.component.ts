import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isMenuToggled = false;
  userLoggedIn = false;
  onMenuShow = false;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event: any) => {
      // Show menu only if the current route is not login or signup
      this.onMenuShow = !(event.urlAfterRedirects.includes("/login") || event.urlAfterRedirects.includes("/register"));
    });
    
    // Subscribe to the user's login state
    this.authService.userLoggedIn.subscribe((loggedIn: boolean) => {
      this.userLoggedIn = loggedIn;
    });
  }

  ngOnInit(): void {}

  onMenuToggled(isToggled: boolean) {
    this.isMenuToggled = isToggled;
    const sidebar = document.getElementById('accordionSidebar');
    if (this.isMenuToggled) {
      sidebar?.classList.add('toggled');
    } else {
      sidebar?.classList.remove('toggled');
    }
  }

  onLogout(loggedIn: boolean) {
    this.userLoggedIn = loggedIn;
  }
}
