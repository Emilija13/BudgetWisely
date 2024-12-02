package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.model.Transaction;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    List<Transaction> findAll();
    Optional<Transaction> findById(Long id);

    Optional<Transaction> save(TransactionRequestDto transactionDto);

    Optional<Transaction> edit(Long id, TransactionRequestDto transactionDto);

    void deleteById(Long id);
}
