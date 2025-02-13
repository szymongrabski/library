package library.backend.controllers;

import library.backend.dtos.UserDTO;
import library.backend.dtos.request.AuthenticationRequest;
import library.backend.dtos.request.RegisterRequest;
import library.backend.entities.CustomUserDetails;
import library.backend.entities.User;
import library.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public UserDTO getCurrentUser(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return userService.getCurrentUser(customUserDetails.getId());
    }

    @PutMapping("/update")
    public UserDTO updateUser(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody RegisterRequest registerRequest) {
        return userService.updateUser(customUserDetails.getId(), registerRequest);
    }
}