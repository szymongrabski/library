package library.backend.services;

import library.backend.dtos.AuthorDTO;
import library.backend.entities.Author;
import library.backend.repositories.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;
    public Set<AuthorDTO> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(author -> new AuthorDTO(author.getId(), author.getName(), author.getSurname()))
                .collect(Collectors.toSet());
    }
    public Optional<Author> getAuthorById(Long authorId) {
        return authorRepository.findById(authorId);
    }
}
