import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormComponent } from '../../components/book-form/book-form.component';
import { BookDetailsInfoComponent } from '../../components/book-details-info/book-details-info.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    NavBarComponent,
    BookFormComponent,
    BookDetailsInfoComponent,
    ModalComponent,
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent implements OnInit {
  protected bookId!: number;
  protected showEditForm: boolean = false;
  protected showModal: boolean = false;

  public constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected preHandleDelete(): void {
    this.showModal = true;
  }

  protected onModalResult(result: boolean): void {
    if (result) {
      this.handleDelete();
    }
    this.showModal = false;
  }

  protected handleDelete(): void {
    this.bookService.deleteBook(this.bookId);
    this.router.navigate(['/admin-panel']);
  }

  protected handleGoBack(): void {
    this.router.navigate(['/admin-panel']);
  }

  public ngOnInit(): void {
    this.route.params.subscribe((res: { id?: string }) => {
      if (res.id) {
        this.bookId = +res.id;
      }
    });
  }

  protected toggleShowEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }
}
