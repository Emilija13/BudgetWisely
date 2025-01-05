package com.finki.budgetwisely.exceptions;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException() {
        super("An account with this email address already exists!");
    }
}
