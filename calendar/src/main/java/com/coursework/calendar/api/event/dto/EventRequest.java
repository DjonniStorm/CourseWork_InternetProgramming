package com.coursework.calendar.api.event.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.coursework.calendar.entities.event.EventStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@ValidEventTime
public record EventRequest(
        @NotBlank(message = "Название события обязательно")
        String title,
        @NotBlank(message = "Описание события обязательно")
        String description,
        @NotNull(message = "Дата начала события обязательна")
        LocalDateTime startTime,
        @NotNull(message = "Дата окончания события обязательна")
        LocalDateTime endTime,
        @NotNull(message = "ID владельца обязателен")
        UUID ownerId,
        @NotNull(message = "Статус события обязателен")
        EventStatus status) {
}
