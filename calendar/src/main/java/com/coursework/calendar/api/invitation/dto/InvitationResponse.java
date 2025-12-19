package com.coursework.calendar.api.invitation.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.coursework.calendar.entities.invitation.InvitationStatus;

public record InvitationResponse(UUID id, UUID eventId, UUID userId, LocalDateTime createdAt, InvitationStatus status) {

}
