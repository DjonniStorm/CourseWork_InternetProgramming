package com.coursework.calendar.api.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coursework.calendar.api.user.dto.UserCreateRequest;
import com.coursework.calendar.api.user.dto.UserLoginRequest;
import com.coursework.calendar.api.user.dto.UserResponse;
import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.mapper.UserMapper;
import com.coursework.calendar.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Авторизация", description = "API для авторизации и регистрации пользователей")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Авторизация пользователя", description = "Авторизует пользователя по email и паролю")
    @ApiResponse(responseCode = "200", description = "Успешная авторизация", content = @Content(schema = @Schema(implementation = UserResponse.class)))
    @ApiResponse(responseCode = "401", description = "Неверный email или пароль")
    public ResponseEntity<UserResponse> login(@RequestBody UserLoginRequest userLoginRequest) {
        try {
            User user = userService.getUserByEmail(userLoginRequest.email());
            if (!passwordEncoder.matches(userLoginRequest.password(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok(UserMapper.toResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Регистрация пользователя", description = "Регистрирует нового пользователя")
    @ApiResponse(responseCode = "200", description = "Успешная регистрация", content = @Content(schema = @Schema(implementation = UserResponse.class)))
    @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    @ApiResponse(responseCode = "409", description = "Пользователь уже существует")
    public ResponseEntity<UserResponse> register(@RequestBody UserCreateRequest userCreateRequest) {
        try {
            userService.getUserByEmail(userCreateRequest.email());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            User user = userService.createUser(UserMapper.toEntity(userCreateRequest));
            return ResponseEntity.ok(UserMapper.toResponse(user));
        }
    }
}
