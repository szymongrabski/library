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
  styleUrl: './book.component.scss'
})
export class BookComponent implements OnInit {
  @Input() bookId: number | undefined; 
  public book: Book | null = null;
  public authors: Author[] = [];
  public isLoggedIn: boolean = false;
  public hasUserRentedBook: boolean = false;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private authSerivce: AuthService,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
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
        }
      });
    }
  }


  private loadAuthors(authorIds: number[]): void {
    this.authors = this.authorService.getAuthorsByIds(authorIds);
  }

  public rentBook(): void {
    if (this.bookId) {
      this.rentalService.rentBook(this.bookId).subscribe({
        next: (response) => {
          this.hasUserRentedBook = true;
          this.bookService.loadAllBooks();
        }
      });
    }
  }

  private checkIfUserHasRentedBook(): void {
    const userId = this.authSerivce.getUserId(); 
    if (userId && this.bookId) {
      this.rentalService.getRentalsByUserId(userId).subscribe({
        next: (rentals) => {
          this.hasUserRentedBook = rentals.some(rental => rental.bookId == this.bookId);
        },
        error: (err) => {
          console.error('Failed to check if user has rented the book:', err);
        }
      });
    }
  }
}
