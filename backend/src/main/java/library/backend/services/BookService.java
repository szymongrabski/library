package library.backend.services;

import jakarta.transaction.Transactional;
import library.backend.dtos.BookDTO;
import library.backend.entities.Author;
import library.backend.entities.Book;
import library.backend.entities.Publisher;
import library.backend.exceptions.AuthorNotFoundException;
import library.backend.exceptions.BookNotFoundException;
import library.backend.exceptions.PublisherNotFoundException;
import library.backend.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorService authorService;
    private final PublisherService publisherService;

    public Page<BookDTO> getBooks(int page, int size) {
        return bookRepository.findAll(PageRequest.of(page, size)).map(this::convertToDTO);
    }

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        return convertToDTO(book);
    }

    @Transactional
    public BookDTO createBook(BookDTO bookDTO) {
        Publisher publisher = publisherService.getPublisherByName(bookDTO.getPublisherName())
                .orElseThrow(() -> new PublisherNotFoundException(bookDTO.getPublisherName()));

        Set<Long> authorIds = bookDTO.getAuthors();
        Set<Author> authors = new HashSet<>();
        for (Long authorId : authorIds) {
            Author author = authorService.getAuthorById(authorId)
                    .orElseThrow(() -> new AuthorNotFoundException(authorId));
            authors.add(author);
        }

        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setIsbn(bookDTO.getIsbn());
        book.setQuantity(bookDTO.getQuantity());
        book.setPublisher(publisher);
        book.setAuthors(authors);

        book = bookRepository.save(book);

        Set<Long> authorIdsResult = authors.stream()
                .map(Author::getId)
                .collect(Collectors.toSet());

        return new BookDTO(
                book.getId(),
                book.getIsbn(),
                book.getTitle(),
                book.getQuantity(),
                book.getDescription(),
                book.getPublisher().getName(),
                authorIdsResult
        );
    }

    @Transactional
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));

        existingBook.setTitle(bookDTO.getTitle());
        existingBook.setDescription(bookDTO.getDescription());
        existingBook.setQuantity(bookDTO.getQuantity());
        existingBook.setIsbn(bookDTO.getIsbn());

        Publisher publisher = publisherService.getPublisherByName(bookDTO.getPublisherName())
                .orElseThrow(() -> new PublisherNotFoundException(bookDTO.getPublisherName()));
        existingBook.setPublisher(publisher);

        Set<Author> authors = bookDTO.getAuthors().stream()
                .map(authorId -> authorService.getAuthorById(authorId)
                        .orElseThrow(() -> new AuthorNotFoundException(authorId)))
                .collect(Collectors.toSet());
        existingBook.setAuthors(authors);

        bookRepository.save(existingBook);
        return convertToDTO(existingBook);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        bookRepository.delete(book);
    }

    public BookDTO convertToDTO(Book book) {
        return BookDTO.builder()
                .id(book.getId())
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .quantity(book.getQuantity())
                .description(book.getDescription())
                .publisherName(book.getPublisher().getName())
                .authors(book.getAuthors().stream()
                        .map(Author::getId)
                        .collect(Collectors.toSet()))
                .build();
    }
}
