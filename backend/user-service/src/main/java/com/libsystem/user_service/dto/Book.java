package com.libsystem.user_service.dto;

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

    private int bookId;
    private String name;
    private String author;
    private String genre;
    private int numCopies;

    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getNumCopies() {
        return numCopies;
    }

    public void setNumCopies(int numCopies) {
        this.numCopies = numCopies;
    }
}