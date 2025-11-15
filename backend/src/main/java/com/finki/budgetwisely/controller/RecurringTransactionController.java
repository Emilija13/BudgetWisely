package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.dto.RecurringTransactionDto;
import com.finki.budgetwisely.model.RecurringTransaction;
import com.finki.budgetwisely.service.RecurringTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RequestMapping("/api/recurring-transactions")
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    public RecurringTransactionController(RecurringTransactionService recurringTransactionService) {
        this.recurringTransactionService = recurringTransactionService;
    }

    @GetMapping("/{user}")
    private List<RecurringTransaction> findAll(@PathVariable Long user) {
        return this.recurringTransactionService.findAll(user);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<RecurringTransaction> editRecurringTransaction(
            @PathVariable Long id,
            @RequestBody RecurringTransactionDto dto) {
        return recurringTransactionService.editRecurringTransaction(id, dto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}/toggle-active")
    public RecurringTransaction toggleActiveStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        return recurringTransactionService.toggleActiveStatus(id, active);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        this.recurringTransactionService.deleteById(id);
        if (this.recurringTransactionService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

}
