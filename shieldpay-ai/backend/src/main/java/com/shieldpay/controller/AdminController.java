package com.shieldpay.controller;

import com.shieldpay.dto.*;
import com.shieldpay.entity.AdminEvent;
import com.shieldpay.entity.User;
import com.shieldpay.exception.ValidationException;
import com.shieldpay.repository.AdminEventRepository;
import com.shieldpay.repository.UserRepository;
import com.shieldpay.service.AdminAnalyticsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminAnalyticsService adminAnalyticsService;
    private final UserRepository userRepository;
    private final AdminEventRepository adminEventRepository;

    public AdminController(
            AdminAnalyticsService adminAnalyticsService,
            UserRepository userRepository,
            AdminEventRepository adminEventRepository
    ) {
        this.adminAnalyticsService = adminAnalyticsService;
        this.userRepository = userRepository;
        this.adminEventRepository = adminEventRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAdminStatus() {
        long adminCount = userRepository.countByRole("ADMIN");
        return ResponseEntity.ok(Map.of(
                "hasAdmin", adminCount > 0,
                "adminCount", adminCount
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> registerAdmin(@Valid @RequestBody RegisterAdminRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ValidationException("An account with this email address already exists. Please sign in.");
        }

        User newAdmin = new User(request.getName().trim(), email, request.getPassword(), "ADMIN");
        User savedAdmin = userRepository.save(newAdmin);

        adminEventRepository.save(new AdminEvent(
                "ADMIN_REGISTERED",
                "Administrator account created: " + savedAdmin.getEmail() + " (" + savedAdmin.getName() + ")"
        ));

        String token = "shield-token-" + UUID.randomUUID().toString();
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(
                true,
                token,
                savedAdmin.getEmail(),
                savedAdmin.getName(),
                "ADMIN",
                "Administrator account created and authenticated successfully."
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("ADMIN".equalsIgnoreCase(user.getRole()) && request.getPassword().equals(user.getPassword())) {
                String token = "shield-token-" + UUID.randomUUID().toString();
                adminEventRepository.save(new AdminEvent(
                        "ADMIN_LOGIN",
                        "Administrator logged in: " + user.getEmail()
                ));
                return ResponseEntity.ok(new LoginResponse(
                        true,
                        token,
                        user.getEmail(),
                        user.getName(),
                        "ADMIN",
                        "Authentication successful."
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(
                false,
                null,
                request.getEmail(),
                null,
                null,
                "Invalid credentials. Please verify your email and password, or create an Admin account."
        ));
    }

    @GetMapping("/statistics")
    public ResponseEntity<AdminStatsResponse> getStatistics() {
        AdminStatsResponse stats = adminAnalyticsService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/trends")
    public ResponseEntity<AdminTrendsResponse> getTrends() {
        AdminTrendsResponse trends = adminAnalyticsService.getTrends();
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/signals")
    public ResponseEntity<Map<String, Long>> getSignals() {
        AdminStatsResponse stats = adminAnalyticsService.getStatistics();
        return ResponseEntity.ok(stats.getSignalFrequencies());
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Long>> getCategories() {
        AdminStatsResponse stats = adminAnalyticsService.getStatistics();
        return ResponseEntity.ok(stats.getCategoryDistribution());
    }
}
