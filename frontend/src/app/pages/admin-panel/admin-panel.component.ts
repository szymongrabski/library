import { Component, OnDestroy } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { BookTableComponent } from '../../components/book-table/book-table.component';
import { BookFormComponent } from '../../components/book-form/book-form.component';
import { BookFilterPanelComponent } from '../../components/book-filter-panel/book-filter-panel.component';
import { BookService } from '../../services/book.service';

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
  showAddBookForm: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnDestroy(): void {
    this.bookService.clearFilters();
  }

  toggleShowAddBookForm() {
    this.showAddBookForm = !this.showAddBookForm;
  }
}
