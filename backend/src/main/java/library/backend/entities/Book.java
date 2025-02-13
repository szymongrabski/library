package library.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String isbn;
    private String title;
    private int quantity;

    @ManyToMany
    @JoinTable(
            name = "book_author",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<Author> authors = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private Publisher publisher;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Rental> rentals = new HashSet<>();

    @Column(name = "image_url")
    private String imageUrl;

    private LocalDate publishedDate;

    @Embedded
    private BookDetails bookDetails;
}