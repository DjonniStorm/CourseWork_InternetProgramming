package com.coursework.calendar.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coursework.calendar.entities.invitation.Invitation;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    List<Invitation> findByUserId(UUID userId);

    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);
}
