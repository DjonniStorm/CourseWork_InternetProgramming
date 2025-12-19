package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;

import com.coursework.calendar.entities.event.Event;
import com.coursework.calendar.repository.EventRepository;

public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public List<Event> getEventsByUserId(UUID userId) {
        return eventRepository.findByUserId(userId);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(UUID id, Event event) {
        Event existingEvent = getEventById(id);
        existingEvent.setTitle(event.getTitle());
        existingEvent.setDescription(event.getDescription());
        existingEvent.setStartTime(event.getStartTime());
        existingEvent.setEndTime(event.getEndTime());
        existingEvent.setStatus(event.getStatus());
        return eventRepository.save(existingEvent);
    }

    public void deleteEvent(UUID id) {
        eventRepository.deleteById(id);
    }
}
