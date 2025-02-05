package library.backend.dtos.response;

import library.backend.entities.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
    private String token;
    private Long userId;
    private UserRole userRole;
}
