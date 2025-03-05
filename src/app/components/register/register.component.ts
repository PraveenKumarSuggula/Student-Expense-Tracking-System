import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formvalid: boolean = false;
  passwordType: string = 'Password'; 

  signUpForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]] //, Validators.minLength(6)
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  register() {
    if (this.signUpForm.invalid) {
      this.formvalid = true;
      return;
    }

    this.authService.signUp(this.signUpForm.value).subscribe(registrationSuccess => {
      if (registrationSuccess) {
        this.toastr.success('Registration successful!');
        this.signUpForm.reset();
        this.router.navigate(['/login']);
      } else {
        // this.toastr.error('Username already exists');
      }
    });
  }
}
