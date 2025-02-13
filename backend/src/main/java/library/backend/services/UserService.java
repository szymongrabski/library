package library.backend.services;

import library.backend.dtos.UserDTO;
import library.backend.dtos.request.RegisterRequest;
import library.backend.entities.User;
import library.backend.exceptions.UserNotFoundException;
import library.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        return new UserDTO(user.getId(), user.getEmail(), user.getRole(), user.getFirstName(), user.getLastName(), user.getPhoneNumber(), user.getCredit(), user.getCreatedAt());
    }

    public UserDTO updateUser(Long userId, RegisterRequest updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isEmpty()) {
            user.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }
        if (updateDTO.getFirstName() != null && !updateDTO.getFirstName().isEmpty()) {
            user.setFirstName(updateDTO.getFirstName());
        }
        if (updateDTO.getLastName() != null && !updateDTO.getLastName().isEmpty()) {
            user.setLastName(updateDTO.getLastName());
        }
        if (updateDTO.getPhoneNumber() != null && !updateDTO.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(updateDTO.getPhoneNumber());
        }

        userRepository.save(user);

        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getCredit(),
                user.getCreatedAt()
        );
    }
}