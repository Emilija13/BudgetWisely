package com.finki.budgetwisely.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Table(name = "budgets")
@Entity
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "spending_limit")
    private Long spendingLimit;

    private Long leftover;

    @Column(name = "year_month")
    private LocalDate yearMonth;

    @ManyToOne
    private Category category;

    @ManyToOne
    @JsonIgnore
    private User user;

    public Budget() {
    }
    public Budget(Long spendingLimit, Long leftover, Category category, User user, LocalDate yearMonth) {
        this.spendingLimit = spendingLimit;
        this.leftover = leftover;
        this.yearMonth = yearMonth;
        this.category = category;
        this.user = user;
    }
}
