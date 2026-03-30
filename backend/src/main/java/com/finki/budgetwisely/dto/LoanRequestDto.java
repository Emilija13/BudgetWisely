package com.finki.budgetwisely.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class LoanRequestDto {
    private String purpose;

    private String bank_name;

    private Long amount;

    private Long deposit;

    private Float interest_rate;

    private Long monthly_payment;

    private Integer period;

    private LocalDate start_date;

    private Long account;

    private Long user;
}
