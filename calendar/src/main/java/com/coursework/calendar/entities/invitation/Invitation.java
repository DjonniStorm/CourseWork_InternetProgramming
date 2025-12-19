package com.coursework.calendar.entities.invitation;

import java.time.LocalDateTime;
import java.util.UUID;

public class Invitation {
    private UUID id;
    private UUID eventId;
    private UUID userId;
    private LocalDateTime createdAt;
    private InvitationStatus status;

    public Invitation(UUID id, UUID eventId, UUID userId, LocalDateTime createdAt, InvitationStatus status) {
        this.id = id;
        this.eventId = eventId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.status = status;
    }

    public Invitation(UUID eventId, UUID userId, InvitationStatus status) {
        this(UUID.randomUUID(), eventId, userId, LocalDateTime.now(), status);
    }

    public UUID getId() {
        return this.id;
    }

    public UUID getEventId() {
        return this.eventId;
    }

    public UUID getUserId() {
        return this.userId;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public InvitationStatus getStatus() {
        return this.status;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }
}
