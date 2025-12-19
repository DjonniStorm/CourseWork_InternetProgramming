package com.coursework.calendar.mapper;

import java.util.UUID;

import com.coursework.calendar.api.contact.dto.ContactRequestResponse;
import com.coursework.calendar.api.contact.dto.ContactRequestRs;
import com.coursework.calendar.entities.contact.ContactRequest;

public class ContactMapper {
    public static ContactRequest toEntity(ContactRequestRs contactRequestRs) {
        return new ContactRequest(UUID.randomUUID(), contactRequestRs.createdAt(),
                contactRequestRs.respondedAt().orElse(null), contactRequestRs.fromUserId(),
                contactRequestRs.toUserId(), contactRequestRs.status());
    }

    public static ContactRequestResponse toResponse(ContactRequest contactRequest) {
        return new ContactRequestResponse(contactRequest.getId(), contactRequest.getCreatedAt(),
                java.util.Optional.ofNullable(contactRequest.getRespondedAt()), contactRequest.getFromUserId(),
                contactRequest.getToUserId(), contactRequest.getStatus());
    }
}
