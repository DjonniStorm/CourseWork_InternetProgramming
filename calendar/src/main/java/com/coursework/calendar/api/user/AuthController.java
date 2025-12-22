package com.coursework.calendar.api.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.coursework.calendar.api.user.dto.AuthResponse;
import com.coursework.calendar.api.user.dto.UserCreateRequest;
import com.coursework.calendar.api.user.dto.UserLoginRequest;
import com.coursework.calendar.api.user.dto.UserResponse;
import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.mapper.UserMapper;
import com.coursework.calendar.service.JwtService;
import com.coursework.calendar.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Авторизация", description = "API для авторизации и регистрации пользователей")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final String DEFAULT_ADMIN_EMAIL = "admin@system.local";

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final Environment environment;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService,
            Environment environment) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.environment = environment;
    }

    private boolean isNopassProfile() {
        String[] activeProfiles = environment.getActiveProfiles();
        for (String profile : activeProfiles) {
            if ("nopass".equals(profile)) {
                return true;
            }
        }
        return false;
    }

    @PostMapping("/login")
    @Operation(summary = "Авторизация пользователя", description = "Авторизует пользователя по email и паролю")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешная авторизация", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Неверный email или пароль")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest userLoginRequest,
            HttpServletResponse response) {
        try {
            User user = userService.getUserByEmail(userLoginRequest.email());
            if (!passwordEncoder.matches(userLoginRequest.password(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(false); // В продакшене должно быть true для HTTPS
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 дней
            response.addCookie(refreshTokenCookie);

            AuthResponse authResponse = new AuthResponse(accessToken, user.getId(), user.getEmail(),
                    user.getUsername());
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Регистрация пользователя", description = "Регистрирует нового пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешная регистрация"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса"),
            @ApiResponse(responseCode = "403", description = "Регистрация отключена в режиме nopass"),
            @ApiResponse(responseCode = "409", description = "Пользователь уже существует")
    })
    public ResponseEntity<Void> register(@Valid @RequestBody UserCreateRequest userCreateRequest) {
        // В профиле nopass регистрация отключена
        if (isNopassProfile()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            userService.getUserByEmail(userCreateRequest.email());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (RuntimeException e) {
            try {
                userService.createUser(UserMapper.toEntity(userCreateRequest));
                return ResponseEntity.ok().build();
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Обновление токена", description = "Обновляет access token используя refresh token из cookie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Токен успешно обновлен", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Невалидный refresh token")
    })
    public ResponseEntity<AuthResponse> refresh(
            @Parameter(description = "Refresh token из cookie") @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        // В профиле nopass всегда возвращаем данные дефолтного админа
        if (isNopassProfile()) {
            try {
                User adminUser = userService.getUserByEmail(DEFAULT_ADMIN_EMAIL);
                String newAccessToken = jwtService.generateAccessToken(adminUser);
                String newRefreshToken = jwtService.generateRefreshToken(adminUser);

                Cookie refreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(false);
                refreshTokenCookie.setPath("/");
                refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
                response.addCookie(refreshTokenCookie);

                AuthResponse authResponse = new AuthResponse(newAccessToken, adminUser.getId(), adminUser.getEmail(),
                        adminUser.getUsername());
                return ResponseEntity.ok(authResponse);
            } catch (Exception e) {
                logger.error("Error in refresh endpoint for nopass profile: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        // Обычная логика для других профилей
        if (refreshToken == null || !jwtService.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtService.extractUsername(refreshToken);
        User user = userService.getUserByEmail(email);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        Cookie refreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshTokenCookie);

        AuthResponse authResponse = new AuthResponse(newAccessToken, user.getId(), user.getEmail(),
                user.getUsername());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    @Operation(summary = "Выход из системы", description = "Выходит из системы, удаляя refresh token из cookie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешный выход из системы"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Удаляем refresh token cookie, устанавливая его с пустым значением и MaxAge =
        // 0
        Cookie refreshTokenCookie = new Cookie("refreshToken", "");
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // Удаляем cookie
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Получить текущего пользователя", description = "Возвращает информацию о текущем аутентифицированном пользователе")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Информация о пользователе", content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(UserMapper.toResponse(user));
    }
}
