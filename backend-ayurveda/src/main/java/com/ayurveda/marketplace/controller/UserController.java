package com.ayurveda.marketplace.controller;

import com.ayurveda.marketplace.dto.UserDto;
import com.ayurveda.marketplace.model.User;
import com.ayurveda.marketplace.repository.UserRepository;
import com.ayurveda.marketplace.security.CustomUserDetailsService;
import com.ayurveda.marketplace.security.JwtUtil;
import com.ayurveda.marketplace.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("REST request to get all users");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        log.info("REST request to login user: {}", request.get("email"));
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            
            final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            final String jwt = jwtUtil.generateToken(userDetails);
            
            log.info("User {} successfully authenticated", email);
            return ResponseEntity.ok(Map.of("token", jwt));
        } catch (Exception e) {
            log.error("Authentication failed for request", e);
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User request) {
        log.info("REST request to register user: {}", request.getEmail());
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            log.warn("Registration failed: User {} already exists", request.getEmail());
            return ResponseEntity.badRequest().body("User already exists");
        }
        
        String role = (request.getRole() == null || request.getRole().isEmpty()) ? "BUYER" : request.getRole();
        
        User user = new User(request.getEmail(), passwordEncoder.encode(request.getPassword()), role);
        userRepository.save(user);
        
        log.info("User {} successfully registered", user.getEmail());
        return ResponseEntity.ok(userService.mapToDto(user));
    }
}

