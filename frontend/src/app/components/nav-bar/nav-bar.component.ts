import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  private isLoggedIn: boolean = false;
  private isAdmin: boolean = false;

  public constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  protected getFirstName(): string {
    const name = this.authService.getFirstName();

    return name ? name : 'Unknown';
  }

  protected getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  protected getIsAdmin(): boolean {
    return this.isAdmin;
  }
}
