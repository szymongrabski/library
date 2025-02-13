import { Component, OnInit, Input } from '@angular/core';
import { BookService } from '../../services/book.service';
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
  @Input() public bookId: number | undefined;
  protected book: Book | null = null;
  protected authors: Author[] = [];
  protected isLoggedIn: boolean = false;
  protected hasUserRentedBook: boolean = false;
  protected showModal: boolean = false;
  public message: string = 'Are you sure you want to rent this book?';

  public constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private authSerivce: AuthService,
    private rentalService: RentalService
  ) {}

  public ngOnInit(): void {
    this.isLoggedIn = this.authSerivce.isAuthenticated();
    if (this.bookId) {
      this.loadBookData();
      if (this.isLoggedIn) {
        this.checkIfUserHasRentedBook();
      }
    }
  }

  private loadBookData(): void {
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.book = book;
          this.loadAuthors(book.authors);
        },
        error: (err) => {
          console.error('Failed to load book data:', err);
        },
      });
    }
  }

  private loadAuthors(authorIds: number[]): void {
    this.authors = this.authorService.getAuthorsByIds(authorIds);
  }

  public rentBook(): void {
    if (this.bookId) {
      this.rentalService.rentBook(this.bookId).subscribe({
        next: (_response) => {
          this.hasUserRentedBook = true;
          this.bookService.loadAllBooks();
        },
      });
    }
  }

  private checkIfUserHasRentedBook(): void {
    const userId = this.authSerivce.getUserId();
    if (userId && this.bookId) {
      this.rentalService.getRentalsByUserId().subscribe({
        next: (rentals) => {
          this.hasUserRentedBook = rentals.some(
            (rental) => rental.bookId == this.bookId
          );
        },
        error: (err) => {
          console.error('Failed to check if user has rented the book:', err);
        },
      });
    }
  }
}
