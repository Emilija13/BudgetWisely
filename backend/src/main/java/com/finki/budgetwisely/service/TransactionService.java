package com.finki.budgetwisely.service;

import com.finki.budgetwisely.model.Transaction;
import java.util.List;

public interface TransactionService {
    List<Transaction> findAll();
}
