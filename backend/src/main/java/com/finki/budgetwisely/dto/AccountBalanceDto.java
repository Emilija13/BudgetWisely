package com.finki.budgetwisely.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AccountBalanceDto{

    Long totalBalance;
    LocalDateTime timestamp;
    LocalDateTime createdAt;
}
