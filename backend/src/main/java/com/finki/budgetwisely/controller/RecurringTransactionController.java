package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.dto.RecurringTransactionDto;
import com.finki.budgetwisely.model.RecurringTransaction;
import com.finki.budgetwisely.service.RecurringTransactionService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RequestMapping("/api/recurring-transactions")
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    public RecurringTransactionController(RecurringTransactionService recurringTransactionService) {
        this.recurringTransactionService = recurringTransactionService;
    }

    @PutMapping("/edit/{id}")
    public RecurringTransaction editRecurringTransaction(
            @PathVariable Long id,
            @RequestBody RecurringTransactionDto dto) {
        return recurringTransactionService.editRecurringTransaction(id, dto);
    }
}
