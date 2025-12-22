package com.coursework.calendar.api.user.dto;

public record UserUpdateRequest(
        String email,
        String username,
        String password) {
}
