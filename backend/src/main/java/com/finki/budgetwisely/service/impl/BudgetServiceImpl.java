package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.BudgetRequestDto;
import com.finki.budgetwisely.dto.BudgetsStatsDto;
import com.finki.budgetwisely.exceptions.BudgetForCategoryAlreadyExistsException;
import com.finki.budgetwisely.exceptions.BudgetNotFoundException;
import com.finki.budgetwisely.exceptions.CategoryNotFoundException;
import com.finki.budgetwisely.exceptions.UserNotFoundException;
import com.finki.budgetwisely.model.Budget;
import com.finki.budgetwisely.model.Category;
import com.finki.budgetwisely.model.User;
import com.finki.budgetwisely.repository.BudgetRepository;
import com.finki.budgetwisely.repository.CategoryRepository;
import com.finki.budgetwisely.repository.UserRepository;
import com.finki.budgetwisely.service.BudgetService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetServiceImpl implements BudgetService {
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Budget> findAll() {
        return this.budgetRepository.findAll();
    }

    @Override
    public List<Budget> findAllCurrent(Long userId) {
        LocalDate yearMonth = LocalDate.now().withDayOfMonth(1);

        return budgetRepository.findByUserAndYearMonth(userId, yearMonth);
    }

    @Override
    public Optional<Budget> findById(Long id) {
        return this.budgetRepository.findById(id);
    }



    @Override
    public Optional<Budget> save(BudgetRequestDto budgetDto) {
        Category category = this.categoryRepository.findById(budgetDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(budgetDto.getCategory()));

        User user = this.userRepository.findById(budgetDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(budgetDto.getUser()));

        LocalDate yearMonth = LocalDate.now().withDayOfMonth(1);

        Optional<Budget> existingBudget = budgetRepository
                .findByUserAndCategoryAndYearMonth(user.getId(), category.getId(), yearMonth);
        if (existingBudget.isPresent()) {
            throw new BudgetForCategoryAlreadyExistsException();
        }

        Budget budget = new Budget(budgetDto.getSpendingLimit(),
                budgetDto.getLeftover(), category, user, yearMonth);
        budgetRepository.save(budget);

        return Optional.of(budget);
    }

    @Override
    public Optional<Budget> edit(Long id, BudgetRequestDto budgetDto) {
        Budget budget = this.budgetRepository.findById(id)
                .orElseThrow(() -> new BudgetNotFoundException(id));

        Category category = this.categoryRepository.findById(budgetDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(budgetDto.getCategory()));

        budget.setLeftover(budgetDto.getLeftover());
        budget.setSpendingLimit(budgetDto.getSpendingLimit());
        budget.setCategory(category);

        this.budgetRepository.save(budget);

        return Optional.of(budget);
    }

    @Scheduled(cron = "0 0 0 1 * *")
    public void createBudgetsForNewMonth() {
        LocalDate today = LocalDate.now().withDayOfMonth(1);

        LocalDate firstDayOfPreviousMonth = today.minusMonths(1).withDayOfMonth(1);

        List<Budget> previousMonthBudgets = budgetRepository.findByYearMonth(firstDayOfPreviousMonth);

        for (Budget previousBudget : previousMonthBudgets) {
            Budget newBudget = new Budget();
            newBudget.setUser(previousBudget.getUser());
            newBudget.setCategory(previousBudget.getCategory());
            newBudget.setSpendingLimit(previousBudget.getSpendingLimit());
            newBudget.setLeftover(previousBudget.getSpendingLimit());
            newBudget.setYearMonth(today.withDayOfMonth(1));

            budgetRepository.save(newBudget);
        }
    }

    @Override
    public void deleteById(Long id) {
        this.budgetRepository.deleteById(id);
    }

    @Override
    public List<Budget> getLastCurrentBudgets(Long user) {
        LocalDate yearMonth = LocalDate.now().withDayOfMonth(1);

        return budgetRepository.findByUserAndYearMonthLast(user, yearMonth);
    }

    @Override
    public BudgetsStatsDto findCurrentBudgetsProgress(Long user) {
        LocalDate yearMonth = LocalDate.now().withDayOfMonth(1);
        Long totalAmount = budgetRepository.findTotalSpendingLimitByUserAndYearMonth(user, yearMonth);

        totalAmount = (totalAmount != null) ? totalAmount : 0;

        Long leftover = budgetRepository.findLeftoverByUserAndYearMonth(user, yearMonth);
        Long spent = totalAmount - (leftover != null ? leftover : 0);

        return new BudgetsStatsDto(totalAmount, spent);
    }


    @Override
    public Long findSavedLastMonth(Long user) {
        LocalDate yearMonth = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        return budgetRepository.findLeftoverByUserAndYearMonth(user, yearMonth);
    }

}
