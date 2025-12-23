package com.coursework.calendar.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.coursework.calendar.entities.event.Event;
import com.coursework.calendar.entities.event.EventStatus;
import com.coursework.calendar.repository.EventRepository;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private UUID testEventId;
    private UUID testOwnerId;

    @BeforeEach
    void setUp() {
        testEventId = UUID.randomUUID();
        testOwnerId = UUID.randomUUID();
        testEvent = new Event(testEventId, "Test Event", "Test Description", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(2), 
                testOwnerId, LocalDateTime.now(), EventStatus.PUBLISHED);
    }

    @Test
    void getAllEvents_ShouldReturnListOfEvents() {
        // Arrange
        Event event1 = new Event(UUID.randomUUID(), "Event 1", "Description 1", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(1), 
                UUID.randomUUID(), LocalDateTime.now(), EventStatus.PUBLISHED);
        Event event2 = new Event(UUID.randomUUID(), "Event 2", "Description 2", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(2), 
                UUID.randomUUID(), LocalDateTime.now(), EventStatus.DRAFT);
        List<Event> expectedEvents = Arrays.asList(event1, event2);

        when(eventRepository.findAll()).thenReturn(expectedEvents);

        // Act
        List<Event> result = eventService.getAllEvents();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedEvents, result);
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getEventById_WhenEventExists_ShouldReturnEvent() {
        // Arrange
        when(eventRepository.findById(testEventId)).thenReturn(Optional.of(testEvent));

        // Act
        Event result = eventService.getEventById(testEventId);

        // Assert
        assertNotNull(result);
        assertEquals(testEvent.getId(), result.getId());
        assertEquals(testEvent.getTitle(), result.getTitle());
        assertEquals(testEvent.getDescription(), result.getDescription());
        verify(eventRepository, times(1)).findById(testEventId);
    }

    @Test
    void getEventById_WhenEventNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(eventRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            eventService.getEventById(nonExistentId);
        });

        assertEquals("Event not found", exception.getMessage());
        verify(eventRepository, times(1)).findById(nonExistentId);
    }

    @Test
    void getEventsByUserId_ShouldReturnListOfEvents() {
        // Arrange
        Event event1 = new Event(UUID.randomUUID(), "Event 1", "Description 1", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(1), 
                testOwnerId, LocalDateTime.now(), EventStatus.PUBLISHED);
        Event event2 = new Event(UUID.randomUUID(), "Event 2", "Description 2", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(2), 
                testOwnerId, LocalDateTime.now(), EventStatus.DRAFT);
        List<Event> expectedEvents = Arrays.asList(event1, event2);

        when(eventRepository.findByOwnerId(testOwnerId)).thenReturn(expectedEvents);

        // Act
        List<Event> result = eventService.getEventsByUserId(testOwnerId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedEvents, result);
        verify(eventRepository, times(1)).findByOwnerId(testOwnerId);
    }

    @Test
    void getEventsByUserId_WhenNoEvents_ShouldReturnEmptyList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(eventRepository.findByOwnerId(userId)).thenReturn(Arrays.asList());

        // Act
        List<Event> result = eventService.getEventsByUserId(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(eventRepository, times(1)).findByOwnerId(userId);
    }

    @Test
    void createEvent_ShouldSaveAndReturnEvent() {
        // Arrange
        Event newEvent = new Event(null, "New Event", "New Description", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(1), 
                testOwnerId, LocalDateTime.now(), EventStatus.DRAFT);
        Event savedEvent = new Event(UUID.randomUUID(), "New Event", "New Description", 
                newEvent.getStartTime(), newEvent.getEndTime(), 
                testOwnerId, LocalDateTime.now(), EventStatus.DRAFT);

        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        // Act
        Event result = eventService.createEvent(newEvent);

        // Assert
        assertNotNull(result);
        assertEquals(savedEvent.getId(), result.getId());
        assertEquals(savedEvent.getTitle(), result.getTitle());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void updateEvent_WhenEventExists_ShouldUpdateAndReturnEvent() {
        // Arrange
        Event updateData = new Event(null, "Updated Event", "Updated Description", 
                LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(2), 
                testOwnerId, LocalDateTime.now(), EventStatus.CANCELLED);
        Event updatedEvent = new Event(testEventId, "Updated Event", "Updated Description", 
                updateData.getStartTime(), updateData.getEndTime(), 
                testOwnerId, testEvent.getCreatedAt(), EventStatus.CANCELLED);

        when(eventRepository.findById(testEventId)).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(updatedEvent);

        // Act
        Event result = eventService.updateEvent(testEventId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Event", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(EventStatus.CANCELLED, result.getStatus());
        assertEquals(updateData.getStartTime(), result.getStartTime());
        assertEquals(updateData.getEndTime(), result.getEndTime());
        verify(eventRepository, times(1)).findById(testEventId);
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void updateEvent_WhenEventNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        Event updateData = new Event(null, "Updated Event", "Updated Description", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(2), 
                testOwnerId, LocalDateTime.now(), EventStatus.PUBLISHED);
        when(eventRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            eventService.updateEvent(nonExistentId, updateData);
        });

        assertEquals("Event not found", exception.getMessage());
        verify(eventRepository, times(1)).findById(nonExistentId);
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void deleteEvent_ShouldCallRepositoryDelete() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        doNothing().when(eventRepository).deleteById(eventId);

        // Act
        eventService.deleteEvent(eventId);

        // Assert
        verify(eventRepository, times(1)).deleteById(eventId);
    }
}




