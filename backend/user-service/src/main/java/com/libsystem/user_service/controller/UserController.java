package com.libsystem.user_service.controller;

import com.libsystem.user_service.entity.User;
import com.libsystem.user_service.entity.LoginRequest;
import com.libsystem.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin("*")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/signup")
    public ResponseEntity addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @GetMapping("/{username}")
    public ResponseEntity getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }
    @PostMapping("/login")
    public ResponseEntity verifyPassword(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }
    @PutMapping("/{username}/{action}/{bookId}")
    public ResponseEntity checkOutOrInBookId(@PathVariable String username, @PathVariable String action, @PathVariable int bookId) {
        if (action.equals("checkout")) {
            return userService.checkoutBook(username, bookId);
        }
        else if (action.equals("checkin")) {
            return userService.checkinBook(username, bookId);
        }
        else {
            throw new RuntimeException("Invalid action: " + action);
        }
    }
}
