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
import { ModalComponent } from '../modal/modal.component';
import { AgeGroup } from '../../models/age-group.model';
import { CoverType } from '../../models/cover-type.model';
import { BookForm } from '../../models/book.form.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  protected isEditMode: boolean = false;
  private bookId?: number;
  protected authors: Author[] = [];
  protected publishers: Publisher[] = [];
  protected selectedAuthors: Author[] = [];
  protected ageGroups = Object.values(AgeGroup);
  protected coverTypes = Object.values(CoverType);
  protected showModal: boolean = false;
  protected message: string = 'Are you sure you want to add this book?';

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private bookService: BookService
  ) {}

  protected bookForm: FormGroup<BookForm> = new FormGroup<BookForm>({
    isbn: new FormControl<string | null>('', Validators.required),
    title: new FormControl<string | null>('', Validators.required),
    quantity: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    publisher: new FormControl<string | null>('', Validators.required),
    authors: new FormControl<number[] | null>([], Validators.required),
    imageUrl: new FormControl<string | null>('', Validators.required),
    publishedDate: new FormControl<string | null>('', [
      Validators.required,
      pastDateValidator(),
    ]),
    bookDetails: new FormGroup({
      pageCount: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
      ]),
      description: new FormControl<string | null>(''),
      coverType: new FormControl<CoverType | null>(null, Validators.required),
      ageGroup: new FormControl<AgeGroup | null>(null, Validators.required),
    }),
  });

  public ngOnInit(): void {
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

  protected onAuthorSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;

    const selectedAuthorId = Number(target.value);
    const author = this.authors.find((a) => a.id === selectedAuthorId);

    if (author && !this.selectedAuthors.includes(author)) {
      this.selectedAuthors.push(author);
      this.bookForm
        .get('authors')
        ?.setValue(this.selectedAuthors.map((author) => author.id));
    }
  }

  protected removeAuthor(authorId: number): void {
    this.selectedAuthors = this.selectedAuthors.filter(
      (author) => author.id !== authorId
    );
    this.bookForm
      .get('authors')
      ?.setValue(this.selectedAuthors.map((author) => author.id));
  }

  protected resetForm(): void {
    this.bookForm.reset();
    this.selectedAuthors = [];
  }

  protected preSubmit(): void {
    this.showModal = true;
  }

  protected onModalResult(result: boolean): void {
    if (result) {
      this.onSubmit();
    }
    this.showModal = false;
  }

  protected onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    const bookDetails = this.bookForm.value.bookDetails;

    const book: Book = {
      id: this.bookId || 0,
      isbn: this.bookForm.value.isbn!,
      title: this.bookForm.value.title!,
      quantity: this.bookForm.value.quantity!,
      publisherName: this.bookForm.value.publisher!,
      authors: this.selectedAuthors.map((author) => author.id),
      imageUrl: this.bookForm.value.imageUrl!,
      publishedDate: this.bookForm.value.publishedDate!,
      bookDetails: {
        pageCount: bookDetails!.pageCount!,
        description: bookDetails!.description!,
        coverType: bookDetails!.coverType!,
        ageGroup: bookDetails!.ageGroup!,
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
