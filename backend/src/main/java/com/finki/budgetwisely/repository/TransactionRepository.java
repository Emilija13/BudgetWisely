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
}
