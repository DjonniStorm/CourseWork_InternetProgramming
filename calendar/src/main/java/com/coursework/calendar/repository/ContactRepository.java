package com.coursework.calendar.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.coursework.calendar.entities.contact.ContactRequest;
import com.coursework.calendar.entities.contact.ContactRequestStatus;

@Repository
public interface ContactRepository extends JpaRepository<ContactRequest, UUID> {
    List<ContactRequest> findByFromUserId(UUID fromUserId);

    List<ContactRequest> findByToUserId(UUID toUserId);

    @Query("SELECT cr FROM ContactRequest cr WHERE " +
            "((cr.fromUserId = :userId1 AND cr.toUserId = :userId2) OR " +
            "(cr.fromUserId = :userId2 AND cr.toUserId = :userId1)) AND " +
            "cr.status IN :statuses")
    Optional<ContactRequest> findExistingRequest(
            @Param("userId1") UUID userId1,
            @Param("userId2") UUID userId2,
            @Param("statuses") List<ContactRequestStatus> statuses);
}
