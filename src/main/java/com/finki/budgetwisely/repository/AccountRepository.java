package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
