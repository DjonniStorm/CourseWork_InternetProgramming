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

import com.coursework.calendar.entities.contact.ContactRequest;
import com.coursework.calendar.entities.contact.ContactRequestStatus;
import com.coursework.calendar.repository.ContactRepository;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    private ContactRequest testContactRequest;
    private UUID testContactRequestId;
    private UUID testFromUserId;
    private UUID testToUserId;

    @BeforeEach
    void setUp() {
        testContactRequestId = UUID.randomUUID();
        testFromUserId = UUID.randomUUID();
        testToUserId = UUID.randomUUID();
        testContactRequest = new ContactRequest(testContactRequestId, LocalDateTime.now(), null, 
                testFromUserId, testToUserId, ContactRequestStatus.PENDING);
    }

    @Test
    void getAllContactRequests_ShouldReturnListOfContactRequests() {
        // Arrange
        ContactRequest request1 = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), null, 
                UUID.randomUUID(), UUID.randomUUID(), ContactRequestStatus.PENDING);
        ContactRequest request2 = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), LocalDateTime.now(), 
                UUID.randomUUID(), UUID.randomUUID(), ContactRequestStatus.ACCEPTED);
        List<ContactRequest> expectedRequests = Arrays.asList(request1, request2);

        when(contactRepository.findAll()).thenReturn(expectedRequests);

        // Act
        List<ContactRequest> result = contactService.getAllContactRequests();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedRequests, result);
        verify(contactRepository, times(1)).findAll();
    }

    @Test
    void getContactRequestById_WhenContactRequestExists_ShouldReturnContactRequest() {
        // Arrange
        when(contactRepository.findById(testContactRequestId)).thenReturn(Optional.of(testContactRequest));

        // Act
        ContactRequest result = contactService.getContactRequestById(testContactRequestId);

        // Assert
        assertNotNull(result);
        assertEquals(testContactRequest.getId(), result.getId());
        assertEquals(testContactRequest.getFromUserId(), result.getFromUserId());
        assertEquals(testContactRequest.getToUserId(), result.getToUserId());
        assertEquals(testContactRequest.getStatus(), result.getStatus());
        verify(contactRepository, times(1)).findById(testContactRequestId);
    }

    @Test
    void getContactRequestById_WhenContactRequestNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(contactRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contactService.getContactRequestById(nonExistentId);
        });

        assertEquals("Contact request not found", exception.getMessage());
        verify(contactRepository, times(1)).findById(nonExistentId);
    }

    @Test
    void getContactRequestsByUserId_ShouldReturnCombinedList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        ContactRequest fromRequest1 = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), null, 
                userId, UUID.randomUUID(), ContactRequestStatus.PENDING);
        ContactRequest fromRequest2 = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), null, 
                userId, UUID.randomUUID(), ContactRequestStatus.PENDING);
        ContactRequest toRequest1 = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), null, 
                UUID.randomUUID(), userId, ContactRequestStatus.ACCEPTED);
        ContactRequest toRequest2 = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), LocalDateTime.now(), 
                UUID.randomUUID(), userId, ContactRequestStatus.REJECTED);

        List<ContactRequest> fromRequests = Arrays.asList(fromRequest1, fromRequest2);
        List<ContactRequest> toRequests = Arrays.asList(toRequest1, toRequest2);

        when(contactRepository.findByFromUserId(userId)).thenReturn(fromRequests);
        when(contactRepository.findByToUserId(userId)).thenReturn(toRequests);

        // Act
        List<ContactRequest> result = contactService.getContactRequestsByUserId(userId);

        // Assert
        assertNotNull(result);
        assertEquals(4, result.size());
        assertTrue(result.containsAll(fromRequests));
        assertTrue(result.containsAll(toRequests));
        verify(contactRepository, times(1)).findByFromUserId(userId);
        verify(contactRepository, times(1)).findByToUserId(userId);
    }

    @Test
    void getContactRequestsByUserId_WhenNoRequests_ShouldReturnEmptyList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(contactRepository.findByFromUserId(userId)).thenReturn(Arrays.asList());
        when(contactRepository.findByToUserId(userId)).thenReturn(Arrays.asList());

        // Act
        List<ContactRequest> result = contactService.getContactRequestsByUserId(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(contactRepository, times(1)).findByFromUserId(userId);
        verify(contactRepository, times(1)).findByToUserId(userId);
    }

    @Test
    void createContactRequest_ShouldSaveAndReturnContactRequest() {
        // Arrange
        ContactRequest newRequest = new ContactRequest(null, LocalDateTime.now(), null, 
                testFromUserId, testToUserId, ContactRequestStatus.PENDING);
        ContactRequest savedRequest = new ContactRequest(UUID.randomUUID(), LocalDateTime.now(), null, 
                testFromUserId, testToUserId, ContactRequestStatus.PENDING);

        when(contactRepository.save(any(ContactRequest.class))).thenReturn(savedRequest);

        // Act
        ContactRequest result = contactService.createContactRequest(newRequest);

        // Assert
        assertNotNull(result);
        assertEquals(savedRequest.getId(), result.getId());
        assertEquals(savedRequest.getFromUserId(), result.getFromUserId());
        assertEquals(savedRequest.getToUserId(), result.getToUserId());
        verify(contactRepository, times(1)).save(any(ContactRequest.class));
    }

    @Test
    void updateContactRequest_WhenContactRequestExists_ShouldUpdateAndReturnContactRequest() {
        // Arrange
        ContactRequest updateData = new ContactRequest(null, LocalDateTime.now(), LocalDateTime.now(), 
                testFromUserId, testToUserId, ContactRequestStatus.ACCEPTED);
        ContactRequest updatedRequest = new ContactRequest(testContactRequestId, testContactRequest.getCreatedAt(), 
                LocalDateTime.now(), testFromUserId, testToUserId, ContactRequestStatus.ACCEPTED);

        when(contactRepository.findById(testContactRequestId)).thenReturn(Optional.of(testContactRequest));
        when(contactRepository.save(any(ContactRequest.class))).thenReturn(updatedRequest);

        // Act
        ContactRequest result = contactService.updateContactRequest(testContactRequestId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals(ContactRequestStatus.ACCEPTED, result.getStatus());
        verify(contactRepository, times(1)).findById(testContactRequestId);
        verify(contactRepository, times(1)).save(any(ContactRequest.class));
    }

    @Test
    void updateContactRequest_WhenContactRequestNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        ContactRequest updateData = new ContactRequest(null, LocalDateTime.now(), null, 
                testFromUserId, testToUserId, ContactRequestStatus.REJECTED);
        when(contactRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contactService.updateContactRequest(nonExistentId, updateData);
        });

        assertEquals("Contact request not found", exception.getMessage());
        verify(contactRepository, times(1)).findById(nonExistentId);
        verify(contactRepository, never()).save(any(ContactRequest.class));
    }

    @Test
    void deleteContactRequest_ShouldCallRepositoryDelete() {
        // Arrange
        UUID contactRequestId = UUID.randomUUID();
        doNothing().when(contactRepository).deleteById(contactRequestId);

        // Act
        contactService.deleteContactRequest(contactRequestId);

        // Assert
        verify(contactRepository, times(1)).deleteById(contactRequestId);
    }
}


