package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
}
