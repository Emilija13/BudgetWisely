package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findById(Long id);

    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId ORDER BY t.date DESC")
    List<Transaction> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId")
    List<Transaction> findAllByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT SUM(t.cost) FROM Transaction t WHERE t.id IN :transactionIds")
    Double getTotalCostByIds(@Param("transactionIds") List<Long> transactionIds);

    @Query("SELECT SUM(t.cost) FROM Transaction t WHERE t.id IN :transactionIds AND t.type = 'EXPENSE'")
    Double getTotalCostOfExpensesByIds(@Param("transactionIds") List<Long> transactionIds);

    @Query("SELECT SUM(t.cost) FROM Transaction t WHERE t.id IN :transactionIds AND t.type = 'INCOME'")
    Double getTotalCostOfIncomesByIds(@Param("transactionIds") List<Long> transactionIds);


    @Query("SELECT t " +
            "FROM Transaction t " +
            "WHERE t.account.user.id = :userId " +
            "ORDER BY t.date DESC " +
            "LIMIT 6"
    )
    List<Transaction> getLastTransactions(@Param("userId") Long userId);

}
