package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.AccountRequestDto;
import com.finki.budgetwisely.model.Account;
import java.util.List;
import java.util.Optional;

public interface AccountService {
    List<Account> findAll();

    List<Account> findAll(Long userId);

    Optional<Account> findById(Long id);

    Optional<Account> save(AccountRequestDto accountDto);

    Optional<Account> edit(Long id, AccountRequestDto accountDto);

    void deleteById(Long id);
}
