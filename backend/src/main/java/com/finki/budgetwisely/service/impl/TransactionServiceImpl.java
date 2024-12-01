package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.model.Transaction;
import com.finki.budgetwisely.repository.TransactionRepository;
import com.finki.budgetwisely.service.TransactionService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }
}
