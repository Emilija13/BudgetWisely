package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.dto.AccountRequestDto;
import com.finki.budgetwisely.dto.BudgetRequestDto;
import com.finki.budgetwisely.model.Account;
import com.finki.budgetwisely.model.Budget;
import com.finki.budgetwisely.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    private List<Budget> findAll() {
        return this.budgetService.findAll();
    }

    @GetMapping("/{user}")
    private List<Budget> findAllCurrent(@PathVariable Long user) {
        return this.budgetService.findAllCurrent(user);
    }

    @PostMapping("/add")
    public ResponseEntity<Budget> save(@RequestBody BudgetRequestDto budgetDto) {
        return this.budgetService.save(budgetDto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Budget> save(@PathVariable Long id, @RequestBody BudgetRequestDto budgetDto) {
        return this.budgetService.edit(id, budgetDto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        this.budgetService.deleteById(id);
        if (this.budgetService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }
}
