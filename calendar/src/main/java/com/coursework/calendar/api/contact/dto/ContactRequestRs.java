package com.coursework.calendar.api.contact.dto;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.coursework.calendar.entities.contact.ContactRequestStatus;

public record ContactRequestRs(LocalDateTime createdAt, Optional<LocalDateTime> respondedAt, UUID fromUserId,
                UUID toUserId, ContactRequestStatus status) {
}
