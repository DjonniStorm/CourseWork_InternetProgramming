package com.coursework.calendar.mapper;

import com.coursework.calendar.api.invitation.dto.InvitationRequest;
import com.coursework.calendar.api.invitation.dto.InvitationResponse;
import com.coursework.calendar.entities.invitation.Invitation;

public class InvitationMapper {
    public static Invitation toEntity(InvitationRequest invitationRequest) {
        return new Invitation(invitationRequest.eventId(), invitationRequest.userId(), invitationRequest.status());
    }

    public static InvitationResponse toResponse(Invitation invitation) {
        return new InvitationResponse(invitation.getId(), invitation.getEventId(), invitation.getUserId(),
                invitation.getCreatedAt(), invitation.getStatus());
    }
}
