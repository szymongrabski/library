import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CoverType } from '../../models/cover-type.model';
import { AgeGroup } from '../../models/age-group.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-filter-panel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './book-filter-panel.component.html',
  styleUrl: './book-filter-panel.component.scss',
})
export class BookFilterPanelComponent {
  protected searchTitle: string = '';
  protected isAvailable: boolean = false;
  protected ageGroup: AgeGroup | null = null;
  protected coverType: CoverType | null = null;

  protected ageGroups = Object.values(AgeGroup);
  protected coverTypes = Object.values(CoverType);

  public constructor(private bookService: BookService) {}

  protected onFilterChange(): void {
    this.bookService.filterBooks(
      this.searchTitle,
      this.isAvailable,
      this.ageGroup,
      this.coverType
    );
  }

  protected clearFilters(): void {
    this.searchTitle = '';
    this.isAvailable = false;
    this.ageGroup = null;
    this.coverType = null;
    this.bookService.clearFilters();
  }
}
