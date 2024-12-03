package com.finki.budgetwisely.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BudgetRequestDto {
    private Long spendingLimit;
    private Long leftover;
    private Long category;
    private Long user;
}
