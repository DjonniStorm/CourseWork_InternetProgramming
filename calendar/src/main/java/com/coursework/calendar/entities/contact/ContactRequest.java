package com.coursework.calendar.entities.contact;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public class ContactRequest {
    private UUID id;
    private LocalDateTime createdAt;
    private Optional<LocalDateTime> respondedAt;
    private UUID fromUserId;
    private UUID toUserId;
    private ContactRequestStatus status;

    public ContactRequest(UUID id, LocalDateTime createdAt, Optional<LocalDateTime> respondedAt, UUID fromUserId,
            UUID toUserId, ContactRequestStatus status) {
        this.id = id;
        this.createdAt = createdAt;
        this.respondedAt = respondedAt;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.status = status;
    }

    public UUID getId() {
        return this.id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Optional<LocalDateTime> getRespondedAt() {
        return this.respondedAt;
    }

    public void setRespondedAt(Optional<LocalDateTime> respondedAt) {
        this.respondedAt = respondedAt;
    }

    public UUID getFromUserId() {
        return this.fromUserId;
    }

    public void setFromUserId(UUID fromUserId) {
        this.fromUserId = fromUserId;
    }

    public UUID getToUserId() {
        return this.toUserId;
    }

    public void setToUserId(UUID toUserId) {
        this.toUserId = toUserId;
    }

    public ContactRequestStatus getStatus() {
        return this.status;
    }

    public void setStatus(ContactRequestStatus status) {
        this.status = status;
    }
}
