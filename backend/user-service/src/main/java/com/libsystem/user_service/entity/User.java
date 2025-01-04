package com.libsystem.user_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;

@Document(collection = "users")
public class User {
    public User() {
        this.checkedOutBookIds = new ArrayList<>();
    }

    public User(String userId, String username, String password, List<Integer> checkedOutBookIds) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.checkedOutBookIds = checkedOutBookIds;
    }

    public User(String userId, String username, String password) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.checkedOutBookIds = new ArrayList<>();
    }

    @Id
    private String userId;
    private String username;
    private String password;
    private List<Integer> checkedOutBookIds;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Integer> getCheckedOutBookIds() {
        return checkedOutBookIds;
    }

    public void setCheckedOutBookIds(List<Integer> checkedOutBookIds) {
        this.checkedOutBookIds = checkedOutBookIds;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId='" + userId + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", checkedOutBookIds=" + checkedOutBookIds +
                '}';
    }
}