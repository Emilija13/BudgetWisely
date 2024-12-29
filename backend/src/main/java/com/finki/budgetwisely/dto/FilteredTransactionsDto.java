package com.finki.budgetwisely.dto;

import com.finki.budgetwisely.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FilteredTransactionsDto {
    Double totalAmount;
    List<Transaction> transactions;
}
