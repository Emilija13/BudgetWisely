package com.finki.budgetwisely.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private User user;
    public Account() {
    }
    public Account(String name, Long balance, User user) {
        this.name = name;
        this.balance = balance;
        this.user = user;
    }
}
