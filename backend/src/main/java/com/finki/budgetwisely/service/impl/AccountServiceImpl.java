package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.AccountRequestDto;
import com.finki.budgetwisely.exceptions.AccountNotFoundException;
import com.finki.budgetwisely.exceptions.UserNotFoundException;
import com.finki.budgetwisely.model.Account;
import com.finki.budgetwisely.model.User;
import com.finki.budgetwisely.repository.AccountRepository;
import com.finki.budgetwisely.repository.UserRepository;
import com.finki.budgetwisely.service.AccountService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Account> findAll() {
        return this.accountRepository.findAll();
    }

    @Override
    public Optional<Account> findById(Long id) {
        return this.accountRepository.findById(id);
    }

    @Override
    public Optional<Account> save(AccountRequestDto accountDto) {
        User user = this.userRepository.findById(accountDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(accountDto.getUser()));

        //this.accountRepository.deleteByName(accountDto.getName());
        System.out.println(accountDto.getBalance());
        Account account = new Account(accountDto.getName(), accountDto.getBalance(), user);
        this.accountRepository.save(account);

        return Optional.of(account);    }

    @Override
    public Optional<Account> edit(Long id, AccountRequestDto accountDto) {
        Account account = this.accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(id));

        account.setName(accountDto.getName());
        account.setBalance(accountDto.getBalance());

        System.out.println(accountDto.getBalance());

        User user = this.userRepository.findById(accountDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(accountDto.getUser()));
        account.setUser(user);

        this.accountRepository.save(account);
        return Optional.of(account);
    }

    @Override
    public void deleteById(Long id) {
        this.accountRepository.deleteById(id);
    }
}
