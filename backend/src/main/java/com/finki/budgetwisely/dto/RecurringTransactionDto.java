package com.finki.budgetwisely.dto;

import com.finki.budgetwisely.model.enums.RecurrenceFrequency;
import com.finki.budgetwisely.model.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class RecurringTransactionDto {
    private String name;
    private Long cost;
    private TransactionType type;
    private RecurrenceFrequency frequency;
    private Integer dayOfMonth;
    private Integer dayOfWeek;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private Long categoryId;
    private Long accountId;
}