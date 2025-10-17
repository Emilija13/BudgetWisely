package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.LoanRequestDto;
import com.finki.budgetwisely.exceptions.CategoryNotFoundException;
import com.finki.budgetwisely.exceptions.LoanNotFoundException;
import com.finki.budgetwisely.exceptions.UserNotFoundException;
import com.finki.budgetwisely.model.*;
import com.finki.budgetwisely.repository.AccountRepository;
import com.finki.budgetwisely.repository.LoanRepository;
import com.finki.budgetwisely.repository.UserRepository;
import com.finki.budgetwisely.service.LoanService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public LoanServiceImpl(LoanRepository loanRepository, UserRepository userRepository, AccountRepository accountRepository) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public List<Loan> findAll() {
        return this.loanRepository.findAll();
    }

    @Override
    public Optional<Loan> findById(Long id) {
        return this.loanRepository.findById(id);
    }

    @Override
    public Optional<Loan> save(LoanRequestDto loanDto) {
        Account account = this.accountRepository.findById(loanDto.getAccount())
                .orElseThrow(() -> new CategoryNotFoundException(loanDto.getAccount()));
        User user = this.userRepository.findById(loanDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(loanDto.getUser()));

        Loan loan = new Loan(loanDto.getPurpose(),
                loanDto.getBank_name(),
                loanDto.getAmount(),
                loanDto.getDeposit(),
                loanDto.getInterest_rate(),
                loanDto.getMonthly_payment(),
                loanDto.getPeriod(),
                loanDto.getStart_date(),
                account,
                user);
        loanRepository.save(loan);

        return Optional.of(loan);
    }

    @Override
    public Optional<Loan> edit(Long id, LoanRequestDto loanDto) {
        Loan loan = this.loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException(id));

        Account account = this.accountRepository.findById(loanDto.getAccount())
                .orElseThrow(() -> new CategoryNotFoundException(loanDto.getAccount()));
        User user = this.userRepository.findById(loanDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(loanDto.getUser()));

        loan.setPurpose(loanDto.getPurpose());
        loan.setBank_name(loanDto.getBank_name());
        loan.setAmount(loanDto.getAmount());
        loan.setDeposit(loanDto.getDeposit());
        loan.setInterest_rate(loanDto.getInterest_rate());
        loan.setMonthly_payment(loanDto.getMonthly_payment());
        loan.setPeriod(loanDto.getPeriod());
        loan.setStart_date(loanDto.getStart_date());
        loan.setAccount(account);
        loan.setUser(user);

        this.loanRepository.save(loan);

        return Optional.of(loan);
    }

    @Override
    public void deleteById(Long id) {
        this.loanRepository.deleteById(id);
    }
}
