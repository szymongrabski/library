import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ModalComponent } from '../modal/modal.component';
import { UserForm } from '../../models/user-form.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  protected isEditMode: boolean = false;
  private userId?: string | null;
  protected showModal: boolean = false;

  public constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  protected userForm: FormGroup<UserForm> = new FormGroup<UserForm>({
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    firstName: new FormControl<string | null>('', Validators.required),
    lastName: new FormControl<string | null>('', Validators.required),
    phoneNumber: new FormControl<string | null>('', [
      Validators.required,
      Validators.pattern(/^\d{9}$/),
    ]),
  });

  public ngOnInit(): void {
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
          phoneNumber: user.phoneNumber,
        });
      },
      error: (err) => console.error('Failed to load user', err),
    });
  }

  protected preSubmit(): void {
    if (this.isEditMode) {
      this.showModal = true;
    } else {
      this.onSubmit();
    }
  }

  protected onModalResult(result: boolean): void {
    if (result) {
      this.onSubmit();
    }
    this.showModal = false;
  }

  protected onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const user: User = {
      email: this.userForm.value.email!,
      password: this.userForm.value.password!,
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      phoneNumber: this.userForm.value.phoneNumber!,
    };

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(user).subscribe({
        next: () => {
          if (this.userForm.value.firstName) {
            localStorage.setItem('firstName', this.userForm.value.firstName);
          }
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Failed to update user', err),
      });
    } else {
      this.authService.register(user).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Failed to register user', err),
      });
    }
  }

  protected resetForm(): void {
    this.userForm.reset();
  }
}
