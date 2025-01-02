package com.libsystem.user_service.service;

import com.libsystem.user_service.entity.User;
import com.libsystem.user_service.repository.UserRepository;
import com.libsystem.user_service.dto.Book;
import com.libsystem.user_service.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RestTemplate restTemplate;
    public ResponseEntity<?> addUser(User user) {
        userRepository.save(user);
        return new ResponseEntity<>("User created", HttpStatus.OK);
    }
    public ResponseEntity<?> getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("Username " + username + " not found.", HttpStatus.NOT_FOUND);
        }
        List<Book> checkedOutBooks = new ArrayList<>();
        if (user.getCheckedOutBookIds() != null) {
            checkedOutBooks = user.getCheckedOutBookIds().stream()
                    .map(id -> restTemplate.getForObject("http://BOOK-SERVICE/book/" + id, Book.class))
                    .collect(Collectors.toList());
        }
        UserResponse userResponse = new UserResponse(
                user.getUserId(),
                user.getUsername(),
                checkedOutBooks
        );
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    public ResponseEntity<?> checkoutBook(String username, int bookId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("Username " + username + " not found.", HttpStatus.NOT_FOUND);
        }
        Book book = restTemplate.getForObject("http://BOOK-SERVICE/book/" + bookId, Book.class);
        if (book == null) {
            return new ResponseEntity<>("Book ID " + bookId + " not found.", HttpStatus.NOT_FOUND);
        }
        if (book.getNumCopies() <= 0) {
            return new ResponseEntity<>("Book ID " + bookId + " does not have any copies available.", HttpStatus.OK);
        }
        try {
            restTemplate.put("http://BOOK-SERVICE/book/decrement/" + bookId, null);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update book copies: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        user.getCheckedOutBookIds().add(bookId);
        userRepository.save(user);
        return new ResponseEntity<>("Book " + bookId + " checked out", HttpStatus.OK);
    }

    public ResponseEntity<?> checkinBook(String username, int bookId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("Username " + username + " not found.", HttpStatus.NOT_FOUND);
        }
        Book book = restTemplate.getForObject("http://BOOK-SERVICE:8082/book/" + bookId, Book.class);
        if (book == null) {
            return new ResponseEntity<>("Book ID " + bookId + " not found.", HttpStatus.NOT_FOUND);
        }
        try {
            restTemplate.put("http://BOOK-SERVICE/book/increment/" + bookId, null);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update book copies: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        user.getCheckedOutBookIds().remove(Integer.valueOf(bookId));
        userRepository.save(user);
        return new ResponseEntity<>("Book " + bookId + " checked in", HttpStatus.OK);
    }
}
