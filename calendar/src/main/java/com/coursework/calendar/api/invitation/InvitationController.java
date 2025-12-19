package com.coursework.calendar.api.invitation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

import com.coursework.calendar.api.invitation.dto.InvitationRequest;
import com.coursework.calendar.api.invitation.dto.InvitationResponse;
import com.coursework.calendar.mapper.InvitationMapper;
import com.coursework.calendar.service.InvitationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/invitations")
@Tag(name = "Приглашения", description = "API для управления приглашениями на события")
public class InvitationController {
    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping
    @Operation(summary = "Получить все приглашения", description = "Возвращает список всех приглашений")
    @ApiResponse(responseCode = "200", description = "Успешное получение списка приглашений", content = @Content(schema = @Schema(implementation = InvitationResponse.class)))
    public List<InvitationResponse> getAllInvitations() {
        return invitationService.getAllInvitations().stream()
                .map(InvitationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить приглашение по ID", description = "Возвращает приглашение по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Приглашение найдено", content = @Content(schema = @Schema(implementation = InvitationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Приглашение не найдено")
    })
    public InvitationResponse getInvitationById(
            @Parameter(description = "Идентификатор приглашения", required = true) @PathVariable UUID id) {
        return InvitationMapper.toResponse(invitationService.getInvitationById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Получить приглашения пользователя", description = "Возвращает все приглашения для указанного пользователя")
    @ApiResponse(responseCode = "200", description = "Успешное получение приглашений пользователя", content = @Content(schema = @Schema(implementation = InvitationResponse.class)))
    public List<InvitationResponse> getInvitationsByUserId(
            @Parameter(description = "Идентификатор пользователя", required = true) @PathVariable UUID userId) {
        return invitationService.getInvitationsByUserId(userId).stream()
                .map(InvitationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    @Operation(summary = "Создать приглашение", description = "Создает новое приглашение на событие")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Приглашение успешно создано", content = @Content(schema = @Schema(implementation = InvitationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationResponse createInvitation(
            @Parameter(description = "Данные приглашения", required = true) @RequestBody InvitationRequest invitationRequest) {
        return InvitationMapper
                .toResponse(invitationService.createInvitation(InvitationMapper.toEntity(invitationRequest)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить приглашение", description = "Обновляет существующее приглашение")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Приглашение успешно обновлено", content = @Content(schema = @Schema(implementation = InvitationResponse.class))),
            @ApiResponse(responseCode = "404", description = "Приглашение не найдено"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные запроса")
    })
    public InvitationResponse updateInvitation(
            @Parameter(description = "Идентификатор приглашения", required = true) @PathVariable UUID id,
            @Parameter(description = "Обновленные данные приглашения", required = true) @RequestBody InvitationRequest invitationRequest) {
        return InvitationMapper
                .toResponse(invitationService.updateInvitation(id, InvitationMapper.toEntity(invitationRequest)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить приглашение", description = "Удаляет приглашение по указанному идентификатору")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Приглашение успешно удалено"),
            @ApiResponse(responseCode = "404", description = "Приглашение не найдено")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvitation(
            @Parameter(description = "Идентификатор приглашения", required = true) @PathVariable UUID id) {
        invitationService.deleteInvitation(id);
    }
}
