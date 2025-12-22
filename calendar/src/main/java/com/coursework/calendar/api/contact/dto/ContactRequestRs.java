package com.coursework.calendar.api.contact.dto;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.coursework.calendar.entities.contact.ContactRequestStatus;

import jakarta.validation.constraints.NotNull;

public record ContactRequestRs(
                LocalDateTime createdAt,
                Optional<LocalDateTime> respondedAt,
                @NotNull(message = "ID отправителя обязателен") UUID fromUserId,
                @NotNull(message = "ID получателя обязателен") UUID toUserId,
                @NotNull(message = "Статус запроса обязателен") ContactRequestStatus status) {
}
