package com.coursework.calendar.api.user.dto;

import com.coursework.calendar.entities.user.UserRole;

public record UserUpdateRequest(
        String email,
        String username,
        String password,
        UserRole role) {
}
