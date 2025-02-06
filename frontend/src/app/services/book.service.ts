import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environgment';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl;
  private allBooks = signal<Book[]>([]); 
  private page = signal<number>(0);
  private size = signal<number>(10);

  constructor(private http: HttpClient) {
    this.loadAllBooks(); 
  }

  loadAllBooks(): void {
    this.http.get<Book[]>(`${this.apiUrl}/books/all`).subscribe(data => {
      this.allBooks.set(data);
    });
  }

  sortByTitle(direction: "asc" | "desc"): void {
    const sortedBooks = [...this.allBooks()];
    sortedBooks.sort((a, b) => {
      if (direction === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    this.allBooks.set(sortedBooks); 
  }

  sortByAmount(direction: "asc" | "desc"): void {
    const sortedBooks = [...this.allBooks()];
    sortedBooks.sort((a, b) => {
      if (direction === "asc") {
        return a.quantity - b.quantity;
      } else {
        return b.quantity - a.quantity;
      }
    });
    this.allBooks.set(sortedBooks);
  }

  sortById(direction: "asc" | "desc"): void {
    const sortedBooks = [...this.allBooks()];
    sortedBooks.sort((a, b) => {
      if (direction === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
    this.allBooks.set(sortedBooks);
  }

  paginatedBooks(): Book[] {
    const start = this.page() * this.size();
    return this.allBooks().slice(start, start + this.size());
  }

  totalPages(): number {
    return Math.ceil(this.allBooks().length / this.size());
  }

  currentPage(): number {
    return this.page();
  }

  nextPage(): void {
    if (this.page() < this.totalPages() - 1) {
      this.page.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
    }
  }
}
