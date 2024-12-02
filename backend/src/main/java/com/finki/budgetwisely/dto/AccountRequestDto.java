package com.finki.budgetwisely.dto;

public class AccountRequestDto {
    private String name;
    private Long balance;
    private Long user;

    public AccountRequestDto(String name, Long balance, Long user) {
        this.name = name;
        this.balance = balance;
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getBalance() {
        return balance;
    }

    public void setBalance(Long balance) {
        this.balance = balance;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }
}
