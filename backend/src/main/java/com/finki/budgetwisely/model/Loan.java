package com.finki.budgetwisely.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Period;

@Data
@Table(name = "loans")
@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String purpose;

    private String bank_name;

    private Long amount;

    private Long deposit;

    private Float interest_rate;

    private Long monthly_payment;

    private Long total_interest;

    private Integer period;

    private Integer months_paid;

    private LocalDate start_date;

    @ManyToOne
    private Account account;

    @ManyToOne
    @JsonIgnore
    private User user;

    public Loan() {
    }

    public Loan(String purpose, String bank_name, Long amount, Long deposit, Float interest_rate, Long monthly_payment, Integer period, LocalDate start_date, Account account, User user) {
        this.purpose = purpose;
        this.bank_name = bank_name;
        this.amount = amount;
        this.deposit = deposit;
        this.interest_rate = interest_rate;
        this.monthly_payment = monthly_payment;
        this.total_interest = calculateTotalInterest(monthly_payment,period,amount,deposit);
        this.period = period;
        this.months_paid = calculateMonthsPaid(start_date, period);
        this.start_date = start_date;
        this.account = account;
        this.user = user;
    }
    public Long calculateTotalInterest(Long monthly_payment, Integer period, Long amount, Long deposit){
        return monthly_payment * period - (amount - deposit);
    }
    public int calculateMonthsPaid(LocalDate startDate, int totalPeriod) {

        if (startDate.equals(LocalDate.now()))
            return 1;
        if (startDate == null || !startDate.isBefore(LocalDate.now())) {
            return 0;
        }

        Period diff = Period.between(startDate, LocalDate.now());
        int monthsPassed = diff.getYears() * 12 + diff.getMonths()+1;

        return Math.min(monthsPassed, totalPeriod);
    }
}
