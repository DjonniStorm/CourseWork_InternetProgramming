package com.coursework.calendar.entities.contact;

import java.time.LocalDateTime;
import java.util.Optional;
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
@Table(name = "contact_requests")
public class ContactRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "responded_at", nullable = true)
    private LocalDateTime respondedAt;

    @Column(name = "from_user_id", nullable = false, columnDefinition = "UUID")
    private UUID fromUserId;

    @Column(name = "to_user_id", nullable = false, columnDefinition = "UUID")
    private UUID toUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ContactRequestStatus status;

    // Конструктор без параметров для JPA
    public ContactRequest() {
    }

    public ContactRequest(UUID id, LocalDateTime createdAt, LocalDateTime respondedAt, UUID fromUserId,
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

    public LocalDateTime getRespondedAt() {
        return this.respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public Optional<LocalDateTime> getRespondedAtOptional() {
        return Optional.ofNullable(this.respondedAt);
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
