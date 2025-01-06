package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.FilterDto;
import com.finki.budgetwisely.dto.FilteredTransactionsDto;
import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.exceptions.*;
import com.finki.budgetwisely.model.*;
import com.finki.budgetwisely.model.enums.TransactionType;
import com.finki.budgetwisely.repository.*;
import com.finki.budgetwisely.service.TransactionService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final AccountHistoryServiceImpl accountHistoryService;

    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  CategoryRepository categoryRepository,
                                  AccountRepository accountRepository,
                                  BudgetRepository budgetRepository,
                                  UserRepository userRepository, AccountHistoryServiceImpl accountHistoryService) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.accountHistoryService = accountHistoryService;
    }

    @Override
    public List<Transaction> findAll() {
        return this.transactionRepository.findAll();
    }

    @Override
    public FilteredTransactionsDto filter(FilterDto filterDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Transaction> query = cb.createQuery(Transaction.class);
        Root<Transaction> transaction = query.from(Transaction.class);

        List<Predicate> predicates = new ArrayList<>();

        if (filterDto.getUserId() == null) {
            throw new IllegalArgumentException();
        } else {
            predicates.add(cb.equal(transaction.get("account").get("user").get("id"), filterDto.getUserId()));
        }

        if (filterDto.getAccountId() != null) {
            predicates.add(cb.equal(transaction.get("account").get("id"), filterDto.getAccountId()));
        }

        if (filterDto.getCategoryId() != null) {
            predicates.add(cb.equal(transaction.get("category").get("id"), filterDto.getCategoryId()));
        }

        if (filterDto.getType() != null) {
            predicates.add(cb.equal(transaction.get("type"), filterDto.getType()));
        }

        if (filterDto.getStart() != null && filterDto.getEnd() != null) {
            LocalDate start = LocalDate.parse(filterDto.getStart());
            LocalDate end = LocalDate.parse(filterDto.getEnd());

            predicates.add(cb.greaterThanOrEqualTo(transaction.get("date"), start.atStartOfDay()));
            predicates.add(cb.lessThanOrEqualTo(transaction.get("date"), end.atTime(23, 59, 59)));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        // Add sorting
        if (filterDto.getSortField() != null && filterDto.getSortDirection() != null) {
            Path<Object> sortPath = transaction.get(filterDto.getSortField());
            if (filterDto.getSortDirection().equalsIgnoreCase("ASC")) {
                query.orderBy(cb.asc(sortPath));
            } else if (filterDto.getSortDirection().equalsIgnoreCase("DESC")) {
                query.orderBy(cb.desc(sortPath));
            }
        }

        List<Transaction> transactions = entityManager.createQuery(query).getResultList();

        List<Long> transactionIds = transactions.stream().map(Transaction::getId).toList();
        Double totalAmount = transactionRepository.getTotalCostByIds(transactionIds);
        Double totalExpenses = transactionRepository.getTotalCostOfExpensesByIds(transactionIds);
        Double totalIncome = transactionRepository.getTotalCostOfIncomesByIds(transactionIds);

        totalAmount = totalAmount != null ? totalAmount : 0.0;
        totalExpenses = totalExpenses != null ? totalExpenses : 0.0;
        totalIncome = totalIncome != null ? totalIncome : 0.0;

        return new FilteredTransactionsDto(totalAmount, totalExpenses, totalIncome, transactions);
    }


    @Override
    public List<Transaction> findAll(Long userId) {
        return transactionRepository.findAllByUserId(userId);
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
        updateAccountAndBudget(account, category, transaction, transactionDto.getDate(), true);

        accountHistoryService.updateHistoryOnAddTransaction(transaction);

        return Optional.of(transaction);
    }

    @Override
    @Transactional
    public Optional<Transaction> edit(Long id, TransactionRequestDto transactionDto) {
        Transaction updateTransaction = this.transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException(id));

        Account oldAccount = this.accountRepository.findById(updateTransaction.getAccount().getId())
                .orElseThrow(() -> new AccountNotFoundException(updateTransaction.getAccount().getId()));

        Category oldCategory = this.categoryRepository.findById(updateTransaction.getCategory().getId())
                .orElseThrow(() -> new CategoryNotFoundException(updateTransaction.getCategory().getId()));

        updateAccountAndBudget(oldAccount, oldCategory, updateTransaction, updateTransaction.getDate(), false);

        Account newAccount = this.accountRepository.findById(transactionDto.getAccount())
                .orElseThrow(() -> new AccountNotFoundException(transactionDto.getAccount()));

        Category newCategory = this.categoryRepository.findById(transactionDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(transactionDto.getCategory()));

        this.accountHistoryService.updateHistoryOnDeleteTransaction(updateTransaction);

        updateTransaction.setName(transactionDto.getName());
        updateTransaction.setCost(transactionDto.getCost());
        updateTransaction.setDate(transactionDto.getDate());
        updateTransaction.setType(transactionDto.getType());
        updateTransaction.setAccount(newAccount);
        updateTransaction.setCategory(newCategory);

        this.transactionRepository.save(updateTransaction);
        updateAccountAndBudget(newAccount, newCategory, updateTransaction, transactionDto.getDate(), true);

        this.accountHistoryService.updateHistoryOnAddTransaction(updateTransaction);

        return Optional.of(updateTransaction);
    }

    private void updateAccountAndBudget(Account account, Category category, Transaction transaction, LocalDateTime date, boolean isAddition) {
        if (transaction.getType().equals(TransactionType.INCOME)) {
            account.setBalance(account.getBalance() + (isAddition ? transaction.getCost() : -transaction.getCost()));
        } else {
            account.setBalance(account.getBalance() - (isAddition ? transaction.getCost() : -transaction.getCost()));

            User user = this.userRepository.findById(account.getUser().getId())
                    .orElseThrow(() -> new UserNotFoundException(account.getUser().getId()));

            LocalDate yearMonth = date.toLocalDate().withDayOfMonth(1);

            Budget budget = this.budgetRepository.findByUserAndCategoryAndYearMonth(user.getId(), category.getId(), yearMonth)
                    .orElse(null);

            if (budget != null) {
                budget.setLeftover(budget.getLeftover() + (isAddition ? -transaction.getCost() : transaction.getCost()));
                this.budgetRepository.save(budget);
            }
        }

        this.accountRepository.save(account);
    }


    @Override
    @Transactional
    public void deleteById(Long id) {
        try {
            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new TransactionNotFoundException(id));

            Account account = accountRepository.findById(transaction.getAccount().getId())
                    .orElseThrow(() -> new AccountNotFoundException(transaction.getAccount().getId()));

            logger.info("Deleting transaction with ID: " + transaction.getId());

            // Call updateAccountAndBudget to handle account and budget updates
            updateAccountAndBudget(account, transaction.getCategory(), transaction, transaction.getDate(), false);

            accountHistoryService.updateHistoryOnDeleteTransaction(transaction);
            transactionRepository.flush();

            this.transactionRepository.deleteById(id);

            logger.info("Successfully deleted transaction with ID: " + transaction.getId());

        } catch (Exception e) {
            logger.error("Error occurred while deleting transaction with ID: " + id, e);
            throw e;
        }
    }


    @Override
    public List<Transaction> getLastTransactions(Long user) {
        return this.transactionRepository.getLastTransactions(user);
    }

}
