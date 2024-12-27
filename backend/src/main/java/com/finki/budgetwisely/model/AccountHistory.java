package com.finki.budgetwisely.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "accounts_history")
@NoArgsConstructor
public class AccountHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Account account;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    Transaction transaction;

    private Long balance;

    @Column(name = "total_balance")
    private Long totalBalance;

    private LocalDateTime timestamp;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AccountHistory(Account account, Long balance, Long totalBalance, LocalDateTime timestamp) {
        this.account = account;
        this.balance = balance;
        this.totalBalance = totalBalance;
        this.timestamp = timestamp;
        this.createdAt = LocalDateTime.now();
    }

    public AccountHistory(Account account, Transaction transaction, Long balance, Long totalBalance, LocalDateTime timestamp) {
        this.account = account;
        this.balance = balance;
        this.totalBalance = totalBalance;
        this.timestamp = timestamp;
        this.createdAt = LocalDateTime.now();
        this.transaction = transaction;
    }
}
