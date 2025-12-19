package com.coursework.calendar.entities.event;

import java.time.LocalDateTime;
import java.util.UUID;

public class Event {
    private UUID id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private UUID ownerId;
    private LocalDateTime createdAt;
    private EventStatus status;

    public Event(UUID id, String title, String description, LocalDateTime startTime, LocalDateTime endTime,
            UUID ownerId, LocalDateTime createdAt, EventStatus status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.status = status;
    }

    public Event(String title, String description, LocalDateTime startTime, LocalDateTime endTime, UUID ownerId,
            EventStatus status) {
        this(UUID.randomUUID(), title, description, startTime, endTime, ownerId, LocalDateTime.now(), status);
    }

    public UUID getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public String getDescription() {
        return this.description;
    }

    public LocalDateTime getStartTime() {
        return this.startTime;
    }

    public LocalDateTime getEndTime() {
        return this.endTime;
    }

    public UUID getOwnerId() {
        return this.ownerId;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public EventStatus getStatus() {
        return this.status;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }
}
