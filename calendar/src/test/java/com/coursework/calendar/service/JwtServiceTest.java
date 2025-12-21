package com.coursework.calendar.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.entities.user.UserRole;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    private User testUser;
    private String testSecret;

    @BeforeEach
    void setUp() {
        testSecret = "test-secret-key-for-jwt-token-generation-minimum-32-characters-long";
        ReflectionTestUtils.setField(jwtService, "secret", testSecret);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiration", 900000L); // 15 minutes
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiration", 604800000L); // 7 days

        UUID userId = UUID.randomUUID();
        testUser = new User(userId, "testuser", "test@example.com", LocalDateTime.now(), "password123", UserRole.USER);
    }

    @Test
    void generateAccessToken_ShouldReturnValidToken() {
        // Act
        String token = jwtService.generateAccessToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateAccessToken_ShouldContainUserInfo() {
        // Act
        String token = jwtService.generateAccessToken(testUser);

        // Assert
        String username = jwtService.extractUsername(token);
        UUID userId = jwtService.extractUserId(token);

        assertEquals(testUser.getEmail(), username);
        assertEquals(testUser.getId(), userId);
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken() {
        // Act
        String token = jwtService.generateRefreshToken(testUser);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateRefreshToken_ShouldBeValidRefreshToken() {
        // Act
        String token = jwtService.generateRefreshToken(testUser);

        // Assert
        assertTrue(jwtService.validateRefreshToken(token));
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        String username = jwtService.extractUsername(token);

        // Assert
        assertEquals(testUser.getEmail(), username);
    }

    @Test
    void extractUserId_ShouldReturnCorrectUserId() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        UUID userId = jwtService.extractUserId(token);

        // Assert
        assertEquals(testUser.getId(), userId);
    }

    @Test
    void extractExpiration_ShouldReturnFutureDate() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        Date expiration = jwtService.extractExpiration(token);

        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void validateToken_WhenTokenIsValid_ShouldReturnTrue() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        Boolean isValid = jwtService.validateToken(token, testUser.getEmail());

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateToken_WhenUsernameDoesNotMatch_ShouldReturnFalse() {
        // Arrange
        String token = jwtService.generateAccessToken(testUser);

        // Act
        Boolean isValid = jwtService.validateToken(token, "wrong@example.com");

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateRefreshToken_WhenTokenIsValid_ShouldReturnTrue() {
        // Arrange
        String token = jwtService.generateRefreshToken(testUser);

        // Act
        Boolean isValid = jwtService.validateRefreshToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateRefreshToken_WhenTokenIsAccessToken_ShouldReturnFalse() {
        // Arrange
        String accessToken = jwtService.generateAccessToken(testUser);

        // Act
        Boolean isValid = jwtService.validateRefreshToken(accessToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateRefreshToken_WhenTokenIsInvalid_ShouldReturnFalse() {
        // Arrange
        String invalidToken = "invalid.token.here";

        // Act
        Boolean isValid = jwtService.validateRefreshToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void validateRefreshToken_WhenTokenIsNull_ShouldReturnFalse() {
        // Act
        Boolean isValid = jwtService.validateRefreshToken(null);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void generateAccessToken_WithShortSecret_ShouldStillWork() {
        // Arrange
        ReflectionTestUtils.setField(jwtService, "secret", "short");
        User user = new User(UUID.randomUUID(), "user", "user@example.com", LocalDateTime.now(), "pass", UserRole.USER);

        // Act
        String token = jwtService.generateAccessToken(user);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void generateAccessToken_WithEmptySecret_ShouldUseDefault() {
        // Arrange
        ReflectionTestUtils.setField(jwtService, "secret", "");
        User user = new User(UUID.randomUUID(), "user", "user@example.com", LocalDateTime.now(), "pass", UserRole.USER);

        // Act
        String token = jwtService.generateAccessToken(user);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractUsername_FromRefreshToken_ShouldReturnCorrectEmail() {
        // Arrange
        String token = jwtService.generateRefreshToken(testUser);

        // Act
        String username = jwtService.extractUsername(token);

        // Assert
        assertEquals(testUser.getEmail(), username);
    }

    @Test
    void extractUserId_FromRefreshToken_ShouldReturnCorrectUserId() {
        // Arrange
        String token = jwtService.generateRefreshToken(testUser);

        // Act
        UUID userId = jwtService.extractUserId(token);

        // Assert
        assertEquals(testUser.getId(), userId);
    }
}


