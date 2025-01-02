package com.libsystem.user_service.dto;

import java.util.List;
public class UserResponse {
    public UserResponse() {
    }

    public UserResponse(String userId, String username, List<Book> checkedOutBooks) {
        this.userId = userId;
        this.username = username;
        this.checkedOutBooks = checkedOutBooks;
    }

    private String userId;
    private String username;
    private List<Book> checkedOutBooks;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Book> getCheckedOutBooks() {
        return checkedOutBooks;
    }

    public void setCheckedOutBooks(List<Book> checkedOutBooks) {
        this.checkedOutBooks = checkedOutBooks;
    }
}
