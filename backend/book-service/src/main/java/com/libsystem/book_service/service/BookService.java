package com.libsystem.book_service.service;

import com.libsystem.book_service.entity.Book;
import com.libsystem.book_service.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> getBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(int id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book decrementBookCopy(int id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            throw new RuntimeException("Book not found with id " + id);
        }
        if (book.getNumCopies() <= 0) {
            throw new RuntimeException("Number of copies is already 0 for book id " + id);
        }
        else {
            book.setNumCopies(book.getNumCopies() - 1);
            return bookRepository.save(book);
        }
    }

    public Book incrementBookCopy(int id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            throw new RuntimeException("Book not found with id " + id);
        }
        book.setNumCopies(book.getNumCopies() + 1);
        return bookRepository.save(book);
    }
}