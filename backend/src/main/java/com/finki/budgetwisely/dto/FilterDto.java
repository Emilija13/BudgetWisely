package com.finki.budgetwisely.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class FilterDto {
    Long userId;
    Long accountId;
    Long categoryId;
    String type;
//    LocalDate yearMonth;
    String start;
    String end;
}
