import { Component, OnDestroy } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { BookTableComponent } from '../../components/book-table/book-table.component';
import { BookFormComponent } from '../../components/book-form/book-form.component';
import { BookFilterPanelComponent } from '../../components/book-filter-panel/book-filter-panel.component';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    NavBarComponent,
    BookTableComponent,
    BookFormComponent,
    BookFilterPanelComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnDestroy {
  protected showAddBookForm: boolean = false;

  public constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  public ngOnDestroy(): void {
    this.bookService.clearFilters();
  }

  protected handleShowRentals(): void {
    this.router.navigate(['/admin-rentals']);
  }

  protected toggleShowAddBookForm(): void {
    this.showAddBookForm = !this.showAddBookForm;
  }
}
