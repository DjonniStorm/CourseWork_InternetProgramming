package com.coursework.calendar.api.user;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.coursework.calendar.api.user.dto.UserCreateRequest;
import com.coursework.calendar.api.user.dto.UserResponse;
import com.coursework.calendar.api.user.dto.UserUpdateRequest;
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

    @GetMapping("/{id}")
    @Operation(summary = "Получить пользователя по ID", description = "Возвращает пользователя по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь найден",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    })
    public UserResponse getUserById(
            @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID id) {
        return UserMapper.toResponse(userService.getUserById(id));
    }

    @PostMapping
    @Operation(summary = "Создать пользователя", description = "Создает нового пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Пользователь успешно создан",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(
            @Parameter(description = "Данные пользователя", required = true) @RequestBody UserCreateRequest userCreateRequest) {
        return UserMapper.toResponse(userService.createUser(UserMapper.toEntity(userCreateRequest)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить пользователя", description = "Обновляет существующего пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь успешно обновлен",
                    content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    public UserResponse updateUser(
            @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID id,
            @Parameter(description = "Обновленные данные пользователя", required = true) @RequestBody UserUpdateRequest userUpdateRequest) {
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
}
