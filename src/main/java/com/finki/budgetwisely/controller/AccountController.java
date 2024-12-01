package com.finki.budgetwisely.controller;

import com.finki.budgetwisely.model.Account;
import com.finki.budgetwisely.service.AccountService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    private List<Account> findAll() {
        return this.accountService.findAll();
    }
}
