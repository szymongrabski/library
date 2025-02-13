import { Component, computed } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.scss'],
})
export class BookTableComponent {
  protected paginatedBooks = computed(() => this.bookService.paginatedBooks());
  protected totalPages = computed(() => this.bookService.totalPages());
  protected currentPage = computed(() => this.bookService.currentPage());

  public constructor(private bookService: BookService) {}

  protected titleSortDirection: 'asc' | 'desc' = 'asc';
  protected amountSortDirection: 'asc' | 'desc' = 'asc';
  protected idSortDirection: 'asc' | 'desc' = 'asc';
  protected dateSortDirection: 'asc' | 'desc' = 'asc';

  protected nextPage(): void {
    this.bookService.nextPage();
  }

  protected prevPage(): void {
    this.bookService.prevPage();
  }

  protected sortByTitle(): void {
    this.bookService.sortByTitle(this.titleSortDirection);
    this.titleSortDirection =
      this.titleSortDirection === 'asc' ? 'desc' : 'asc';
  }

  protected sortByAmount(): void {
    this.bookService.sortByAmount(this.amountSortDirection);
    this.amountSortDirection =
      this.amountSortDirection === 'asc' ? 'desc' : 'asc';
  }

  protected sortById(): void {
    this.bookService.sortById(this.idSortDirection);
    this.idSortDirection = this.idSortDirection === 'asc' ? 'desc' : 'asc';
  }

  protected sortByPublishedDate(): void {
    this.bookService.sortByPublishedDate(this.dateSortDirection);
    this.dateSortDirection = this.dateSortDirection === 'asc' ? 'desc' : 'asc';
  }
}
