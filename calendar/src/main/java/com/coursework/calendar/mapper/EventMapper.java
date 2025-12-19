package com.coursework.calendar.mapper;

import com.coursework.calendar.api.event.dto.EventRequest;
import com.coursework.calendar.api.event.dto.EventResponse;
import com.coursework.calendar.entities.event.Event;

public class EventMapper {
    public static Event toEntity(EventRequest eventRequest) {
        return new Event(eventRequest.title(), eventRequest.description(), eventRequest.startTime(),
                eventRequest.endTime(), eventRequest.ownerId(), eventRequest.status());
    }

    public static EventResponse toResponse(Event event) {
        return new EventResponse(event.getId(), event.getTitle(), event.getDescription(), event.getStartTime(),
                event.getEndTime(), event.getOwnerId(), event.getCreatedAt(), event.getStatus());
    }
}
