package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.exceptions.*;
import com.finki.budgetwisely.model.*;
import com.finki.budgetwisely.model.enums.TransactionType;
import com.finki.budgetwisely.repository.*;
import com.finki.budgetwisely.service.TransactionService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;


    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  CategoryRepository categoryRepository,
                                  AccountRepository accountRepository,
                                  BudgetRepository budgetRepository,
                                  UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Transaction> findAll() {
        return this.transactionRepository.findAll();
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return this.transactionRepository.findById(id);
    }

    @Transactional
    @Override
    public Optional<Transaction> save(TransactionRequestDto transactionDto) {
        Category category = this.categoryRepository.findById(transactionDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(transactionDto.getCategory()));

        Account account = this.accountRepository.findById(transactionDto.getAccount())
                .orElseThrow(() -> new AccountNotFoundException(transactionDto.getAccount()));

        Transaction transaction = new Transaction(transactionDto.getName(), transactionDto.getCost(),
                transactionDto.getDate(), transactionDto.getType(), category, account);

        this.transactionRepository.save(transaction);
        if(transaction.getType().equals(TransactionType.INCOME)){
            account.setBalance(account.getBalance() + transaction.getCost());
        }

        else{
            account.setBalance(account.getBalance() - transaction.getCost());
            User user = userRepository.findById(account.getUser().getId())
                    .orElseThrow(() -> new UserNotFoundException(account.getUser().getId()));

            LocalDate yearMonth = transactionDto.getDate().toLocalDate().withDayOfMonth(1);

            Budget budget = budgetRepository
                    .findByUserAndCategoryAndYearMonth(user.getId(), category.getId(), yearMonth)
                    .orElse(null);

            if(budget!=null){
                budget.setLeftover(budget.getLeftover()-transactionDto.getCost());
                budgetRepository.save(budget);
            }
        }

        this.accountRepository.save(account);

        return Optional.of(transaction);
    }

    @Override
    public Optional<Transaction> edit(Long id, TransactionRequestDto transactionDto) {
        Transaction transaction = this.transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException(id));

        Category category = this.categoryRepository.findById(transactionDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(transactionDto.getCategory()));

        Account account = this.accountRepository.findById(transactionDto.getAccount())
                .orElseThrow(() -> new AccountNotFoundException(transactionDto.getAccount()));

        transaction.setName(transactionDto.getName());
        transaction.setCost(transactionDto.getCost());
        transaction.setDate(transactionDto.getDate());
        transaction.setType(transactionDto.getType());
        transaction.setCategory(category);
        transaction.setAccount(account);

        this.transactionRepository.save(transaction);
        return Optional.of(transaction);

    }

    @Override
    public void deleteById(Long id) {
        this.transactionRepository.deleteById(id);
    }
}
