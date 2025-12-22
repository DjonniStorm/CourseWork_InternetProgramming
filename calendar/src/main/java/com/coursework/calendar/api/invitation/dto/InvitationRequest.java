package com.coursework.calendar.api.invitation.dto;

import java.util.UUID;

import com.coursework.calendar.entities.invitation.InvitationStatus;

import jakarta.validation.constraints.NotNull;

public record InvitationRequest(
                @NotNull(message = "ID события обязателен") UUID eventId,
                @NotNull(message = "ID пользователя обязателен") UUID userId,
                @NotNull(message = "Статус приглашения обязателен") InvitationStatus status) {
}
