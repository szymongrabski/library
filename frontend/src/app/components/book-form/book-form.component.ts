import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../models/author.model';
import { Publisher } from '../../models/publisher.model';
import { Book } from '../../models/book.model';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthorService } from '../../services/author.service';
import { PublisherService } from '../../services/publisher.service';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { pastDateValidator } from '../../validators/pastDateValidator';
import { CoverType } from '../../models/cover-type.model';
import { AgeGroup } from '../../models/age-group.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  public isEditMode: boolean = false;
  private bookId?: number;
  public authors: Author[] = [];
  public publishers: Publisher[] = [];
  public selectedAuthors: Author[] = [];
  public ageGroups = Object.values(AgeGroup);
  public coverTypes = Object.values(CoverType);
  public showModal: boolean = false;
  public message: string = 'Are you sure you want to add this book?';

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private bookService: BookService
  ) {}

  protected bookForm: FormGroup = new FormGroup({
    isbn: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
    publisher: new FormControl('', Validators.required),
    authors: new FormControl([], Validators.required),
    imageUrl: new FormControl('', Validators.required),
    publishedDate: new FormControl('', [
      Validators.required,
      pastDateValidator(),
    ]),

    bookDetails: new FormGroup({
      pageCount: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
      description: new FormControl(''),
      coverType: new FormControl('', Validators.required),
      ageGroup: new FormControl('', Validators.required),
    }),
  });

  ngOnInit(): void {
    this.loadAuthorsAndPublishers();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = +params['id'];
        this.loadBookData();
        this.message = 'Are you sure you want to edit this book?';
      }
    });
  }

  private loadAuthorsAndPublishers(): void {
    this.authorService
      .getAllAuthors()
      .subscribe((authors) => (this.authors = authors));
    this.publisherService
      .getAllPublishers()
      .subscribe((publishers) => (this.publishers = publishers));
  }

  private loadBookData(): void {
    if (!this.bookId) return;

    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          isbn: book.isbn,
          title: book.title,
          quantity: book.quantity,
          publisher: book.publisherName,
          authors: book.authors,
          imageUrl: book.imageUrl,
          publishedDate: book.publishedDate,
          bookDetails: {
            coverType: book.bookDetails.coverType,
            ageGroup: book.bookDetails.ageGroup,
            pageCount: book.bookDetails.pageCount,
            description: book.bookDetails.description,
          },
        });
        this.selectedAuthors = this.authors.filter((author) =>
          book.authors.includes(author.id)
        );
      },
      error: (err) => console.error('Failed to load book', err),
    });
  }

  public onAuthorSelect(event: any): void {
    const selectedAuthorId = event.target.value;
    const author = this.authors.find((a) => a.id === +selectedAuthorId);
    if (author && !this.selectedAuthors.includes(author)) {
      this.selectedAuthors.push(author);
      this.bookForm
        .get('authors')
        ?.setValue(this.selectedAuthors.map((author) => author.id));
    }
  }

  public removeAuthor(authorId: number): void {
    this.selectedAuthors = this.selectedAuthors.filter(
      (author) => author.id !== authorId
    );
    this.bookForm
      .get('authors')
      ?.setValue(this.selectedAuthors.map((author) => author.id));
  }

  public resetForm(): void {
    this.bookForm.reset();
    this.selectedAuthors = [];
  }

  public preSubmit(): void {
    this.showModal = true;
  }

  onModalResult(result: boolean) {
    if (result) {
      this.onSubmit();
    }
    this.showModal = false;
  }

  public onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    const bookDetails = this.bookForm.value.bookDetails;

    const book: Book = {
      id: this.bookId || 0,
      isbn: this.bookForm.value.isbn!,
      title: this.bookForm.value.title!,
      quantity: this.bookForm.value.quantity!,
      publisherName: this.bookForm.value.publisher,
      authors: this.selectedAuthors.map((author) => author.id),
      imageUrl: this.bookForm.value.imageUrl,
      publishedDate: this.bookForm.value.publishedDate,
      bookDetails: {
        pageCount: bookDetails.pageCount,
        description: bookDetails.description,
        coverType: bookDetails.coverType,
        ageGroup: bookDetails.ageGroup,
      },
    };

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, book).subscribe({
        next: () => {
          this.bookService.loadAllBooks();
          this.router.navigate(['/admin-panel']);
        },
        error: (err) => console.error('Failed to update book', err),
      });
    } else {
      this.bookService.createBook(book).subscribe({
        next: () => {
          this.bookService.loadAllBooks();
          this.resetForm();
        },
        error: (err) => console.error('Failed to add book', err),
      });
    }
  }
}
