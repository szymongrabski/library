import { Component, Input, OnInit } from '@angular/core';
import { Rental } from '../../models/rental.model';
import { RentalService } from '../../services/rental.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './rental.component.html',
  styleUrl: './rental.component.scss',
})
export class RentalComponent implements OnInit {
  @Input() public rental: Rental | null = null;
  protected message: string = '';
  protected showModal: boolean = false;
  public constructor(private rentalService: RentalService) {}

  public ngOnInit(): void {
    console.log(this.rental);
  }

  public isPending(): boolean {
    this.message = 'Are you sure you want to approve this rental?';

    return this.rental?.status === 'PENDING';
  }

  public isRented(): boolean {
    this.message = 'Are you sure you want to return this rental?';

    return this.rental?.status === 'RENTED';
  }

  public isReturned(): boolean {
    this.message = 'Are you sure you want to delete this rental?';

    return this.rental?.status === 'RETURNED';
  }

  protected prehandleAction() {
    this.showModal = true;
  }

  protected onModalResult(result: boolean): void {
    if (result) {
      if (this.isPending()) {
        this.acceptRental();
      } else if (this.isRented()) {
        this.returnRental();
      } else if (this.isReturned()) {
        this.deleteRental();
      }
    }
    this.showModal = false;
  }

  private acceptRental(): void {
    if (this.rental && this.rental.id) {
      this.rentalService.approveRental(this.rental.id).subscribe(() => {
        this.rentalService.loadAllRentals();
      });
    }
  }

  private returnRental(): void {
    if (this.rental && this.rental.id) {
      this.rentalService.returnBook(this.rental.id).subscribe(() => {
        this.rentalService.loadAllRentals();
      });
    }
  }

  private deleteRental(): void {
    if (this.rental && this.rental.id) {
      this.rentalService.deleteRental(this.rental.id).subscribe(() => {
        this.rental = null;
      });
    }
  }
}
