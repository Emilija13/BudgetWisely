package com.finki.budgetwisely.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class BudgetNotFoundException extends RuntimeException{
    public BudgetNotFoundException(Long id) {
        super(String.format("Budget with id: %d is not found", id));
    }

    public BudgetNotFoundException() {
        super(String.format("Budget not found"));
    }
}