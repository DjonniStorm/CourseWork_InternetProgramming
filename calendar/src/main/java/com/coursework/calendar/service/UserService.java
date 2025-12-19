package com.coursework.calendar.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.coursework.calendar.entities.user.User;
import com.coursework.calendar.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getUsername())) {
            throw new RuntimeException("User already exists");
        }
        return userRepository.save(user);
    }

    public User updateUser(UUID id, User user) {
        User existingUser = getUserById(id);
        existingUser.setUsername(user.getUsername());
        existingUser.setPasswordHash(user.getPasswordHash());
        existingUser.setRole(user.getRole());
        return userRepository.save(existingUser);
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
