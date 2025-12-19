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
import org.springframework.security.crypto.password.PasswordEncoder;

import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.entities.user.UserRole;
import com.coursework.calendar.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testUser = new User(testUserId, "testuser", "test@example.com", LocalDateTime.now(), "password123",
                UserRole.USER);
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        // Arrange
        User user1 = new User(UUID.randomUUID(), "user1", "user1@example.com", LocalDateTime.now(), "pass1",
                UserRole.USER);
        User user2 = new User(UUID.randomUUID(), "user2", "user2@example.com", LocalDateTime.now(), "pass2",
                UserRole.ADMIN);
        List<User> expectedUsers = Arrays.asList(user1, user2);

        when(userRepository.findAll()).thenReturn(expectedUsers);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedUsers, result);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById(testUserId);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getUsername(), result.getUsername());
        verify(userRepository, times(1)).findById(testUserId);
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(nonExistentId);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(nonExistentId);
    }

    @Test
    void getUserByEmail_WhenUserExists_ShouldReturnUser() {
        // Arrange
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserByEmail(email);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void getUserByEmail_WhenUserNotExists_ShouldThrowRuntimeException() {
        // Arrange
        String nonExistentEmail = "nonexistent@example.com";
        when(userRepository.findByEmail(nonExistentEmail)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserByEmail(nonExistentEmail);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(nonExistentEmail);
    }

    @Test
    void createUser_WhenUserDoesNotExist_ShouldCreateAndReturnUser() {
        // Arrange
        String originalPassword = "password123";
        User newUser = new User(null, "newuser", "newuser@example.com", LocalDateTime.now(), originalPassword,
                UserRole.USER);
        String hashedPassword = "hashed_password_123";
        User savedUser = new User(UUID.randomUUID(), "newuser", "newuser@example.com", LocalDateTime.now(),
                hashedPassword, UserRole.USER);

        when(userRepository.existsByEmail(newUser.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(originalPassword)).thenReturn(hashedPassword);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.createUser(newUser);

        // Assert
        assertNotNull(result);
        assertEquals(hashedPassword, result.getPasswordHash());
        verify(userRepository, times(1)).existsByEmail(newUser.getEmail());
        verify(passwordEncoder, times(1)).encode(originalPassword);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_WhenUserAlreadyExists_ShouldThrowRuntimeException() {
        // Arrange
        User existingUser = new User(null, "existing", "existing@example.com", LocalDateTime.now(), "password123",
                UserRole.USER);
        when(userRepository.existsByEmail(existingUser.getEmail())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(existingUser);
        });

        assertEquals("User already exists", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail(existingUser.getEmail());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateAndReturnUser() {
        // Arrange
        User updateData = new User(null, "updateduser", "updated@example.com", LocalDateTime.now(), "newpassword",
                UserRole.ADMIN);
        String hashedPassword = "hashed_new_password";
        User updatedUser = new User(testUserId, "updateduser", "updated@example.com", LocalDateTime.now(),
                hashedPassword, UserRole.ADMIN);

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(updateData.getPasswordHash())).thenReturn(hashedPassword);
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // Act
        User result = userService.updateUser(testUserId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("updateduser", result.getUsername());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals(UserRole.ADMIN, result.getRole());
        assertEquals(hashedPassword, result.getPasswordHash());
        verify(userRepository, times(1)).findById(testUserId);
        verify(passwordEncoder, times(1)).encode(updateData.getPasswordHash());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldThrowRuntimeException() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        User updateData = new User(null, "updateduser", "updated@example.com", LocalDateTime.now(), "newpassword",
                UserRole.ADMIN);
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(nonExistentId, updateData);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findById(nonExistentId);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_WhenPasswordIsNull_ShouldNotUpdatePassword() {
        // Arrange
        User updateData = new User(null, "updateduser", "updated@example.com", LocalDateTime.now(), null,
                UserRole.ADMIN);
        User updatedUser = new User(testUserId, "updateduser", "updated@example.com", LocalDateTime.now(),
                testUser.getPasswordHash(), UserRole.ADMIN);

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // Act
        User result = userService.updateUser(testUserId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("updateduser", result.getUsername());
        assertEquals(testUser.getPasswordHash(), result.getPasswordHash());
        verify(userRepository, times(1)).findById(testUserId);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WhenPasswordIsEmpty_ShouldNotUpdatePassword() {
        // Arrange
        User updateData = new User(null, "updateduser", "updated@example.com", LocalDateTime.now(), "", UserRole.ADMIN);
        User updatedUser = new User(testUserId, "updateduser", "updated@example.com", LocalDateTime.now(),
                testUser.getPasswordHash(), UserRole.ADMIN);

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // Act
        User result = userService.updateUser(testUserId, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("updateduser", result.getUsername());
        assertEquals(testUser.getPasswordHash(), result.getPasswordHash());
        verify(userRepository, times(1)).findById(testUserId);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_ShouldCallRepositoryDelete() {
        // Arrange
        UUID userId = UUID.randomUUID();
        doNothing().when(userRepository).deleteById(userId);

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository, times(1)).deleteById(userId);
    }
}
