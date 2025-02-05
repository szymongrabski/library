package library.backend.controllers;

import library.backend.dtos.BookDTO;
import library.backend.entities.Book;
import library.backend.exceptions.AuthorNotFoundException;
import library.backend.exceptions.BookNotFoundException;
import library.backend.exceptions.PublisherNotFoundException;
import library.backend.repositories.BookRepository;
import library.backend.services.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookRepository bookRepository;
    private final BookService bookService;

    public BookController(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<Page<BookDTO>> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookService.getBooks(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BookDTO>> searchBooksByTitle(
            @RequestParam String title,
            Pageable pageable
    ) {
        Page<Book> books = bookRepository.findByTitleContainingIgnoreCase(title, pageable);
        Page<BookDTO> bookDTOPage = books.map(bookService::convertToDTO);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<BookDTO>> filterBooksByQuantity(
            @RequestParam int minQuantity,
            @RequestParam int maxQuantity,
            Pageable pageable
    ) {
        Page<Book> books = bookRepository.findByQuantityBetween(minQuantity, maxQuantity, pageable);
        Page<BookDTO> bookDTOPage = books.map(bookService::convertToDTO);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/search-filter")
    public ResponseEntity<Page<BookDTO>> searchBooksByTitleAndFilter(
            @RequestParam String title,
            @RequestParam int minQuantity,
            @RequestParam int maxQuantity,
            Pageable pageable
    ) {
        Page<Book> books = bookRepository.searchByTitleAndQuantity(title, minQuantity, maxQuantity, pageable);
        Page<BookDTO> bookDTOPage = books.map(bookService::convertToDTO);
        return ResponseEntity.ok(bookDTOPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @Secured("ROLE_ADMIN")
    @PostMapping
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO bookDTO) {
        return ResponseEntity.ok(bookService.createBook(bookDTO));
    }

    @Secured("ROLE_ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long id,
            @RequestBody BookDTO bookDTO
    ) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDTO));
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<String> handleBookNotFoundException(BookNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AuthorNotFoundException.class)
    public ResponseEntity<String> handleAuthorNotFoundException(AuthorNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PublisherNotFoundException.class)
    public ResponseEntity<String> handlePublisherNotFoundException(PublisherNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }
}
