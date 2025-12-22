package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.coursework.calendar.entities.event.Event;
import com.coursework.calendar.repository.EventRepository;
import com.coursework.calendar.repository.InvitationRepository;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final InvitationRepository invitationRepository;

    public EventService(EventRepository eventRepository, InvitationRepository invitationRepository) {
        this.eventRepository = eventRepository;
        this.invitationRepository = invitationRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public List<Event> getEventsByUserId(UUID userId) {
        return eventRepository.findByOwnerId(userId);
    }

    public List<Event> getInvitedEventsByUserId(UUID userId) {
        List<UUID> eventIds = invitationRepository.findByUserId(userId).stream()
                .map(invitation -> invitation.getEventId())
                .collect(Collectors.toList());
        
        if (eventIds.isEmpty()) {
            return List.of();
        }
        
        return eventRepository.findAllById(eventIds);
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
