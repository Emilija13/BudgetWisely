package com.finki.budgetwisely.security.auth;

import com.finki.budgetwisely.dto.UserDto;
import com.finki.budgetwisely.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private UserDto user;
}
