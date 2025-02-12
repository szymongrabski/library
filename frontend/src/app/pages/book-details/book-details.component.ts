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
  bookId!: number;
  showEditForm: boolean = false;
  showModal: boolean = false;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  preHandleDelete(): void {
    this.showModal = true;
  }

  onModalResult(result: boolean) {
    if (result) {
      this.handleDelete();
    }
    this.showModal = false;
  }

  handleDelete(): void {
    this.bookService.deleteBook(this.bookId);
    this.router.navigate(['/admin-panel']);
  }

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      this.bookId = res['id'];
    });
  }

  toggleShowEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }
}
