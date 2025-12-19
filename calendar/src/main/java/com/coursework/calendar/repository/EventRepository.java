package com.coursework.calendar.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coursework.calendar.entities.event.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByOwnerId(UUID ownerId);
}
