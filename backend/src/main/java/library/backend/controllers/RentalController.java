package library.backend.controllers;

import library.backend.dtos.RentalDTO;
import library.backend.entities.CustomUserDetails;
import library.backend.entities.Rental;
import library.backend.entities.User;
import library.backend.entities.UserRole;
import library.backend.exceptions.BookNotAvailableException;
import library.backend.exceptions.BookNotFoundException;
import library.backend.exceptions.ExcessiveUserCreditException;
import library.backend.services.JwtService;
import library.backend.services.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;
    private final JwtService jwtService;

    @PostMapping("/rent")
    public ResponseEntity<RentalDTO> rentBook(@RequestParam Long bookId, @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        Rental rental = rentalService.rentBook(bookId, customUserDetails.getId());
        return ResponseEntity.ok(rentalService.convertToDTO(rental));
    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/approve/{rentalId}")
    public ResponseEntity<RentalDTO> approveRental(@PathVariable Long rentalId) {
        Rental rental = rentalService.approveRental(rentalId);
        return ResponseEntity.ok(rentalService.convertToDTO(rental));
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{rentalId}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long rentalId) {
        rentalService.deleteRental(rentalId);
        return ResponseEntity.noContent().build();
    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/return/{rentalId}")
    public ResponseEntity<RentalDTO> returnBook(@PathVariable Long rentalId) {
        Rental rental = rentalService.returnBook(rentalId);
        return ResponseEntity.ok(rentalService.convertToDTO(rental));
    }

    @GetMapping("/user")
    public ResponseEntity<List<RentalDTO>> getRentalsByUserId(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<RentalDTO> rentals = rentalService.getRentalsByUserId(customUserDetails.getId());
        return ResponseEntity.ok(rentals);
    }

    @Secured("ROLE_ADMIN")
    @GetMapping
    public ResponseEntity<List<RentalDTO>> getAllRentals() {
        List<RentalDTO> rentals = rentalService.getAllRentals();
        return ResponseEntity.ok(rentals);
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<String> handleBookNotFoundException(BookNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BookNotAvailableException.class)
    public ResponseEntity<String> handleBookNotAvailableException(BookNotAvailableException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }

    @ExceptionHandler(ExcessiveUserCreditException.class)
    public ResponseEntity<String> handleExcessiveUserCreditException(ExcessiveUserCreditException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
