package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findById(Long id);

    List<Account> findAllByUserId(Long user);
}
