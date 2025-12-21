package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.coursework.calendar.entities.invitation.Invitation;
import com.coursework.calendar.repository.InvitationRepository;

@Service
public class InvitationService {
    private final InvitationRepository invitationRepository;

    public InvitationService(InvitationRepository invitationRepository) {
        this.invitationRepository = invitationRepository;
    }

    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    public Invitation getInvitationById(UUID id) {
        return invitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
    }

    public List<Invitation> getInvitationsByUserId(UUID userId) {
        return invitationRepository.findByUserId(userId);
    }

    public Invitation createInvitation(Invitation invitation) {
        return invitationRepository.save(invitation);
    }

    public Invitation updateInvitation(UUID id, Invitation invitation) {
        Invitation existingInvitation = getInvitationById(id);
        existingInvitation.setStatus(invitation.getStatus());
        return invitationRepository.save(existingInvitation);
    }

    public void deleteInvitation(UUID id) {
        if (!invitationRepository.existsById(id)) {
            throw new RuntimeException("Invitation not found");
        }

        invitationRepository.deleteById(id);
    }
}
