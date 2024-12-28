package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.FilterDto;
import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.exceptions.*;
import com.finki.budgetwisely.model.*;
import com.finki.budgetwisely.model.enums.TransactionType;
import com.finki.budgetwisely.repository.*;
import com.finki.budgetwisely.service.TransactionService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final AccountHistoryRepository accountHistoryRepository;
    private final AccountHistoryServiceImpl accountHistoryService;

    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  CategoryRepository categoryRepository,
                                  AccountRepository accountRepository,
                                  BudgetRepository budgetRepository,
                                  UserRepository userRepository, AccountHistoryRepository accountHistoryRepository, AccountHistoryServiceImpl accountHistoryService) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.accountHistoryRepository = accountHistoryRepository;
        this.accountHistoryService = accountHistoryService;
    }

    @Override
    public List<Transaction> findAll() {
        return this.transactionRepository.findAll();
    }

    @Override
    public List<Transaction> filter(FilterDto filterDto) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Transaction> query = cb.createQuery(Transaction.class);
        Root<Transaction> transaction = query.from(Transaction.class);

        List<Predicate> predicates = new ArrayList<>();

        if(filterDto.getUserId() == null){
            throw new IllegalArgumentException();
        }
        else{
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

        if (filterDto.getStart() != null && filterDto.getEnd() !=null) {

            LocalDate start = LocalDate.parse(filterDto.getStart());
            LocalDate end = LocalDate.parse(filterDto.getEnd());

            predicates.add(cb.greaterThanOrEqualTo(transaction.get("date"), start.atStartOfDay()));
            predicates.add(cb.lessThanOrEqualTo(transaction.get("date"), end.atTime(23, 59, 59)));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(query).getResultList();
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
        accountHistoryService.updateHistoryOnAddTransaction(transaction);

        return Optional.of(transaction);
    }


    @Override
    @Transactional
    public Optional<Transaction> edit(Long id, TransactionRequestDto transactionDto) {
        Transaction oldTransaction = this.transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException(id));

        // Retrieve related entities
        Account oldAccount = this.accountRepository.findById(oldTransaction.getAccount().getId())
                .orElseThrow(() -> new AccountNotFoundException(oldTransaction.getAccount().getId()));
        Category oldCategory = this.categoryRepository.findById(oldTransaction.getCategory().getId())
                .orElseThrow(() -> new CategoryNotFoundException(oldTransaction.getCategory().getId()));

        Account newAccount = this.accountRepository.findById(transactionDto.getAccount())
                .orElseThrow(() -> new AccountNotFoundException(transactionDto.getAccount()));
        Category newCategory = this.categoryRepository.findById(transactionDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(transactionDto.getCategory()));

        boolean isCostChanged = !oldTransaction.getCost().equals(transactionDto.getCost());
        boolean isTypeChanged = !oldTransaction.getType().equals(transactionDto.getType());
        boolean isAccountChanged = !oldTransaction.getAccount().getId().equals(transactionDto.getAccount());
        boolean isCategoryChanged = !oldTransaction.getCategory().getId().equals(transactionDto.getCategory()) && !transactionDto.getType().equals(TransactionType.INCOME);

        // Handle cost changes
        if (isCostChanged) {
            adjustAccountBalanceOnCostChange(oldTransaction, oldAccount, transactionDto.getCost());
            adjustBudgetOnCostChange(oldTransaction, oldCategory, transactionDto.getCost());
        }

        // Handle type changes
        if (isTypeChanged) {
            adjustAccountBalanceOnTypeChange(oldTransaction, oldAccount, transactionDto.getType());
            adjustBudgetOnTypeChange(oldTransaction, oldCategory, transactionDto.getType(),newCategory);
        }

        // Handle account changes
        if (isAccountChanged) {
            adjustAccountBalanceOnAccountChange(oldTransaction, oldAccount, newAccount);
        }

        if (isCategoryChanged) {
            adjustBudgetOnCategoryChange(oldTransaction, oldCategory, newCategory);
        }

        // Update the transaction
        oldTransaction.setName(transactionDto.getName());
        oldTransaction.setCost(transactionDto.getCost());
        oldTransaction.setDate(transactionDto.getDate());
        oldTransaction.setType(transactionDto.getType());
        oldTransaction.setAccount(newAccount);
        oldTransaction.setCategory(newCategory);

        this.transactionRepository.save(oldTransaction);

        return Optional.of(oldTransaction);
    }

    private void adjustAccountBalanceOnCostChange(Transaction oldTransaction, Account oldAccount, Long newCost) {
        Long difference = newCost - oldTransaction.getCost();
        if (oldTransaction.getType().equals(TransactionType.INCOME)) {
            oldAccount.setBalance(oldAccount.getBalance() + difference);
        } else {
            oldAccount.setBalance(oldAccount.getBalance() - difference);
        }
        this.accountRepository.save(oldAccount);
    }

    private void adjustBudgetOnCostChange(Transaction oldTransaction, Category oldCategory, Long newCost) {
        User user = userRepository.findById(oldTransaction.getAccount().getUser().getId())
                .orElseThrow(() -> new UserNotFoundException(oldTransaction.getAccount().getUser().getId()));

        LocalDate yearMonth = oldTransaction.getDate().toLocalDate().withDayOfMonth(1);
        Budget budget = budgetRepository.findByUserAndCategoryAndYearMonth(user.getId(), oldCategory.getId(), yearMonth)
                .orElse(null);

        if (budget != null) {
            Long difference = oldTransaction.getCost() - newCost;
            budget.setLeftover(budget.getLeftover() + difference);
            budgetRepository.save(budget);
        }
    }

    private void adjustAccountBalanceOnTypeChange(Transaction oldTransaction, Account oldAccount, TransactionType newType) {
        if (newType.equals(TransactionType.INCOME)) {
            oldAccount.setBalance(oldAccount.getBalance() + 2 * oldTransaction.getCost());
        } else {
            oldAccount.setBalance(oldAccount.getBalance() - 2 * oldTransaction.getCost());
        }
        this.accountRepository.save(oldAccount);
    }

    private void adjustBudgetOnTypeChange(Transaction oldTransaction, Category oldCategory, TransactionType newType, Category newCategory) {
        User user = userRepository.findById(oldTransaction.getAccount().getUser().getId())
                .orElseThrow(() -> new UserNotFoundException(oldTransaction.getAccount().getUser().getId()));

        LocalDate yearMonth = oldTransaction.getDate().toLocalDate().withDayOfMonth(1);

        if (oldTransaction.getType().equals(TransactionType.EXPENSE)) {
            // If the old transaction was an expense, undo its impact on the old category budget
            Budget oldBudget = budgetRepository.findByUserAndCategoryAndYearMonth(user.getId(), oldCategory.getId(), yearMonth)
                    .orElse(null);
            if (oldBudget != null) {
                oldBudget.setLeftover(oldBudget.getLeftover() + oldTransaction.getCost());
                budgetRepository.save(oldBudget);
            }
        }

        if (newType.equals(TransactionType.EXPENSE)) {
            // If the new transaction is an expense, apply its impact on the new category budget
            Budget newBudget = budgetRepository.findByUserAndCategoryAndYearMonth(user.getId(), newCategory.getId(), yearMonth)
                    .orElse(null);
            if (newBudget != null && newBudget.getLeftover()!=newBudget.getSpendingLimit()) {
                newBudget.setLeftover(newBudget.getLeftover() - oldTransaction.getCost());
                budgetRepository.save(newBudget);
            }
        }
    }

    private void adjustAccountBalanceOnAccountChange(Transaction oldTransaction, Account oldAccount, Account newAccount) {
        if (oldTransaction.getType().equals(TransactionType.INCOME)) {
            oldAccount.setBalance(oldAccount.getBalance() - oldTransaction.getCost());
            newAccount.setBalance(newAccount.getBalance() + oldTransaction.getCost());
        } else {
            oldAccount.setBalance(oldAccount.getBalance() + oldTransaction.getCost());
            newAccount.setBalance(newAccount.getBalance() - oldTransaction.getCost());
        }
        this.accountRepository.save(oldAccount);
        this.accountRepository.save(newAccount);
    }
    private void adjustBudgetOnCategoryChange(Transaction oldTransaction, Category oldCategory, Category newCategory) {
        User user = userRepository.findById(oldTransaction.getAccount().getUser().getId())
                .orElseThrow(() -> new UserNotFoundException(oldTransaction.getAccount().getUser().getId()));

        LocalDate yearMonth = oldTransaction.getDate().toLocalDate().withDayOfMonth(1);

        // Restore the cost to the old category's budget
        if (oldTransaction.getType().equals(TransactionType.EXPENSE)) {
            Budget oldBudget = budgetRepository.findByUserAndCategoryAndYearMonth(user.getId(), oldCategory.getId(), yearMonth)
                    .orElse(null);
            if (oldBudget != null) {
                oldBudget.setLeftover(oldBudget.getLeftover() + oldTransaction.getCost());
                budgetRepository.save(oldBudget);
            }
        }

        // Deduct the cost from the new category's budget
        if (oldTransaction.getType().equals(TransactionType.EXPENSE)) {
            Budget newBudget = budgetRepository.findByUserAndCategoryAndYearMonth(user.getId(), newCategory.getId(), yearMonth)
                    .orElse(null);
            if (newBudget != null) {
                newBudget.setLeftover(newBudget.getLeftover() - oldTransaction.getCost());
                budgetRepository.save(newBudget);
            }
        }
    }




    @Override
    @Transactional
    public void deleteById(Long id) {
        try {
            // Find the transaction by ID
            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new TransactionNotFoundException(id));

            // Find the associated account
            Account account = accountRepository.findById(transaction.getAccount().getId())
                    .orElseThrow(() -> new AccountNotFoundException(transaction.getAccount().getId()));

            // Log the transaction to be deleted
            logger.info("Deleting transaction with ID: " + transaction.getId());

            // Step 1: Update the account balance by reversing the transaction cost
            account.setBalance(account.getBalance() + (transaction.getType() == TransactionType.INCOME ?
                    -transaction.getCost() : transaction.getCost()));

            // Step 2: Update the account history before deleting the transaction
            accountHistoryService.updateHistoryOnDeleteTransaction(transaction);
            transactionRepository.flush();

            // Step 3: Delete the transaction after account history is updated
            this.transactionRepository.deleteById(id);

            // Log successful deletion
            logger.info("Successfully deleted transaction with ID: " + transaction.getId());

        } catch (Exception e) {
            // Log the exception if any error occurs
            logger.error("Error occurred while deleting transaction with ID: " + id, e);
            throw e;  // Re-throw exception to let Spring handle rollback
        }
    }

}
