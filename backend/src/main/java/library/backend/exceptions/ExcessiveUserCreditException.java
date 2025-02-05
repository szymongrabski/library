package library.backend.exceptions;

public class ExcessiveUserCreditException extends RuntimeException {
    public ExcessiveUserCreditException(Long userId, int credit) {
        super("User with ID: " + userId + " has excessive credit: " + credit + ". Unable to rent a book.");
    }
}
