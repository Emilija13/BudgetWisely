package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.LoanRequestDto;
import com.finki.budgetwisely.dto.TransactionRequestDto;
import com.finki.budgetwisely.exceptions.*;
import com.finki.budgetwisely.model.*;
import com.finki.budgetwisely.model.enums.TransactionType;
import com.finki.budgetwisely.repository.*;
import com.finki.budgetwisely.service.LoanService;
import com.finki.budgetwisely.service.TransactionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionService transactionService;

    public LoanServiceImpl(LoanRepository loanRepository, UserRepository userRepository, AccountRepository accountRepository, TransactionRepository transactionRepository, CategoryRepository categoryRepository, TransactionService transactionService) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.transactionService = transactionService;
    }

    @Override
    public List<Loan> findAll() {
        return this.loanRepository.findAll();
    }

    @Override
    public List<Loan> findAll(Long userId) {
            return loanRepository.findAllByUserId(userId);
    }

    @Override
    public Optional<Loan> findById(Long id) {
        return this.loanRepository.findById(id);
    }

    private boolean validateMonthlyPayment(LoanRequestDto loanDto) {
        double P = loanDto.getAmount() - loanDto.getDeposit();
        double r = loanDto.getInterest_rate() / 12 / 100.0;
        int n = loanDto.getPeriod();

        double expectedPayment = Math.ceil(P * (r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1));

        if (expectedPayment == loanDto.getMonthly_payment()) {
            return true;
        }
        return false;
    }
    @Override
    public Optional<Loan> save(LoanRequestDto loanDto) {
        Account account = this.accountRepository.findById(loanDto.getAccount())
                .orElseThrow(() -> new CategoryNotFoundException(loanDto.getAccount()));
        User user = this.userRepository.findById(loanDto.getUser())
                .orElseThrow(() -> new UserNotFoundException(loanDto.getUser()));

        boolean check = validateMonthlyPayment(loanDto);

        if (!check) {
            throw new InvalidMonthlyPaymentException("Monthly payment is not correct.");
        }

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

        boolean check = validateMonthlyPayment(loanDto);

        if (!check) {
            throw new InvalidMonthlyPaymentException("Monthly payment is not correct.");
        }

        loan.setPurpose(loanDto.getPurpose());
        loan.setBank_name(loanDto.getBank_name());
        loan.setAmount(loanDto.getAmount());
        loan.setDeposit(loanDto.getDeposit());
        loan.setInterest_rate(loanDto.getInterest_rate());
        loan.setMonthly_payment(loanDto.getMonthly_payment());
        loan.setMonths_paid(loan.calculateMonthsPaid(loanDto.getStart_date(), loanDto.getPeriod()));
        loan.setTotal_interest(loan.calculateTotalInterest(loanDto.getMonthly_payment(), loanDto.getPeriod(), loanDto.getAmount(), loanDto.getDeposit()));
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
    private int getMonthsBetween(LocalDate start, LocalDate end) {
        int yearDiff = end.getYear() - start.getYear();
        int monthDiff = end.getMonthValue() - start.getMonthValue();
        int totalMonths = yearDiff * 12 + monthDiff;

        if (end.getDayOfMonth() < start.getDayOfMonth()) {
            totalMonths--;
        }

        return totalMonths;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void generateMonthlyLoanPayments() {
        LocalDate today = LocalDate.now();
        List<Loan> allLoans = loanRepository.findAll();

        for (Loan loan : allLoans) {
            LocalDate startDate = loan.getStart_date();

            if (today.getDayOfMonth() != startDate.getDayOfMonth()) {
                continue;
            }

            int period = loan.getPeriod();
            Long monthlyPayment = loan.getMonthly_payment();

            int monthsPassed = getMonthsBetween(startDate, today);

            if (monthsPassed >= 0 && monthsPassed < period) {

                boolean exists = transactionRepository.existsLoanPaymentForDate(loan.getAccount(), today, loan.getPurpose());
                if (exists) {
                    throw new DuplicateTransactionException(
                            "A transaction already exists for loan '" + loan.getPurpose() +
                                    "' on date " + today + " for account " + loan.getAccount().getId()
                    );
                }
                if (!exists) {
                    String name = "Payment no." + loan.getMonths_paid() + " of " + loan.getPurpose();

                    TransactionRequestDto transaction = new TransactionRequestDto(name,
                            loan.getMonthly_payment(),
                            LocalDateTime.of(today, LocalTime.now()),
                            TransactionType.EXPENSE,
                            Long.valueOf(2),
                            loan.getAccount().getId());

                    transactionService.save(transaction);
                }
            }
        }
    }

}
