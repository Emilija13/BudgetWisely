package com.finki.budgetwisely.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)

public class LoanNotFoundException extends RuntimeException{
    public LoanNotFoundException(Long id) {
        super(String.format("Loan with id: %d is not found", id));
    }

}
