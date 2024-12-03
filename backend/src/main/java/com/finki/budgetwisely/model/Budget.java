package com.finki.budgetwisely.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Data
@Entity
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long spendingLimit;

    private Long leftover;

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
