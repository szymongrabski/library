package library.backend.services;

import jakarta.transaction.Transactional;
import library.backend.dtos.RentalDTO;
import library.backend.entities.Book;
import library.backend.entities.Rental;
import library.backend.entities.RentalStatus;
import library.backend.entities.User;
import library.backend.exceptions.BookNotAvailableException;
import library.backend.exceptions.BookNotFoundException;
import library.backend.exceptions.ExcessiveUserCreditException;
import library.backend.exceptions.RentalNotFoundException;
import library.backend.repositories.BookRepository;
import library.backend.repositories.RentalRepository;
import library.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final int MAX_CREDIT = 20;
    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookService bookService;

    @Transactional
    public Rental rentBook(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException(bookId));

        if (book.getQuantity() <= 0) {
            throw new BookNotAvailableException("Book is not available for rent.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (user.getCredit() >= MAX_CREDIT) {
            throw new ExcessiveUserCreditException(userId, MAX_CREDIT);
        }

        Rental rental = Rental.builder()
                .book(book)
                .user(user)
                .status(RentalStatus.PENDING)
                .build();

        rentalRepository.save(rental);

        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);
        return rental;
    }

    @Transactional
    public Rental returnBook(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RentalNotFoundException(rentalId));

        rental.setStatus(RentalStatus.RETURNED);
        rental.setReturnDate(LocalDate.now());

        LocalDate returnDate = rental.getReturnDate();
        User user = rental.getUser();

        if (LocalDate.now().isAfter(returnDate)) {
            long daysLate = LocalDate.now().toEpochDay() - returnDate.toEpochDay();
            user.addCredit((int) daysLate);
        }
        rentalRepository.save(rental);
        Book book = rental.getBook();
        book.setQuantity(book.getQuantity() + 1);
        bookService.updateBook(book.getId(), bookService.convertToDTO(book));
        return rental;
    }

    public void deleteRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RentalNotFoundException(rentalId));
        rentalRepository.delete(rental);
    }

    @Transactional
    public Rental approveRental(Long rentalId) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RentalNotFoundException(rentalId));

        if (rental.getStatus() == RentalStatus.RENTED) {
            throw new RuntimeException("This rental has already been approved.");
        }

        if (rental.getStatus() != RentalStatus.PENDING) {
            throw new RuntimeException("Rental is not pending approval.");
        }

        rental.setStatus(RentalStatus.RENTED);
        rental.setRentalDate(LocalDate.now());
        rental.setReturnDate(LocalDate.now().plusWeeks(2));
        rentalRepository.save(rental);

        Book book = rental.getBook();
        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);

        return rental;
    }

    public List<RentalDTO> getAllRentals() {
        List<Rental> rentals = rentalRepository.findAll();
        return rentals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RentalDTO> getRentalsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<Rental> rentals = rentalRepository.findByUser(user);
        return rentals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RentalDTO convertToDTO(Rental rental) {
        return RentalDTO.builder()
                .id(rental.getId())
                .bookId(rental.getBook().getId())
                .userId(rental.getUser().getId())
                .rentalDate(rental.getRentalDate())
                .returnDate(rental.getReturnDate())
                .status(rental.getStatus().name())
                .build();
    }
}
