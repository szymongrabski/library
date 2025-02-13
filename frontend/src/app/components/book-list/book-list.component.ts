import { Component, computed } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookComponent } from '../book/book.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent {
  protected paginatedBooks = computed(() => this.bookService.paginatedBooks());
  protected totalPages = computed(() => this.bookService.totalPages());
  protected currentPage = computed(() => this.bookService.currentPage());

  public constructor(private bookService: BookService) {}

  protected nextPage(): void {
    this.bookService.nextPage();
  }

  protected prevPage(): void {
    this.bookService.prevPage();
  }
}
