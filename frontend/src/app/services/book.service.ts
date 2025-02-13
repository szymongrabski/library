import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { Observable } from 'rxjs';
import { AgeGroup } from '../models/age-group.model';
import { CoverType } from '../models/cover-type.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private allBooks = signal<Book[]>([]);
  private books = signal<Book[]>([]);
  private page = signal<number>(0);
  private size: number = 9;

  private constructor(private http: HttpClient) {
    this.loadAllBooks();
  }

  public filterBooks(
    searchTitle: string,
    isAvailable: boolean,
    ageGroup: AgeGroup | null,
    coverType: CoverType | null
  ): void {
    let filtered = this.allBooks();

    if (searchTitle) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (isAvailable) {
      filtered = filtered.filter((book) => book.quantity > 0);
    }

    if (ageGroup) {
      filtered = filtered.filter(
        (book) => book.bookDetails.ageGroup === ageGroup
      );
    }

    if (coverType) {
      filtered = filtered.filter(
        (book) => book.bookDetails.coverType === coverType
      );
    }

    this.books.set(filtered);
  }

  public loadAllBooks(): void {
    this.http.get<Book[]>(`${this.apiUrl}/all`).subscribe((data) => {
      this.allBooks.set(data);
      this.books.set(data);
    });
  }

  public clearFilters(): void {
    this.books.set(this.allBooks());
  }
  public sortByTitle(direction: 'asc' | 'desc'): void {
    const sortedBooks = [...this.books()];
    sortedBooks.sort((a, b) => {
      return direction === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });

    this.books.set(sortedBooks);
  }

  public sortByAmount(direction: 'asc' | 'desc'): void {
    const sortedBooks = [...this.books()];
    sortedBooks.sort((a, b) => {
      return direction === 'asc'
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    });
    this.books.set(sortedBooks);
  }

  public sortById(direction: 'asc' | 'desc'): void {
    const sortedBooks = [...this.books()];
    sortedBooks.sort((a, b) => {
      return direction === 'asc' ? a.id - b.id : b.id - a.id;
    });
    this.books.set(sortedBooks);
  }

  public sortByPublishedDate(direction: 'asc' | 'desc'): void {
    const sortedBooks = [...this.books()];
    sortedBooks.sort((a, b) => {
      const dateA = new Date(a.publishedDate);
      const dateB = new Date(b.publishedDate);

      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
    this.books.set(sortedBooks);
  }

  public paginatedBooks(): Book[] {
    const start = this.page() * this.size;

    return this.books().slice(start, start + this.size);
  }

  public totalPages(): number {
    return Math.ceil(this.books().length / this.size);
  }

  public currentPage(): number {
    return this.page();
  }

  public nextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update((p) => p + 1);
    }
  }

  public prevPage(): void {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
    }
  }

  public deleteBook(bookId: number): void {
    this.http.delete(`${this.apiUrl}/${bookId}`).subscribe({
      next: () => {
        this.loadAllBooks();
      },
    });
  }

  public getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${bookId}`);
  }

  public createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  public updateBook(bookId: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${bookId}`, book);
  }

  public getBooks(): Book[] {
    return this.allBooks();
  }
}
