package com.finki.budgetwisely.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long cost;
    private LocalDateTime date;
    @ManyToOne
    private Category category;
    public Transaction() {
    }
    public Transaction(String name, Long cost, LocalDateTime date) {
        this.name = name;
        this.cost = cost;
        this.date = date;
    }
}
