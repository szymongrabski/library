import { Component, OnDestroy } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { BookListComponent } from '../../components/book-list/book-list.component';
import { BookFilterPanelComponent } from '../../components/book-filter-panel/book-filter-panel.component';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavBarComponent, BookListComponent, BookFilterPanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  public constructor(private bookService: BookService) {}

  public ngOnDestroy(): void {
    this.bookService.clearFilters();
  }
}
