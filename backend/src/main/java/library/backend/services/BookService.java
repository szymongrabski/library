package library.backend.services;

import jakarta.transaction.Transactional;
import library.backend.dtos.BookDTO;
import library.backend.dtos.BookDetailsDTO;
import library.backend.entities.Author;
import library.backend.entities.Book;
import library.backend.entities.BookDetails;
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
import java.util.List;
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

    public List<BookDTO> getBooks() {
        return bookRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        return convertToDTO(book);
    }

    public BookDTO convertToDTO(Book book) {
        BookDetailsDTO bookDetailsDTO = book.getBookDetails() != null ?
                new BookDetailsDTO(
                        book.getBookDetails().getPageCount(),
                        book.getBookDetails().getDescription(),
                        book.getBookDetails().getCoverType(),
                        book.getBookDetails().getAgeGroup()
                ) : null;

        return BookDTO.builder()
                .id(book.getId())
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .quantity(book.getQuantity())
                .publisherName(book.getPublisher().getName())
                .imageUrl(book.getImageUrl())
                .publishedDate(book.getPublishedDate())
                .authors(book.getAuthors().stream()
                        .map(Author::getId)
                        .collect(Collectors.toSet()))
                .bookDetails(bookDetailsDTO)
                .build();
    }

    @Transactional
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));

        existingBook.setTitle(bookDTO.getTitle());
        existingBook.setQuantity(bookDTO.getQuantity());
        existingBook.setIsbn(bookDTO.getIsbn());
        existingBook.setImageUrl(bookDTO.getImageUrl());
        existingBook.setPublishedDate(bookDTO.getPublishedDate());

        Publisher publisher = publisherService.getPublisherByName(bookDTO.getPublisherName())
                .orElseThrow(() -> new PublisherNotFoundException(bookDTO.getPublisherName()));
        existingBook.setPublisher(publisher);

        Set<Author> authors = bookDTO.getAuthors().stream()
                .map(authorId -> authorService.getAuthorById(authorId)
                        .orElseThrow(() -> new AuthorNotFoundException(authorId)))
                .collect(Collectors.toSet());

        existingBook.setAuthors(authors);

        if (bookDTO.getBookDetails() != null) {
            BookDetails bookDetails = new BookDetails(
                    bookDTO.getBookDetails().getPageCount(),
                    bookDTO.getBookDetails().getDescription(),
                    bookDTO.getBookDetails().getCoverType(),
                    bookDTO.getBookDetails().getAgeGroup()
            );
            existingBook.setBookDetails(bookDetails);
        }

        bookRepository.save(existingBook);
        return convertToDTO(existingBook);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        bookRepository.delete(book);
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

        BookDetails bookDetails = bookDTO.getBookDetails() != null ?
                new BookDetails(
                        bookDTO.getBookDetails().getPageCount(),
                        bookDTO.getBookDetails().getDescription(),
                        bookDTO.getBookDetails().getCoverType(),
                        bookDTO.getBookDetails().getAgeGroup()
                ) : null;

        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setIsbn(bookDTO.getIsbn());
        book.setQuantity(bookDTO.getQuantity());
        book.setPublisher(publisher);
        book.setAuthors(authors);
        book.setImageUrl(bookDTO.getImageUrl());
        book.setPublishedDate(bookDTO.getPublishedDate());
        book.setBookDetails(bookDetails);

        book = bookRepository.save(book);

        return convertToDTO(book);
    }
}
