package com.example.MobileAppBackend.dto.authentication;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class DeveloperRegisterRequestDto {

    private String email;
    private String username;
    private String password;

}
