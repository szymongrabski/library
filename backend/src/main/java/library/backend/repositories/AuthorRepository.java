package library.backend.repositories;

import library.backend.entities.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findAuthorByNameAndSurname(String name, String surname);
}
