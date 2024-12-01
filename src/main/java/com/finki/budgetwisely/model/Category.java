package com.finki.budgetwisely.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long spendingLimit;
    private Long leftover;
    @OneToMany(mappedBy = "category")
    private List<Transaction> transactions;
    public Category() {
    }
    public Category(String name, Long spendingLimit, Long leftover) {
        this.name = name;
        this.spendingLimit = spendingLimit;
        this.leftover = leftover;
    }
}
