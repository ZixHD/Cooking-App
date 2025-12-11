package com.example.MobileAppBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class DeveloperRegisterResponseDto {

    private String id;
    private String email;
    private String username;
    private String apiKey;
    private String message;
}
