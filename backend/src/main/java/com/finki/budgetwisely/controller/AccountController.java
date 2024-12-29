package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.dto.AccountBalanceDto;
import com.finki.budgetwisely.dto.AccountRequestDto;
import com.finki.budgetwisely.dto.FilterDto;
import com.finki.budgetwisely.model.Account;
import com.finki.budgetwisely.model.Transaction;
import com.finki.budgetwisely.service.AccountHistoryService;
import com.finki.budgetwisely.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;
    private final AccountHistoryService accountHistoryService;

    public AccountController(AccountService accountService, AccountHistoryService accountHistoryService) {
        this.accountService = accountService;
        this.accountHistoryService = accountHistoryService;
    }

    @GetMapping
    private List<Account> findAll() {
        return this.accountService.findAll();
    }

    @GetMapping("/{user}")
    private List<Account> findAll(@PathVariable Long user) {
        return this.accountService.findAll(user);
    }

    @PostMapping("/add")
    public ResponseEntity<Account> save(@RequestBody AccountRequestDto accountDto) {
        return this.accountService.save(accountDto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Account> save(@PathVariable Long id, @RequestBody AccountRequestDto accountDto) {
        return this.accountService.edit(id, accountDto)
                .map(account -> ResponseEntity.ok().body(account))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteById(@PathVariable Long id) {
        this.accountService.deleteById(id);
        if (this.accountService.findById(id).isEmpty()) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/balance-history")
    private List<AccountBalanceDto> getBalanceHistory(@RequestBody FilterDto filterDto) {
        return this.accountHistoryService.filter(filterDto);
    }

    @GetMapping("/total-balance/{id}")
    private Long getTotalBalance(@PathVariable Long id) {
        return this.accountService.getTotalBalance(id);
    }
}
