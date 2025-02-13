package library.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDetails {
    private int pageCount;
    private String description;
    private CoverType coverType;
    private AgeGroup ageGroup;
}

