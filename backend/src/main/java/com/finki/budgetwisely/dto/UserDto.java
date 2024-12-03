package com.finki.budgetwisely.dto;

import com.finki.budgetwisely.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String username;
    private Role role;
}
