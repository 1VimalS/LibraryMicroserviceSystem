package com.libsystem.user_service.controller;

import com.libsystem.user_service.entity.User;
import com.libsystem.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin("*")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping
    public ResponseEntity addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @GetMapping("/{username}")
    public ResponseEntity getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @PutMapping("/{action}/{username}/{bookId}")
    public ResponseEntity checkOutOrInBookId(@PathVariable String action, @PathVariable String username, @PathVariable int bookId) {
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
