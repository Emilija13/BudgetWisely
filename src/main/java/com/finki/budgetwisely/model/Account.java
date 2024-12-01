package com.finki.budgetwisely.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long balance;
    @ManyToOne
    private User user;
    public Account() {
    }
    public Account(String name, Long balance) {
        this.name = name;
        this.balance = balance;
    }
}
