import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../models/book.model';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { AuthService } from '../../services/auth.service';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent implements OnInit {
  @Input() public book: Book | undefined;
  protected authors: Author[] = [];
  protected isLoggedIn: boolean = false;
  protected hasUserRentedBook: boolean = false;
  protected showModal: boolean = false;
  public message: string = 'Are you sure you want to rent this book?';

  public constructor(
    private authorService: AuthorService,
    private authSerivce: AuthService,
    private rentalService: RentalService
  ) {}

  public ngOnInit(): void {
    this.isLoggedIn = this.authSerivce.isAuthenticated();
    if (this.book) {
      this.loadAuthors(this.book.authors);
      if (this.isLoggedIn) {
        this.checkIfUserHasRentedBook();
      }
    }
  }

  private loadAuthors(authorIds: number[]): void {
    this.authors = this.authorService.getAuthorsByIds(authorIds);
  }

  public rentBook(): void {
    if (this.book) {
      this.rentalService.rentBook(this.book.id).subscribe({
        next: (_response) => {
          this.hasUserRentedBook = true;
        },
      });
    }
  }

  private checkIfUserHasRentedBook(): void {
    const userId = this.authSerivce.getUserId();
    if (userId && this.book) {
      this.rentalService.getRentalsByUserId().subscribe({
        next: (rentals) => {
          this.hasUserRentedBook = rentals.some(
            (rental) => rental.bookId == this.book?.id
          );
        },
        error: (_err) => {
          this.hasUserRentedBook = true;
        },
      });
    }
  }
}
