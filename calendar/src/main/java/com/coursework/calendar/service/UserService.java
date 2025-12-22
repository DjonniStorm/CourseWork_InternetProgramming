package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists");
        }
        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(hashedPassword);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(UUID id, User userUpdate) {
        User existingUser = getUserById(id);
        existingUser.setEmail(userUpdate.getEmail() != null && !userUpdate.getEmail().isEmpty() ? userUpdate.getEmail()
                : existingUser.getEmail());
        existingUser.setUsername(
                userUpdate.getUsername() != null && !userUpdate.getUsername().isEmpty() ? userUpdate.getUsername()
                        : existingUser.getUsername());
        existingUser.setRole(
                userUpdate.getRole() != null ? userUpdate.getRole() : existingUser.getRole());
        if (userUpdate.getPasswordHash() != null && !userUpdate.getPasswordHash().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userUpdate.getPasswordHash());
            existingUser.setPasswordHash(hashedPassword);
        }
        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<User> searchUsers(String query, UUID excludeUserId,
            org.springframework.data.domain.Pageable pageable) {
        return userRepository.searchUsers(query, excludeUserId, pageable);
    }
}
