package com.finki.budgetwisely.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BudgetsStatsDto {
    Long totalAmount;
    Long spent;
}
