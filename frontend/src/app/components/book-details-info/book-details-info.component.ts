import { Component, Input, OnInit } from '@angular/core';
import { AgeGroup } from '../../models/age-group.model';
import { CoverType } from '../../models/cover-type.model';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-details-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details-info.component.html',
  styleUrl: './book-details-info.component.scss',
})
export class BookDetailsInfoComponent implements OnInit {
  @Input() public bookId: number | undefined;
  protected book: Book | null = null;
  protected authors: Author[] = [];
  protected isLoggedIn: boolean = false;
  protected hasUserRentedBook: boolean = false;

  public constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private authSerivce: AuthService
  ) {}

  public ngOnInit(): void {
    this.isLoggedIn = this.authSerivce.isAuthenticated();
    if (this.bookId) {
      this.loadBookData();
    }
  }

  private loadBookData(): void {
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.book = book;
          console.log(book);
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

  protected getAgeGroup(ageGroup: AgeGroup): string {
    return ageGroup.toString();
  }

  protected getCoverType(coverType: CoverType): string {
    return coverType.toString();
  }
}
