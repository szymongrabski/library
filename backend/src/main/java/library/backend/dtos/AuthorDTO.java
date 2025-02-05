package library.backend.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AuthorDTO {
    private Long id;
    private String name;
    private String surname;
}
