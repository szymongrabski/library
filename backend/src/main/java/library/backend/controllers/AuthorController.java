package library.backend.controllers;

import library.backend.dtos.AuthorDTO;
import library.backend.services.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @GetMapping("/all")
    public Set<AuthorDTO> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    @PostMapping("/by-ids")
    public ResponseEntity<Set<AuthorDTO>> getAuthorsByIds(@RequestBody List<Long> authorIds) {
        Set<AuthorDTO> authors = authorService.getAuthorsByIds(authorIds);
        return ResponseEntity.ok(authors);
    }
}
