import { Component, Input, OnInit } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { BookService } from '../../services/book.service';
import { Author } from '../../models/author.model';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-general',
  standalone: true,
  imports: [],
  templateUrl: './book-general.component.html',
  styleUrl: './book-general.component.scss',
})
export class BookGeneralComponent implements OnInit {
  @Input() public bookId: number | undefined;
  protected book: Book | undefined = undefined;
  protected authors: Author[] = [];
  protected isLoggedIn: boolean = false;
  protected hasUserRentedBook: boolean = false;
  protected showModal: boolean = false;

  public constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  public ngOnInit(): void {
    if (this.bookId) {
      this.loadBookData();
    }
  }

  private loadBookData(): void {
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe((data) => {
        this.book = data;
        this.loadAuthors(this.book.authors);
      });
    }
  }

  private loadAuthors(authorIds: number[]): void {
    this.authors = this.authorService.getAuthorsByIds(authorIds);
  }
}
