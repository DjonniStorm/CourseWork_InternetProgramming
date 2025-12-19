package com.coursework.calendar.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coursework.calendar.entities.contact.ContactRequest;

@Repository
public interface ContactRepository extends JpaRepository<ContactRequest, UUID> {
    List<ContactRequest> findByUserId(UUID userId);
}
