package library.backend.dtos;

import library.backend.entities.AgeGroup;
import library.backend.entities.CoverType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDetailsDTO {
    private int pageCount;
    private String description;
    private CoverType coverType;
    private AgeGroup ageGroup;
}
