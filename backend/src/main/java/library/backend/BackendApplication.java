package library.backend;

import library.backend.entities.*;
import library.backend.repositories.AuthorRepository;
import library.backend.repositories.BookRepository;
import library.backend.repositories.PublisherRepository;
import library.backend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			BookRepository bookRepository,
			PublisherRepository publisherRepository,
			AuthorRepository authorRepository
	) {
		return args -> {
			if (userRepository.findByEmail("admin@example.com").isEmpty()) {
				User admin = User.builder()
						.email("admin@example.com")
						.password(passwordEncoder.encode("admin123"))
						.role(UserRole.ADMIN)
						.firstName("John")
						.lastName("Doe")
						.createdAt(LocalDate.now())
						.credit(0)
						.build();
				userRepository.save(admin);
				System.out.println("Admin user created: admin@example.com / admin123");
			}

			Publisher publisher = publisherRepository.findByName("Default Publisher")
					.orElseGet(() -> {
						Publisher newPublisher = Publisher.builder()
								.name("Default Publisher")
								.build();
						return publisherRepository.save(newPublisher);
					});

			if (authorRepository.count() == 0) {
				for (int i = 1; i <= 5; i++) {
					Author author = Author.builder()
							.name("Author Name " + i)
							.surname("Author Surname " + i)
							.build();
					authorRepository.save(author);
				}
				System.out.println("5 authors initialized in the database.");
			}

			Set<Author> authors = new HashSet<>(authorRepository.findAll());

			if (bookRepository.count() == 0) {
				int authorIndex = 0;
				Author[] authorArray = authors.toArray(new Author[0]);

				for (int i = 1; i <= 20; i++) {
					Set<Author> bookAuthors = new HashSet<>();
					bookAuthors.add(authorArray[authorIndex]);
					authorIndex = (authorIndex + 1) % authorArray.length;

					BookDetails bookDetails = BookDetails.builder()
							.ageGroup(AgeGroup.ADULTS)
							.description("Description for book Book Title " + i + ". Very interesting book.")
							.coverType(CoverType.SOFT)
							.pageCount(200 + i * 10).build();

					Book book = Book.builder()
							.isbn("ISBN-12345-" + i)
							.title("Book Title " + i)
							.quantity(i)
							.bookDetails(bookDetails)
							.publisher(publisher)
							.authors(bookAuthors)
							.imageUrl("https://static.posters.cz/image/1300/harry-potter-deathly-hallows-book-cover-i214933.jpg")
							.publishedDate(LocalDate.now().minusMonths(i).minusDays(i))
							.build();
					bookRepository.save(book);
				}
				System.out.println("20 books initialized in the database with authors.");
			}
		};
	}
}
