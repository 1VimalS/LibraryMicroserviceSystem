package com.libsystem.user_service.service;

import com.libsystem.user_service.entity.User;
import com.libsystem.user_service.entity.LoginRequest;
import com.libsystem.user_service.repository.UserRepository;
import com.libsystem.user_service.dto.Book;
import com.libsystem.user_service.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
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
        return new ResponseEntity<>("User created", HttpStatus.CREATED);
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

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("Username " + username + " not found.", HttpStatus.NOT_FOUND);
        }
        if (!password.equals(user.getPassword())) {
            return new ResponseEntity<>("Password incorrect", HttpStatus.UNAUTHORIZED);
        }
        else {
            return new ResponseEntity<>("Accepted", HttpStatus.OK);
        }
    }

    public ResponseEntity<?> checkoutBook(String username, int bookId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("Username " + username + " not found.", HttpStatus.NOT_FOUND);
        }
        ResponseEntity<?> bookResponse = restTemplate.exchange(
                "http://BOOK-SERVICE/book/" + bookId,
                HttpMethod.GET,
                null,
                Book.class);

        if (bookResponse.getStatusCode() != HttpStatus.OK || bookResponse.getBody() == null) {
            return new ResponseEntity<>("Book ID " + bookId + " not found.", HttpStatus.NOT_FOUND);
        }

        Book book = (Book) bookResponse.getBody();
        if (book.getNumCopies() <= 0) {
            System.out.println("Book " + book.getName() + "has no more copies: " + book.getNumCopies());
            return new ResponseEntity<>("Book ID " + bookId + " does not have any copies available.", HttpStatus.GONE);
        }
        try {
            ResponseEntity<?> decrementResponse = restTemplate.exchange(
                    "http://BOOK-SERVICE/book/decrement/" + bookId,
                    HttpMethod.PUT,
                    null,
                    String.class);

            if (decrementResponse.getStatusCode() != HttpStatus.OK) {
                return new ResponseEntity<>("Failed to decrement book copies.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update book copies: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        user.getCheckedOutBookIds().add(bookId);
        System.out.println("Updated User checkeOutBookIds: Size " + user.getCheckedOutBookIds().size());
        for (int i : user.getCheckedOutBookIds()) {
            System.out.println("Book ID: " + i);
        }
        try {
            userRepository.save(user); // Save the updated user with version field
        } catch (Exception e) {
            System.out.println("Error during save: " + e.getMessage());
            return new ResponseEntity<>("Error saving user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Book " + bookId + " checked out", HttpStatus.OK);
    }

    public ResponseEntity<?> checkinBook(String username, int bookId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("Username " + username + " not found.", HttpStatus.NOT_FOUND);
        }
        ResponseEntity<?> bookResponse = restTemplate.exchange(
                "http://BOOK-SERVICE/book/" + bookId,
                HttpMethod.GET,
                null,
                Book.class);

        if (bookResponse.getStatusCode() != HttpStatus.OK || bookResponse.getBody() == null) {
            return new ResponseEntity<>("Book ID " + bookId + " not found.", HttpStatus.NOT_FOUND);
        }

        Book book = (Book) bookResponse.getBody();
        try {
            ResponseEntity<?> incrementResponse = restTemplate.exchange(
                    "http://BOOK-SERVICE/book/increment/" + bookId,
                    HttpMethod.PUT,
                    null,
                    String.class);

            if (incrementResponse.getStatusCode() != HttpStatus.OK) {
                return new ResponseEntity<>("Failed to increment book copies.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update book copies: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        user.getCheckedOutBookIds().remove(Integer.valueOf(bookId));
        userRepository.save(user);
        return new ResponseEntity<>("Book " + bookId + " checked in", HttpStatus.OK);
    }
}
