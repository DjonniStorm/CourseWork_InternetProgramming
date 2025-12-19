package com.coursework.calendar.entities.user;

import java.time.LocalDateTime;
import java.util.UUID;

public class User {
    private UUID id;
    private String username;
    private LocalDateTime createdAt;
    private String passwordHash;
    private UserRole role;

    public User(UUID id, String username, LocalDateTime createdAt, String passwordHash, UserRole role) {
        this.id = id;
        this.username = username;
        this.createdAt = createdAt;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public User(UUID id, String username, String passwordHash, UserRole role) {
        this(id, username, LocalDateTime.now(), passwordHash, role);
    }

    public UUID getId() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public UserRole getRole() {
        return this.role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

}