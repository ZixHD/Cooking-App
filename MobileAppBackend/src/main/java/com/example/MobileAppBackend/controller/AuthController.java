package com.example.MobileAppBackend.controller;


import com.example.MobileAppBackend.dto.DeveloperRegisterRequestDto;
import com.example.MobileAppBackend.dto.DeveloperRegisterResponseDto;
import com.example.MobileAppBackend.dto.LoginRequest;
import com.example.MobileAppBackend.dto.RegisterRequest;
import com.example.MobileAppBackend.repository.UserRepository;
import com.example.MobileAppBackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        this.authService.register(registerRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/developer/register")
    public ResponseEntity<?> developerRegister(@RequestBody DeveloperRegisterRequestDto developerRegisterRequestDto) {
        DeveloperRegisterResponseDto responseDto = this.authService.developerRegister(developerRegisterRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}
