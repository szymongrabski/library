package library.backend.dtos;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalDTO {
    private Long id;
    private Long bookId;
    private Long userId;
    private LocalDate rentalDate;
    private LocalDate returnDate;
    private String status;
}
