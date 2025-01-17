package com.finki.budgetwisely.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AccountRequestDto {
    private String name;
    private Long balance;
    private Long user;
}
