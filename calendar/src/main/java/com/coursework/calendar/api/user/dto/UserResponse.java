package com.coursework.calendar.api.user.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.coursework.calendar.entities.user.UserRole;

public record UserResponse(UUID id, String username, LocalDateTime createdAt, String passwordHash, UserRole role) {

}
