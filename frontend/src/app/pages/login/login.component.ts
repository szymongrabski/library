import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;
  protected errorMessage = '';

  public constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  protected login(): void {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        let redirectUrl = '/home';

        if (role === 'ADMIN') {
          redirectUrl = '/admin-panel';
        } else if (role === 'USER') {
          redirectUrl = '/user-panel';
        }

        this.router.navigate([redirectUrl]);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }
}
