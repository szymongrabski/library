import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { canActivateAdminGuard } from './guards/can-activate-admin.guard';
import { UserPanelComponent } from './pages/user-panel/user-panel.component';
import { canActivateUserGuard } from './guards/can-activate-user.guard';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { AdminRentalsComponent } from './pages/admin-rentals/admin-rentals.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'user-panel',
    component: UserPanelComponent,
    canActivate: [canActivateUserGuard],
  },
  {
    path: 'admin-rentals',
    component: AdminRentalsComponent,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'books/:id',
    component: BookDetailsComponent,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: '/not-found' },
];
