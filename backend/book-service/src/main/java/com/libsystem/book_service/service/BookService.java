package com.libsystem.book_service.service;

import com.libsystem.book_service.entity.Book;
import com.libsystem.book_service.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public ResponseEntity<?> addBook(Book book) {
        bookRepository.save(book);
        return new ResponseEntity<>("Book added", HttpStatus.CREATED);
    }

    public ResponseEntity<?> getBooks() {
        return new ResponseEntity<>(bookRepository.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<?> getBookById(int id) {
        return new ResponseEntity<>(bookRepository.findById(id).orElse(null), HttpStatus.OK);
    }

    public ResponseEntity<?> decrementBookCopy(int id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return new ResponseEntity<>("Book not found with id " + id, HttpStatus.NOT_FOUND);
        }
        if (book.getNumCopies() <= 0) {
            return new ResponseEntity<>("Number of copies is already 0 for book id " + id, HttpStatus.GONE);
        }
        else {
            book.setNumCopies(book.getNumCopies() - 1);
            bookRepository.save(book);
            return new ResponseEntity<>("Decremented", HttpStatus.OK);
        }
    }

    public ResponseEntity<?> incrementBookCopy(int id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return new ResponseEntity<>("Book not found with id " + id, HttpStatus.NOT_FOUND);
        }
        book.setNumCopies(book.getNumCopies() + 1);
        bookRepository.save(book);
        return new ResponseEntity<>("Incremented", HttpStatus.OK);
    }
}