package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.model.User;
import com.finki.budgetwisely.repository.UserRepository;
import com.finki.budgetwisely.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
