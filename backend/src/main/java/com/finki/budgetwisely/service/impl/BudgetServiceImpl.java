package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.BudgetRequestDto;
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
import org.springframework.stereotype.Service;
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
    public Optional<Budget> findById(Long id) {
        return this.budgetRepository.findById(id);
    }

    @Override
    public Optional<Budget> save(BudgetRequestDto budgetDto) {
        Category category = this.categoryRepository.findById(budgetDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(budgetDto.getCategory()));

        User user = this.userRepository.findById(budgetDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(budgetDto.getUser()));


        Budget budget = new Budget(budgetDto.getSpendingLimit(),
                budgetDto.getLeftover(), category, user);
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

    @Override
    public void deleteById(Long id) {
        this.budgetRepository.deleteById(id);
    }


}
