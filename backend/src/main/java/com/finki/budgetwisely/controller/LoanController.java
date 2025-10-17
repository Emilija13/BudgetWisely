package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.dto.LoanRequestDto;
import com.finki.budgetwisely.model.Loan;
import com.finki.budgetwisely.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RequestMapping("/api/loans")
public class LoanController {
    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    private List<Loan> findAll() {
        return this.loanService.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Loan> save(@RequestBody LoanRequestDto loanRequestDto) {
        return this.loanService.save(loanRequestDto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Loan> save(@PathVariable Long id, @RequestBody LoanRequestDto loanRequestDto) {
        return this.loanService.edit(id, loanRequestDto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        this.loanService.deleteById(id);
        if (this.loanService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

}
