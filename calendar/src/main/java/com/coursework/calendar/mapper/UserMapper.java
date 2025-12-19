package com.coursework.calendar.mapper;

import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.entities.user.UserRole;
import com.coursework.calendar.api.user.dto.UserCreateRequest;
import com.coursework.calendar.api.user.dto.UserResponse;
import com.coursework.calendar.api.user.dto.UserUpdateRequest;

import java.util.UUID;

public class UserMapper {
    public static User toEntity(UserCreateRequest userCreateRequest) {
        User user = new User();
        user.setEmail(userCreateRequest.email());
        user.setUsername(userCreateRequest.username());
        user.setPasswordHash(userCreateRequest.password());
        user.setRole(UserRole.USER);
        user.setCreatedAt(java.time.LocalDateTime.now());
        return user;
    }

    public static User toEntity(UUID id, UserUpdateRequest userUpdateRequest) {
        return new User(
                id,
                userUpdateRequest.email(),
                userUpdateRequest.username(),
                userUpdateRequest.password(),
                UserRole.USER);
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername(), user.getCreatedAt(), user.getRole());
    }
}
