import { Component, computed} from '@angular/core';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';

@Component({
  selector: 'app-book-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.scss']
})
export class BookTableComponent {
  constructor(private bookService: BookService) {} 

  paginatedBooks = computed(() => this.bookService.paginatedBooks());
  totalPages = computed(() => this.bookService.totalPages());
  currentPage = computed(() => this.bookService.currentPage());
  titleSortDirection: "asc" | "desc" = "asc";
  amountSortDirection: "asc" | "desc" = "asc";
  idSortDirection: "asc" | "desc" = "asc";

  nextPage() {
    this.bookService.nextPage();
  }

  prevPage() {
    this.bookService.prevPage();
  }

  sortByTitle() {
    this.bookService.sortByTitle(this.titleSortDirection);
    this.titleSortDirection = this.titleSortDirection === "asc" ? "desc" : "asc";
  }

  sortByAmount() {
    this.bookService.sortByAmount(this.amountSortDirection)
    this.amountSortDirection = this.amountSortDirection === "asc" ? "desc" : "asc";
  }

  sortById() {
    this.bookService.sortById(this.idSortDirection)
    this.idSortDirection = this.idSortDirection=== "asc" ? "desc" : "asc";
  }
}
