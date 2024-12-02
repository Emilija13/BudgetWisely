package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.exceptions.*;
import com.finki.budgetwisely.model.Category;
import com.finki.budgetwisely.model.Transaction;
import com.finki.budgetwisely.repository.CategoryRepository;
import com.finki.budgetwisely.repository.TransactionRepository;
import com.finki.budgetwisely.service.TransactionService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;


    public TransactionServiceImpl(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Transaction> findAll() {
        return this.transactionRepository.findAll();
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return this.transactionRepository.findById(id);
    }

    @Override
    public Optional<Transaction> save(TransactionRequestDto transactionDto) {
        Category category = this.categoryRepository.findById(transactionDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(transactionDto.getCategory()));

        //this.transactionRepository.deleteByName(productDto.getName());
        Transaction transaction = new Transaction(transactionDto.getName(), transactionDto.getCost(), transactionDto.getDate(), category);
        this.transactionRepository.save(transaction);

        return Optional.of(transaction);
    }

    @Override
    public Optional<Transaction> edit(Long id, TransactionRequestDto transactionDto) {
        Transaction transaction = this.transactionRepository.findById(id).orElseThrow(() -> new TransactionNotFoundException(id));

        transaction.setName(transactionDto.getName());
        transaction.setCost(transactionDto.getCost());
        transaction.setDate(transactionDto.getDate());

        Category category = this.categoryRepository.findById(transactionDto.getCategory())
                .orElseThrow(() -> new CategoryNotFoundException(transactionDto.getCategory()));
        transaction.setCategory(category);

        this.transactionRepository.save(transaction);
        return Optional.of(transaction);

    }

    @Override
    public void deleteById(Long id) {
        this.transactionRepository.deleteById(id);
    }
}
