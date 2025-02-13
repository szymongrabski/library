import { Component, computed } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { RentalService } from '../../services/rental.service';
import { RentalComponent } from '../../components/rental/rental.component';

@Component({
  selector: 'app-admin-rentals',
  standalone: true,
  imports: [NavBarComponent, RentalComponent],
  templateUrl: './admin-rentals.component.html',
  styleUrl: './admin-rentals.component.scss',
})
export class AdminRentalsComponent {
  protected paginatedRentals = computed(() =>
    this.rentalService.paginatedRentals()
  );
  protected totalPages = computed(() => this.rentalService.totalPages());
  protected currentPage = computed(() => this.rentalService.currentPage());

  public constructor(
    private router: Router,
    private rentalService: RentalService
  ) {
    rentalService.loadAllRentals();
  }

  protected handleGoBack(): void {
    this.router.navigate(['/admin-panel']);
  }

  protected nextPage(): void {
    this.rentalService.nextPage();
  }

  protected prevPage(): void {
    this.rentalService.prevPage();
  }
}
