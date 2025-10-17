package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.LoanRequestDto;
import com.finki.budgetwisely.model.Loan;

import java.util.List;
import java.util.Optional;

public interface LoanService {
    List<Loan> findAll();
    Optional<Loan> findById(Long id);
    Optional<Loan> save(LoanRequestDto loanDto);
    Optional<Loan> edit(Long id, LoanRequestDto loanDto);
    void deleteById(Long id);
}
