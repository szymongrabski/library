package library.backend.exceptions;

public class PublisherNotFoundException extends RuntimeException {
    public PublisherNotFoundException(String name) {
        super("Publisher with name: " + name + " not found");
    }
}

