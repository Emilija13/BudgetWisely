package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.model.Account;
import com.finki.budgetwisely.repository.AccountRepository;
import com.finki.budgetwisely.service.AccountService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }
}
