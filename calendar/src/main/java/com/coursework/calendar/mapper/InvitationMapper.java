package com.coursework.calendar.mapper;

import java.time.LocalDateTime;

import com.coursework.calendar.api.invitation.dto.InvitationRequest;
import com.coursework.calendar.api.invitation.dto.InvitationResponse;
import com.coursework.calendar.entities.invitation.Invitation;

public class InvitationMapper {
    public static Invitation toEntity(InvitationRequest invitationRequest) {
        Invitation invitation = new Invitation();
        invitation.setEventId(invitationRequest.eventId());
        invitation.setUserId(invitationRequest.userId());
        invitation.setStatus(invitationRequest.status());
        invitation.setCreatedAt(LocalDateTime.now());
        return invitation;
    }

    public static InvitationResponse toResponse(Invitation invitation) {
        return new InvitationResponse(invitation.getId(), invitation.getEventId(), invitation.getUserId(),
                invitation.getCreatedAt(), invitation.getStatus());
    }
}
