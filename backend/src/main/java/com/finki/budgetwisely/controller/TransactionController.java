package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.model.Transaction;
import com.finki.budgetwisely.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
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
    @PostMapping("/add")
    public ResponseEntity<Transaction> save(@RequestBody TransactionRequestDto transactionDto) {
        return this.transactionService.save(transactionDto)
                .map(transaction -> ResponseEntity.ok().body(transaction))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Transaction> save(@PathVariable Long id, @RequestBody TransactionRequestDto transactionDto) {
        return this.transactionService.edit(id, transactionDto)
                .map(transaction -> ResponseEntity.ok().body(transaction))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        this.transactionService.deleteById(id);
        if (this.transactionService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

}
