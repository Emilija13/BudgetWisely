package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.AccountRequestDto;
import com.finki.budgetwisely.exceptions.AccountNotFoundException;
import com.finki.budgetwisely.exceptions.UserNotFoundException;
import com.finki.budgetwisely.model.*;
import com.finki.budgetwisely.repository.*;
import com.finki.budgetwisely.service.AccountService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final AccountHistoryRepository accountHistoryRepository;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository, BudgetRepository budgetRepository, TransactionRepository transactionRepository, AccountHistoryRepository accountHistoryRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.accountHistoryRepository = accountHistoryRepository;
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
    public List<Account> findAll(Long userId) {
        return accountRepository.findAllByUserId(userId);
    }

    @Override
    public Optional<Account> save(AccountRequestDto accountDto) {
        User user = this.userRepository.findById(accountDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(accountDto.getUser()));

        //this.accountRepository.deleteByName(accountDto.getName());
        System.out.println(accountDto.getBalance());
        Account account = new Account(accountDto.getName(), accountDto.getBalance(), user);
        this.accountRepository.save(account);

        AccountHistory accountHistory = new AccountHistory(account, account.getBalance(), accountRepository.getTotalBalanceByUserId(user.getId()), LocalDateTime.now());
        accountHistoryRepository.save(accountHistory);

        return Optional.of(account);
    }

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


        AccountHistory accountHistory = new AccountHistory(account, account.getBalance(), user.getId(), LocalDateTime.now());
        accountHistoryRepository.save(accountHistory);

        return Optional.of(account);
    }

    @Transactional
    @Override
    public void deleteById(Long id) {

        List<Transaction> transactions = transactionRepository.findAllByAccountId(id);

        Account account = accountRepository.findById(id).orElseThrow(() ->new AccountNotFoundException(id));
        Long userId = account.getUser().getId();

        for(Transaction t : transactions){
            LocalDate yearMonth = t.getDate().toLocalDate().withDayOfMonth(1);

            Budget budget = this.budgetRepository.findByUserAndCategoryAndYearMonth(userId, t.getCategory().getId(), yearMonth)
                    .orElse(null);

            if (budget != null) {
                budget.setLeftover(budget.getLeftover() + (t.getCost()));
                this.budgetRepository.save(budget);
            }
            transactionRepository.deleteById(t.getId());
        }


        this.accountRepository.deleteById(id);

        AccountHistory accountHistory = new AccountHistory(null, null, accountRepository.getTotalBalanceByUserId(userId), LocalDateTime.now());
        accountHistoryRepository.save(accountHistory);
    }

    @Override
    public Long getTotalBalance(Long id) {
        return accountRepository.getTotalBalanceByUserId(id);
    }
}
