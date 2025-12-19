package com.coursework.calendar.api.user.dto;

import java.util.UUID;

public record AuthResponse(String accessToken, UUID userId, String email, String username) {
}
