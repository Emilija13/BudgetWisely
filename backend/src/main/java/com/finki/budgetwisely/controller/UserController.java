package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.model.User;
import com.finki.budgetwisely.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    private List<User> findAll() {
        return this.userService.findAll();
    }
}
