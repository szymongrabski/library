package library.backend.controllers;

import library.backend.dtos.UserDTO;
import library.backend.dtos.request.AuthenticationRequest;
import library.backend.entities.User;
import library.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserDTO getCurrentUser(@AuthenticationPrincipal User user) {
        return userService.getCurrentUser(user);
    }

    @PutMapping("/update")
    public UserDTO updateUser(@AuthenticationPrincipal User user, @RequestBody AuthenticationRequest updateDTO) {
        return userService.updateUser(user, updateDTO);
    }
}