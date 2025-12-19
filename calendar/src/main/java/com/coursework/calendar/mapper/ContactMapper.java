package com.coursework.calendar.mapper;

import com.coursework.calendar.api.contact.dto.ContactRequestResponse;
import com.coursework.calendar.api.contact.dto.ContactRequestRs;
import com.coursework.calendar.entities.contact.ContactRequest;

public class ContactMapper {
    public static ContactRequest toEntity(ContactRequestRs contactRequestRs) {
        ContactRequest contactRequest = new ContactRequest();
        contactRequest.setCreatedAt(contactRequestRs.createdAt());
        contactRequest.setRespondedAt(contactRequestRs.respondedAt().orElse(null));
        contactRequest.setFromUserId(contactRequestRs.fromUserId());
        contactRequest.setToUserId(contactRequestRs.toUserId());
        contactRequest.setStatus(contactRequestRs.status());
        return contactRequest;
    }

    public static ContactRequestResponse toResponse(ContactRequest contactRequest) {
        return new ContactRequestResponse(
                contactRequest.getId(),
                contactRequest.getCreatedAt(),
                java.util.Optional.ofNullable(contactRequest.getRespondedAt()),
                contactRequest.getFromUserId(),
                contactRequest.getToUserId(),
                contactRequest.getStatus());
    }
}
