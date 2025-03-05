import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formvalid: boolean = false;
  passwordType: string = 'Password'; 
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required]] //, Validators.minLength(6)
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  login() {
    if (this.loginForm.invalid) {
      this.formvalid = true;
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(loginSuccess => {
      if (loginSuccess) {
        localStorage.setItem('username', this.loginForm.value.username);
        this.toastr.success('Login successful!');
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error('Invalid credentials');
      }
    });
  }

  copyText(elementId: string) {
    const textElement = document.getElementById(elementId);
    if (textElement) {
        const range = document.createRange();
        range.selectNode(textElement);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        document.execCommand('copy');
        window.getSelection()?.removeAllRanges();
    }
}
}
