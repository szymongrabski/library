package library.backend.repositories;

import library.backend.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findAll(Pageable pageable);

    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Book> findByQuantityBetween(int minQuantity, int maxQuantity, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND b.quantity BETWEEN :minQuantity AND :maxQuantity")
    Page<Book> searchByTitleAndQuantity(@Param("title") String title, @Param("minQuantity") int minQuantity, @Param("maxQuantity") int maxQuantity, Pageable pageable);
}

