package com.coursework.calendar.api.user.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.coursework.calendar.entities.user.UserRole;

public record UserResponse(UUID id, String email, String username, LocalDateTime createdAt,
                UserRole role) {

}
