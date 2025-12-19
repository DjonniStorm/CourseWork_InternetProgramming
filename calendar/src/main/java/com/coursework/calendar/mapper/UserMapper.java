package com.coursework.calendar.mapper;

import com.coursework.calendar.entities.user.*;
import com.coursework.calendar.api.user.*;
import com.coursework.calendar.api.user.dto.UserCreateRequest;
import com.coursework.calendar.api.user.dto.UserResponse;
import com.coursework.calendar.api.user.dto.UserUpdateRequest;

import java.util.UUID;

public class UserMapper {
    public static User toEntity(UserCreateRequest userCreateRequest) {
        return new User(UUID.randomUUID(), userCreateRequest.username(),
                userCreateRequest.password(),
                UserRole.USER);
    }

    public static User toEntity(UUID id, UserUpdateRequest userUpdateRequest) {
        return new User(id, userUpdateRequest.username(), userUpdateRequest.password(),
                UserRole.USER);
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getCreatedAt(), user.getPasswordHash(),
                user.getRole());
    }
}
