package com.finki.budgetwisely.exceptions;

public class InvalidMonthlyPaymentException extends RuntimeException {
    public InvalidMonthlyPaymentException(String message) {
        super(message);
    }
}
