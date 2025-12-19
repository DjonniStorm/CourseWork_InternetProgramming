package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists");
        }
        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());
        user.setPasswordHash(hashedPassword);
        return userRepository.save(user);
    }

    public User updateUser(UUID id, User userUpdate) {
        User existingUser = getUserById(id);
        existingUser.setEmail(userUpdate.getEmail());
        existingUser.setUsername(userUpdate.getUsername());
        existingUser.setRole(userUpdate.getRole());
        if (userUpdate.getPasswordHash() != null && !userUpdate.getPasswordHash().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userUpdate.getPasswordHash());
            existingUser.setPasswordHash(hashedPassword);
        }
        return userRepository.save(existingUser);
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
