package com.libsystem.book_service.entity;

import jakarta.persistence.*;
@Entity
@Table(name = "books")
public class Book {

    public Book() {
    }

    public Book(int bookId, String name, String author, String genre, int numCopies) {
        this.bookId = bookId;
        this.name = name;
        this.author = author;
        this.genre = genre;
        this.numCopies = numCopies;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int bookId;
    private String name;
    private String author;
    private String genre;
    private int numCopies;

    public int getBookId() {
        return bookId;
    }

    public String getName() {
        return name;
    }

    public String getAuthor() {
        return author;
    }

    public String getGenre() {
        return genre;
    }

    public int getNumCopies() {
        return numCopies;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setNumCopies(int numCopies) {
        this.numCopies = numCopies;
    }

    @Override
    public String toString() {
        return "Book{" +
                "bookId=" + bookId +
                ", name='" + name + '\'' +
                ", author='" + author + '\'' +
                ", genre='" + genre + '\'' +
                ", numCopies=" + numCopies +
                '}';
    }
}