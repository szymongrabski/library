import { Component, computed } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookComponent } from "../book/book.component";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {
  paginatedBooks = computed(() => this.bookService.paginatedBooks());
  totalPages = computed(() => this.bookService.totalPages());
  currentPage = computed(() => this.bookService.currentPage());

  constructor(private bookService: BookService) {} 

  nextPage(): void {
    this.bookService.nextPage();
  }

  prevPage(): void {
    this.bookService.prevPage();
  }

}
