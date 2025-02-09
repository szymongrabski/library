import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  public isEditMode: boolean = false;
  private userId?: string | null;

  public constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  protected userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)])
  });

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId'); 
    if (this.userId) {
      this.isEditMode = true;
      this.loadUserData();
    }
  }

  private loadUserData(): void {
    if (!this.userId) return;
  
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userForm.patchValue({
          email: user.email,
          password: '',
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        });
      },
      error: (err) => console.error('Failed to load user', err),
    });
  }

  public onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const user: User = {
      email: this.userForm.value.email!,
      password: this.userForm.value.password!,
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      phoneNumber: this.userForm.value.phoneNumber!
    };

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(user).subscribe({
        next: () => {
          localStorage.setItem('firstName', this.userForm.value.firstName);
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Failed to update user', err)
      });
    } else {
      this.authService.register(user).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Failed to register user', err)
      });
    }
  }

  public resetForm(): void {
    this.userForm.reset();
  }
}