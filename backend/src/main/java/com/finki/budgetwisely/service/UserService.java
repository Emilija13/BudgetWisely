package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.UserDto;
import com.finki.budgetwisely.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<UserDto> findById(Long id);
}
