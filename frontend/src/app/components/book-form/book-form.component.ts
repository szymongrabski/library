import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../../models/author.model';
import { Publisher } from '../../models/publisher.model';
import { Book } from '../../models/book.model';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorService } from '../../services/author.service';
import { PublisherService } from '../../services/publisher.service';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { pastDateValidator } from '../../validators/pastDateValidator';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss'
})
export class BookFormComponent implements OnInit {
  public isEditMode: boolean = false;
  private bookId?: number;
  public authors: Author[] = [];
  public publishers: Publisher[] = [];
  public selectedAuthors: Author[] = [];

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
    description: new FormControl(''),
    publisher: new FormControl('', Validators.required),
    authors: new FormControl([], Validators.required),
    imageUrl: new FormControl('', Validators.required),
    publishedDate: new FormControl('', [Validators.required, pastDateValidator()]),
  });

  ngOnInit(): void {
    this.loadAuthorsAndPublishers();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = +params['id'];
        this.loadBookData();
      }
    });
  }

  private loadAuthorsAndPublishers(): void {
    this.authorService.getAllAuthors().subscribe(authors => (this.authors = authors));
    this.publisherService.getAllPublishers().subscribe(publishers => (this.publishers = publishers));
  }

  private loadBookData(): void {
    if (!this.bookId) return;

    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          isbn: book.isbn,
          title: book.title,
          quantity: book.quantity,
          description: book.description,
          publisher: book.publisherName,
          authors: book.authors,
          imageUrl: book.imageUrl,
          publishedDate: book.publishedDate
        });
        this.selectedAuthors = this.authors.filter(author => book.authors.includes(author.id));
      },
      error: (err) => console.error('Failed to load book', err),
    });
  }

  public onAuthorSelect(event: any): void {
    const selectedAuthorId = event.target.value;
    const author = this.authors.find(a => a.id === +selectedAuthorId);
    if (author && !this.selectedAuthors.includes(author)) {
      this.selectedAuthors.push(author);
      this.bookForm.get('authors')?.setValue(this.selectedAuthors.map(author => author.id));
    }
  }

  public removeAuthor(authorId: number): void {
    this.selectedAuthors = this.selectedAuthors.filter(author => author.id !== authorId);
    this.bookForm.get('authors')?.setValue(this.selectedAuthors.map(author => author.id));
  }

  public resetForm(): void {
    this.bookForm.reset(); 
    this.selectedAuthors = []; 
  }

  public onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    const book: Book = {
      id: this.bookId || 0,
      isbn: this.bookForm.value.isbn!,
      title: this.bookForm.value.title!,
      quantity: this.bookForm.value.quantity!,
      description: this.bookForm.value.description!,
      publisherName: this.bookForm.value.publisher,
      authors: this.selectedAuthors.map(author => author.id),
      imageUrl: this.bookForm.value.imageUrl,
      publishedDate: this.bookForm.value.publishedDate
    };

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, book).subscribe({
        next: () => {
          this.bookService.loadAllBooks();
          this.router.navigate(['/admin-panel'])
        },
        error: (err) => console.error('Failed to update book', err)
      });
    } else {
      this.bookService.createBook(book).subscribe({
        next: () => {
          this.bookService.loadAllBooks();
          this.resetForm(); 
        },
        error: (err) => console.error('Failed to add book', err)
      });
    }
  }
}
