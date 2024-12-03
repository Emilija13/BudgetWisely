package com.finki.budgetwisely.dto;

import com.finki.budgetwisely.model.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TransactionRequestDto {
    private String name;
    private Long cost;
    private LocalDateTime date;
    private TransactionType type;
    private Long category;
    private Long account;
}
