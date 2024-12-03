package com.finki.budgetwisely.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class BudgetForCategoryAlreadyExistsException extends RuntimeException {
    public BudgetForCategoryAlreadyExistsException() {
        super(String.format("Budget for category already exists"));
    }

}
