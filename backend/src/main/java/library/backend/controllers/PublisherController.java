package library.backend.controllers;

import library.backend.entities.Publisher;
import library.backend.services.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/publishers")
@RequiredArgsConstructor
public class PublisherController {
    private final PublisherService publisherService;

    @GetMapping("/all")
    public List<Publisher> getAllPublishers() {
        return publisherService.getAllPublishers();
    }
}
