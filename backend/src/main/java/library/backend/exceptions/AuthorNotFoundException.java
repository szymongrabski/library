package library.backend.exceptions;

public class AuthorNotFoundException extends RuntimeException {
    public AuthorNotFoundException(Long id) {
        super("Author with id: " + id + " not found");
    }
    public AuthorNotFoundException(String name) {
        super("Author " + name + " not found");
    }
}