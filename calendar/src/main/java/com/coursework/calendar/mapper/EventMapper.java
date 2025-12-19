package com.coursework.calendar.mapper;

import java.time.LocalDateTime;

import com.coursework.calendar.api.event.dto.EventRequest;
import com.coursework.calendar.api.event.dto.EventResponse;
import com.coursework.calendar.entities.event.Event;

public class EventMapper {
    public static Event toEntity(EventRequest eventRequest) {
        Event event = new Event();
        event.setTitle(eventRequest.title());
        event.setDescription(eventRequest.description());
        event.setStartTime(eventRequest.startTime());
        event.setEndTime(eventRequest.endTime());
        event.setOwnerId(eventRequest.ownerId());
        event.setStatus(eventRequest.status());
        event.setCreatedAt(LocalDateTime.now());
        return event;
    }

    public static EventResponse toResponse(Event event) {
        return new EventResponse(event.getId(), event.getTitle(), event.getDescription(), event.getStartTime(),
                event.getEndTime(), event.getOwnerId(), event.getCreatedAt(), event.getStatus());
    }
}
