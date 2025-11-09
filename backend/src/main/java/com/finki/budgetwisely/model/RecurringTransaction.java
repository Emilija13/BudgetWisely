package com.finki.budgetwisely.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finki.budgetwisely.model.enums.RecurrenceFrequency;
import com.finki.budgetwisely.model.enums.TransactionType;
import jakarta.persistence.*;

import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Table(name = "recurring_transactions")
@Entity
public class RecurringTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Long cost;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    private RecurrenceFrequency frequency;

    private Integer dayOfMonth;
    private Integer dayOfWeek;

    private LocalDate startDate;
    private LocalDate endDate; // Optional

    private Boolean isActive = true;

    private LocalDate lastProcessedDate;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Account account;

    @JsonIgnore
    @OneToMany(mappedBy = "recurringTransaction", cascade = CascadeType.ALL)
    private List<Transaction> generatedTransactions = new ArrayList<>();

    public RecurringTransaction() {
    }
}


