import { Component, computed, OnInit} from '@angular/core';
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
export class BookTableComponent{
  paginatedBooks = computed(() => this.bookService.paginatedBooks());
  totalPages = computed(() => this.bookService.totalPages());
  currentPage = computed(() => this.bookService.currentPage());

  constructor(private bookService: BookService) {} 

  titleSortDirection: "asc" | "desc" = "asc";
  amountSortDirection: "asc" | "desc" = "asc";
  idSortDirection: "asc" | "desc" = "asc";
  dateSortDirection: "asc" | "desc" = "asc";

  nextPage(): void {
    this.bookService.nextPage();
  }

  prevPage(): void {
    this.bookService.prevPage();
  }

  sortByTitle(): void {
    this.bookService.sortByTitle(this.titleSortDirection);
    this.titleSortDirection = this.titleSortDirection === "asc" ? "desc" : "asc";
  }

  sortByAmount(): void {
    this.bookService.sortByAmount(this.amountSortDirection)
    this.amountSortDirection = this.amountSortDirection === "asc" ? "desc" : "asc";
  }

  sortById(): void {
    this.bookService.sortById(this.idSortDirection)
    this.idSortDirection = this.idSortDirection=== "asc" ? "desc" : "asc";
  }
  sortByPublishedDate(): void {
    this.bookService.sortByPublishedDate(this.dateSortDirection);
    this.dateSortDirection = this.dateSortDirection === "asc" ? "desc" : "asc";
  }
}
