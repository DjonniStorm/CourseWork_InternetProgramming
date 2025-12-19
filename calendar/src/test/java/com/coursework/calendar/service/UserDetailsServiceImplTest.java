package com.coursework.calendar.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.entities.user.UserRole;
import com.coursework.calendar.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User testUser;
    private String testEmail;

    @BeforeEach
    void setUp() {
        testEmail = "test@example.com";
        UUID userId = UUID.randomUUID();
        testUser = new User(userId, "testuser", testEmail, LocalDateTime.now(), "hashedPassword123", UserRole.USER);
    }

    @Test
    void loadUserByUsername_WhenUserExists_ShouldReturnUserDetails() {
        // Arrange
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(testEmail);

        // Assert
        assertNotNull(userDetails);
        assertEquals(testUser.getEmail(), userDetails.getUsername());
        assertEquals(testUser.getPasswordHash(), userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        verify(userRepository, times(1)).findByEmail(testEmail);
    }

    @Test
    void loadUserByUsername_WhenUserIsAdmin_ShouldReturnAdminRole() {
        // Arrange
        User adminUser = new User(UUID.randomUUID(), "admin", "admin@example.com",
                LocalDateTime.now(), "hashedPassword123", UserRole.ADMIN);
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin@example.com");

        // Assert
        assertNotNull(userDetails);
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        verify(userRepository, times(1)).findByEmail("admin@example.com");
    }

    @Test
    void loadUserByUsername_WhenUserNotExists_ShouldThrowUsernameNotFoundException() {
        // Arrange
        String nonExistentEmail = "nonexistent@example.com";
        when(userRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername(nonExistentEmail);
        });

        assertEquals("User not found: " + nonExistentEmail, exception.getMessage());
        verify(userRepository, times(1)).findByEmail(nonExistentEmail);
    }

    @Test
    void loadUserByUsername_ShouldSetCorrectPassword() {
        // Arrange
        String passwordHash = "bcrypt_hashed_password_123";
        User userWithPassword = new User(UUID.randomUUID(), "user", testEmail,
                LocalDateTime.now(), passwordHash, UserRole.USER);
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(userWithPassword));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(testEmail);

        // Assert
        assertEquals(passwordHash, userDetails.getPassword());
        verify(userRepository, times(1)).findByEmail(testEmail);
    }

    @Test
    void loadUserByUsername_ShouldSetCorrectUsername() {
        // Arrange
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(testEmail);

        // Assert
        assertEquals(testUser.getEmail(), userDetails.getUsername());
        verify(userRepository, times(1)).findByEmail(testEmail);
    }

    @Test
    void loadUserByUsername_WithDifferentUserRoles_ShouldSetCorrectRole() {
        // Arrange
        User userRole = new User(UUID.randomUUID(), "user", "user@example.com",
                LocalDateTime.now(), "pass", UserRole.USER);
        User adminRole = new User(UUID.randomUUID(), "admin", "admin@example.com",
                LocalDateTime.now(), "pass", UserRole.ADMIN);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(userRole));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(adminRole));

        // Act
        UserDetails userDetails1 = userDetailsService.loadUserByUsername("user@example.com");
        UserDetails userDetails2 = userDetailsService.loadUserByUsername("admin@example.com");

        // Assert
        assertTrue(userDetails1.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        assertTrue(userDetails2.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }
}
