package com.coursework.calendar.api.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
                @NotBlank(message = "Email обязателен") @Email(message = "Введите корректный email") String email,
                @NotBlank(message = "Имя пользователя обязательно") @Size(min = 3, message = "Имя пользователя должно быть не менее 3 символов") String username,
                @NotBlank(message = "Пароль обязателен") @Size(min = 8, message = "Пароль должен быть не менее 8 символов") String password) {

}
