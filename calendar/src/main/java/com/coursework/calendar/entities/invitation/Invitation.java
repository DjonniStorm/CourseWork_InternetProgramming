package com.coursework.calendar.entities.invitation;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "invitations")
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;

    @Column(name = "event_id", nullable = false, columnDefinition = "UUID")
    private UUID eventId;

    @Column(name = "user_id", nullable = false, columnDefinition = "UUID")
    private UUID userId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private InvitationStatus status;

    // Конструктор без параметров для JPA
    public Invitation() {
    }

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
