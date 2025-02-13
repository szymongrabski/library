package library.backend.repositories;
import library.backend.entities.Rental;
import library.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUser(User user);
}
