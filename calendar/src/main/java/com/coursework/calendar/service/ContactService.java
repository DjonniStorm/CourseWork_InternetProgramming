package com.coursework.calendar.service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.coursework.calendar.entities.contact.ContactRequest;
import com.coursework.calendar.entities.contact.ContactRequestStatus;
import com.coursework.calendar.repository.ContactRepository;

@Service
public class ContactService {
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<ContactRequest> getAllContactRequests() {
        return contactRepository.findAll();
    }

    public List<ContactRequest> getContactRequestsByUserId(UUID userId) {
        List<ContactRequest> fromUser = contactRepository.findByFromUserId(userId);
        List<ContactRequest> toUser = contactRepository.findByToUserId(userId);
        List<ContactRequest> result = new java.util.ArrayList<>(fromUser);
        result.addAll(toUser);
        return result;
    }

    public ContactRequest getContactRequestById(UUID id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact request not found"));
    }

    public ContactRequest createContactRequest(ContactRequest contactRequest) {
        // Проверяем, существует ли уже запрос между этими пользователями
        // Проверяем PENDING и ACCEPTED статусы
        if (contactRepository.findExistingRequest(
                contactRequest.getFromUserId(),
                contactRequest.getToUserId(),
                Arrays.asList(ContactRequestStatus.PENDING, ContactRequestStatus.ACCEPTED))
                .isPresent()) {
            throw new IllegalStateException("Contact request already exists between these users");
        }

        // Проверяем, что пользователь не отправляет запрос самому себе
        if (contactRequest.getFromUserId().equals(contactRequest.getToUserId())) {
            throw new IllegalArgumentException("Cannot send contact request to yourself");
        }

        return contactRepository.save(contactRequest);
    }

    public ContactRequest updateContactRequest(UUID id, ContactRequest contactRequest) {
        ContactRequest existingContactRequest = getContactRequestById(id);
        existingContactRequest.setStatus(contactRequest.getStatus());
        return contactRepository.save(existingContactRequest);
    }

    public void deleteContactRequest(UUID id) {
        contactRepository.deleteById(id);
    }
}
