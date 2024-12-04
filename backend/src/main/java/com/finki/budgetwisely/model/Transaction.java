package com.finki.budgetwisely.model;

import com.finki.budgetwisely.model.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Table(name = "transactions")
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long cost;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @ManyToOne(optional = true)
    private Category category;

    @ManyToOne
    private Account account;

    public Transaction() {
    }
    public Transaction(String name, Long cost, LocalDateTime date, TransactionType type,
                       Category category, Account account) {
        this.name = name;
        this.cost = cost;
        this.date = date;
        this.type = type;
        this.category = category;
        this.account = account;
    }
}
