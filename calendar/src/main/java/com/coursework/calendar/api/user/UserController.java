package com.coursework.calendar.api.user;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.coursework.calendar.api.user.dto.UserResponse;
import com.coursework.calendar.api.user.dto.UserUpdateRequest;
import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.mapper.UserMapper;
import com.coursework.calendar.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Пользователи", description = "API для управления пользователями")
public class UserController {
        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        @GetMapping
        @Operation(summary = "Получить всех пользователей", description = "Возвращает список всех пользователей")
        @ApiResponse(responseCode = "200", description = "Успешное получение списка пользователей", content = @Content(schema = @Schema(implementation = UserResponse.class)))
        public java.util.List<UserResponse> getAllUsers() {
                return userService.getAllUsers().stream()
                                .map(UserMapper::toResponse)
                                .toList();
        }

        @GetMapping("/{id}")
        @Operation(summary = "Получить пользователя по ID", description = "Возвращает пользователя по указанному идентификатору")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Пользователь найден", content = @Content(schema = @Schema(implementation = UserResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Пользователь не найден")
        })
        public UserResponse getUserById(
                        @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID id) {
                return UserMapper.toResponse(userService.getUserById(id));
        }

        @PutMapping("/{id}")
        @Operation(summary = "Обновить пользователя", description = "Обновляет существующего пользователя")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Пользователь успешно обновлен", content = @Content(schema = @Schema(implementation = UserResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Пользователь не найден"),
                        @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
        })
        public UserResponse updateUser(
                        @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID id,
                        @Parameter(description = "Обновленные данные пользователя", required = true) @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
                return UserMapper.toResponse(userService.updateUser(id, UserMapper.toEntity(id, userUpdateRequest)));
        }

        @DeleteMapping("/{id}")
        @Operation(summary = "Удалить пользователя", description = "Удаляет пользователя по указанному идентификатору")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "Пользователь успешно удален"),
                        @ApiResponse(responseCode = "404", description = "Пользователь не найден")
        })
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void deleteUser(
                        @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID id) {
                userService.deleteUser(id);
        }

        @GetMapping("/search")
        @Operation(summary = "Поиск пользователей", description = "Ищет пользователей по username или email с пагинацией")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Успешный поиск", content = @Content(schema = @Schema(implementation = UserResponse.class)))
        })
        public Page<UserResponse> searchUsers(
                        @Parameter(description = "Поисковый запрос (username или email)", required = true) @RequestParam String q,
                        @PageableDefault(size = 20) Pageable pageable) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                UUID currentUserId = null;
                if (authentication != null && authentication.isAuthenticated()) {
                        try {
                                String email = authentication.getName();
                                User currentUser = userService.getUserByEmail(email);
                                currentUserId = currentUser.getId();
                        } catch (RuntimeException e) {
                                // Игнорируем, если пользователь не найден
                        }
                }
                return userService.searchUsers(q, currentUserId, pageable)
                                .map(UserMapper::toResponse);
        }
}
