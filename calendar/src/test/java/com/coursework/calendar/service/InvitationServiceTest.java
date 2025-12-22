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

import com.coursework.calendar.entities.invitation.Invitation;
import com.coursework.calendar.entities.invitation.InvitationStatus;
import com.coursework.calendar.repository.InvitationRepository;

@ExtendWith(MockitoExtension.class)
class InvitationServiceTest {

    @Mock
    private InvitationRepository invitationRepository;

    @InjectMocks
    private InvitationService invitationService;

    private Invitation testInvitation;
    private UUID testInvitationId;
    private UUID testEventId;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testInvitationId = UUID.randomUUID();
        testEventId = UUID.randomUUID();
        testUserId = UUID.randomUUID();
        testInvitation = new Invitation(testInvitationId, testEventId, testUserId, 
                LocalDateTime.now(), InvitationStatus.PENDING);
    }

    @Test
    void getAllInvitations_ShouldReturnListOfInvitations() {
        // Arrange
        Invitation invitation1 = new Invitation(UUID.randomUUID(), UUID.randomUUID(), 
                UUID.randomUUID(), LocalDateTime.now(), InvitationStatus.PENDING);
        Invitation invitation2 = new Invitation(UUID.randomUUID(), UUID.randomUUID(), 
                UUID.randomUUID(), LocalDateTime.now(), InvitationStatus.ACCEPTED);
        List<Invitation> expectedInvitations = Arrays.asList(invitation1, invitation2);

        when(invitationRepository.findAll()).thenReturn(expectedInvitations);

        // Act
        List<Invitation> result = invitationService.getAllInvitations();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedInvitations, result);
        verify(invitationRepository, times(1)).findAll();
    }

    @Test
    void getInvitationById_WhenInvitationExists_ShouldReturnInvitation() {
        // Arrange
        when(invitationRepository.findById(testInvitationId)).thenReturn(Optional.of(testInvitation));

        // Act
        Invitation result = invitationService.getInvitationById(testInvitationId);

        // Assert
        assertNotNull(result);
        assertEquals(testInvitation.getId(), result.getId());
        assertEquals(testInvitation.getEventId(), result.getEventId());
        assertEquals(testInvitation.getUserId(), result.getUserId());
        assertEquals(testInvitation.getStatus(), result.getStatus());
        verify(invitationRepository, times(1)).findById(testInvitationId);
    }

    @Test
    void getInvitationById_WhenInvitationNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(invitationRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            invitationService.getInvitationById(nonExistentId);
        });

        assertEquals("Invitation not found", exception.getMessage());
        verify(invitationRepository, times(1)).findById(nonExistentId);
    }

    @Test
    void getInvitationsByUserId_ShouldReturnListOfInvitations() {
        // Arrange
        Invitation invitation1 = new Invitation(UUID.randomUUID(), UUID.randomUUID(), 
                testUserId, LocalDateTime.now(), InvitationStatus.PENDING);
        Invitation invitation2 = new Invitation(UUID.randomUUID(), UUID.randomUUID(), 
                testUserId, LocalDateTime.now(), InvitationStatus.ACCEPTED);
        List<Invitation> expectedInvitations = Arrays.asList(invitation1, invitation2);

        when(invitationRepository.findByUserId(testUserId)).thenReturn(expectedInvitations);

        // Act
        List<Invitation> result = invitationService.getInvitationsByUserId(testUserId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedInvitations, result);
        verify(invitationRepository, times(1)).findByUserId(testUserId);
    }

    @Test
    void getInvitationsByUserId_WhenNoInvitations_ShouldReturnEmptyList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(invitationRepository.findByUserId(userId)).thenReturn(Arrays.asList());

        // Act
        List<Invitation> result = invitationService.getInvitationsByUserId(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(invitationRepository, times(1)).findByUserId(userId);
    }

    @Test
    void createInvitation_ShouldSaveAndReturnInvitation() {
        // Arrange
        Invitation newInvitation = new Invitation(null, testEventId, testUserId, 
                LocalDateTime.now(), InvitationStatus.PENDING);
        Invitation savedInvitation = new Invitation(UUID.randomUUID(), testEventId, testUserId, 
                LocalDateTime.now(), InvitationStatus.PENDING);

        when(invitationRepository.save(any(Invitation.class))).thenReturn(savedInvitation);

        // Act
        Invitation result = invitationService.createInvitation(newInvitation);

        // Assert
        assertNotNull(result);
        assertEquals(savedInvitation.getId(), result.getId());
        assertEquals(savedInvitation.getEventId(), result.getEventId());
        assertEquals(savedInvitation.getUserId(), result.getUserId());
        verify(invitationRepository, times(1)).save(any(Invitation.class));
    }

    @Test
    void updateInvitation_WhenInvitationExists_ShouldUpdateAndReturnInvitation() {
        // Arrange
        Invitation updateData = new Invitation(null, testEventId, testUserId, 
                LocalDateTime.now(), InvitationStatus.ACCEPTED);
        Invitation updatedInvitation = new Invitation(testInvitationId, testEventId, testUserId, 
                testInvitation.getCreatedAt(), InvitationStatus.ACCEPTED);

        when(invitationRepository.findById(testInvitationId)).thenReturn(Optional.of(testInvitation));
        when(invitationRepository.save(any(Invitation.class))).thenReturn(updatedInvitation);

        // Act
        Invitation result = invitationService.updateInvitation(testInvitationId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals(InvitationStatus.ACCEPTED, result.getStatus());
        verify(invitationRepository, times(1)).findById(testInvitationId);
        verify(invitationRepository, times(1)).save(any(Invitation.class));
    }

    @Test
    void updateInvitation_WhenInvitationNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        Invitation updateData = new Invitation(null, testEventId, testUserId, 
                LocalDateTime.now(), InvitationStatus.REJECTED);
        when(invitationRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            invitationService.updateInvitation(nonExistentId, updateData);
        });

        assertEquals("Invitation not found", exception.getMessage());
        verify(invitationRepository, times(1)).findById(nonExistentId);
        verify(invitationRepository, never()).save(any(Invitation.class));
    }

    @Test
    void deleteInvitation_ShouldCallRepositoryDelete() {
        // Arrange
        UUID invitationId = UUID.randomUUID();
        doNothing().when(invitationRepository).deleteById(invitationId);

        // Act
        invitationService.deleteInvitation(invitationId);

        // Assert
        verify(invitationRepository, times(1)).deleteById(invitationId);
    }
}



