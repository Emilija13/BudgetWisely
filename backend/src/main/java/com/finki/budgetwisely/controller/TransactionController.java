package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.model.Transaction;
import com.finki.budgetwisely.service.TransactionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    private List<Transaction> findAll() {
        return this.transactionService.findAll();
    }
}
