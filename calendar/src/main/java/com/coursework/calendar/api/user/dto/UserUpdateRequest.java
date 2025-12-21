package com.coursework.calendar.api.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Email(message = "Введите корректный email")
        String email,
        @Size(min = 3, message = "Имя пользователя должно быть не менее 3 символов")
        String username,
        @Size(min = 8, max = 52, message = "Пароль должен быть от 8 до 52 символов")
        String password) {

}
