package com.finki.budgetwisely.service;

import com.finki.budgetwisely.dto.AccountBalanceDto;
import com.finki.budgetwisely.dto.FilterDto;
import com.finki.budgetwisely.model.AccountHistory;
import com.finki.budgetwisely.model.Transaction;

import java.util.List;

public interface AccountHistoryService {

    List<AccountBalanceDto> filter(FilterDto filterDto);

    void updateHistoryOnAddTransaction(Transaction transaction);

    void updateHistoryOnDeleteTransaction(Transaction transaction);
}
