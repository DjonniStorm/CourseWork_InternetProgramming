package com.coursework.calendar.api.event.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.coursework.calendar.entities.event.EventStatus;

public record EventRequest(String title, String description, LocalDateTime startTime, LocalDateTime endTime,
                UUID ownerId, EventStatus status) {
}
