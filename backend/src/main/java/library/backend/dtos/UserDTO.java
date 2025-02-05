package library.backend.dtos;

import library.backend.entities.UserRole;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private UserRole role;
    private int credit;
    private LocalDate createdAt;
}
