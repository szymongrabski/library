import { Component, OnInit, Input } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Author } from '../../models/author.model';
import { AuthorService } from '../../services/author.service';
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

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    if (this.bookId) {
      this.loadBookData();
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
}
