package library.backend.services;

import library.backend.dtos.UserDTO;
import library.backend.dtos.request.AuthenticationRequest;
import library.backend.entities.User;
import library.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getCurrentUser(@AuthenticationPrincipal User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getRole(), user.getCredit(), user.getCreatedAt());
    }

    public UserDTO updateUser(@AuthenticationPrincipal User user, AuthenticationRequest updateDTO) {
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isEmpty()) {
            user.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }
        userRepository.save(user);
        return new UserDTO(user.getId(), user.getEmail(), user.getRole(), user.getCredit(), user.getCreatedAt());
    }
}