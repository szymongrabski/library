import { Component, OnInit } from '@angular/core';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental.model';
import { CommonModule } from '@angular/common';
import { BookGeneralComponent } from '../book-general/book-general.component';

@Component({
  selector: 'app-user-rentals',
  standalone: true,
  imports: [CommonModule, BookGeneralComponent],
  templateUrl: './user-rentals.component.html',
  styleUrls: ['./user-rentals.component.scss'],
})
export class UserRentalsComponent implements OnInit {
  protected rentals: Rental[] = [];

  public constructor(private rentalService: RentalService) {}

  public ngOnInit(): void {
    this.loadRentals();
  }

  private loadRentals(): void {
    this.rentalService.getRentalsByUserId().subscribe({
      next: (rentals: Rental[]) => {
        this.rentals = rentals;
      },
    });
  }
}
