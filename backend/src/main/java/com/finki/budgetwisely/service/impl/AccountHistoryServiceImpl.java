package com.finki.budgetwisely.service.impl;

import com.finki.budgetwisely.dto.AccountBalanceDto;
import com.finki.budgetwisely.dto.FilterDto;
import com.finki.budgetwisely.model.AccountHistory;
import com.finki.budgetwisely.model.Transaction;
import com.finki.budgetwisely.model.enums.TransactionType;
import com.finki.budgetwisely.repository.AccountHistoryRepository;
import com.finki.budgetwisely.service.AccountHistoryService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountHistoryServiceImpl implements AccountHistoryService {

    private final AccountHistoryRepository accountHistoryRepository;

    public AccountHistoryServiceImpl(AccountHistoryRepository accountHistoryRepository) {
        this.accountHistoryRepository = accountHistoryRepository;
    }

    public void updateHistoryOnAddTransaction(Transaction transaction) {
        Long amount = (transaction.getType() == TransactionType.INCOME ?
                transaction.getCost() : -transaction.getCost());

        // Get the most recent history record before the current transaction
        List<AccountHistory> lastBeforeTransactions = accountHistoryRepository
                .findLastHistoryBefore(transaction.getDate());
        AccountHistory lastBeforeTransaction = lastBeforeTransactions.isEmpty() ? null : lastBeforeTransactions.get(0);

        // Get the most recent history record for the specific account before the transaction
        List<AccountHistory> lastBeforeTransactionByAccounts = accountHistoryRepository
                .findLastHistoryByAccountAndBefore(transaction.getAccount().getId(), transaction.getDate());
        AccountHistory lastBeforeTransactionByAccount = lastBeforeTransactionByAccounts.isEmpty() ? null : lastBeforeTransactionByAccounts.get(0);

        // Create a new AccountHistory record
        AccountHistory newHistory = new AccountHistory();
        newHistory.setAccount(transaction.getAccount());
        newHistory.setTransaction(transaction);
        newHistory.setTimestamp(transaction.getDate());
        newHistory.setCreatedAt(LocalDateTime.now());

        // Calculate the balance for the new transaction
        if (lastBeforeTransactionByAccount != null) {
            newHistory.setBalance(lastBeforeTransactionByAccount.getBalance() + amount);
        } else {
            newHistory.setBalance(amount);  // If no prior history exists, set it to the amount directly
        }

        if (lastBeforeTransaction != null) {
            newHistory.setTotalBalance(lastBeforeTransaction.getTotalBalance() + amount);
        } else {
            newHistory.setTotalBalance(amount);  // If no prior total balance, set it to the amount
        }

        // Save the new history record
        accountHistoryRepository.save(newHistory);

        // Update all subsequent histories with the new totalBalance and balance
        List<AccountHistory> subsequentHistories = accountHistoryRepository.findAllByTimestampAfter(newHistory.getTimestamp());

        for (AccountHistory history : subsequentHistories) {
            history.setTotalBalance(history.getTotalBalance() + amount);
            if (history.getAccount().getId().equals(transaction.getAccount().getId())) {
                history.setBalance(history.getBalance() + amount);
            }
            accountHistoryRepository.save(history);
        }
    }



    public void updateHistoryOnDeleteTransaction(Transaction transaction){
        AccountHistory toDelete = accountHistoryRepository.findByTransactionId(transaction.getId())
                .orElseThrow();

        Long amount = (transaction.getType() == TransactionType.INCOME ?
                -transaction.getCost() : transaction.getCost());

        List<AccountHistory> subsequentHistories = accountHistoryRepository.findAllByTimestampAfter(toDelete.getTimestamp());

        for (AccountHistory history : subsequentHistories) {
            history.setTotalBalance(history.getTotalBalance() + amount);
            if(history.getAccount().getId().equals(transaction.getAccount().getId())){
                history.setBalance(history.getBalance() + amount);
            }
            accountHistoryRepository.save(history);
        }

        accountHistoryRepository.delete(toDelete);

    }

    @Override
    public List<AccountBalanceDto> filter(FilterDto filterDto) {
        LocalDateTime start = LocalDate.parse(filterDto.getStart()).atStartOfDay();
        LocalDateTime end = LocalDate.parse(filterDto.getEnd()).atTime(23, 59, 59);
        List<AccountHistory> accountHistories;

        if(filterDto.getAccountId()!=null){
            accountHistories = accountHistoryRepository
                    .getAccountHistoriesByAccountAndTimestampRange(filterDto.getAccountId(),
                            start, end);

            return accountHistories.stream().map(
                    ah -> new AccountBalanceDto(ah.getBalance(), ah.getTimestamp(), ah.getCreatedAt())
            ).collect(Collectors.toList());
        }
        else{
            accountHistories = accountHistoryRepository
                    .getAccountHistoriesByTimestampRange(filterDto.getUserId(),
                            start, end);
            return accountHistories.stream().map(
                    ah -> new AccountBalanceDto(ah.getTotalBalance(), ah.getTimestamp(), ah.getCreatedAt())
            ).collect(Collectors.toList());
        }

    }
}
