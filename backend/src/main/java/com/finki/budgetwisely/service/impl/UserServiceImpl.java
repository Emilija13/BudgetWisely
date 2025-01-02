package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.UserDto;
import com.finki.budgetwisely.model.User;
import com.finki.budgetwisely.repository.UserRepository;
import com.finki.budgetwisely.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        return this.userRepository.findAll();
    }

    @Override
    public Optional<UserDto> findById(Long id) {
        User user=this.userRepository.findById(id).get();
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getName(),user.getRole());
        return Optional.of(userDto);

    }
}
