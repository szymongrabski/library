package library.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String isbn;
    private String title;
    private int quantity;
    private String publisherName;
    private Set<Long> authors;
    private String imageUrl;
    private LocalDate publishedDate;
    private BookDetailsDTO bookDetails;
}

