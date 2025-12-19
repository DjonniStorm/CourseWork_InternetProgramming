package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;

import com.coursework.calendar.entities.contact.ContactRequest;
import com.coursework.calendar.repository.ContactRepository;

public class ContactService {
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<ContactRequest> getAllContactRequests() {
        return contactRepository.findAll();
    }

    public List<ContactRequest> getContactRequestsByUserId(UUID userId) {
        return contactRepository.findByUserId(userId);
    }

    public ContactRequest getContactRequestById(UUID id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact request not found"));
    }

    public ContactRequest createContactRequest(ContactRequest contactRequest) {
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
