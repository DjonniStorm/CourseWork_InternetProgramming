package com.coursework.calendar.api.invitation.dto;

import java.util.UUID;

import com.coursework.calendar.entities.invitation.InvitationStatus;

public record InvitationRequest(UUID eventId, UUID userId, InvitationStatus status) {
}
