package com.libsystem.book_service.controller;

import com.libsystem.book_service.entity.Book;
import com.libsystem.book_service.service.BookService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/book")
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    @GetMapping
    public List<Book> getBooks() {
        return bookService.getBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable int id) {
        return bookService.getBookById(id);
    }

    @PutMapping("/{action}/{id}")
    public Book updateBookCopy(@PathVariable String action, @PathVariable Integer id) {
        if (action.equals("increment")) {
            return bookService.incrementBookCopy(id);
        }
        else if (action.equals("decrement")) {
            return bookService.decrementBookCopy(id);
        }
        else {
            throw new RuntimeException("Invalid action: " + action);
        }
    }
}