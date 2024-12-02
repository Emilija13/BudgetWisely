package com.finki.budgetwisely.dto;

import java.time.LocalDateTime;

public class TransactionRequestDto {
    private String name;
    private Long cost;
    private LocalDateTime date;
    private Long category;

    public TransactionRequestDto(String name, Long cost, LocalDateTime date, Long category) {
        this.name = name;
        this.cost = cost;
        this.date = date;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCost() {
        return cost;
    }

    public void setCost(Long cost) {
        this.cost = cost;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long category) {
        this.category = category;
    }
}
