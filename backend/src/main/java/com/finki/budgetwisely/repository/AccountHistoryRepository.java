package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.dto.AccountBalanceDto;
import com.finki.budgetwisely.model.AccountHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface AccountHistoryRepository extends JpaRepository<AccountHistory, Long> {

    List<AccountHistory> findAllByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT ah FROM AccountHistory ah WHERE ah.account.id = :accountId AND ah.timestamp <= :timestamp ORDER BY ah.timestamp DESC, ah.createdAt DESC")
    List<AccountHistory> findLastHistoryByAccountAndBefore(@Param("accountId") Long accountId, @Param("timestamp") LocalDateTime timestamp);

    @Query("SELECT ah FROM AccountHistory ah WHERE ah.timestamp <= :timestamp ORDER BY ah.timestamp DESC, ah.createdAt DESC")
    List<AccountHistory> findLastHistoryBefore(@Param("timestamp") LocalDateTime timestamp);

    Optional<AccountHistory> findByTransactionId(Long transactionId);

    @Query("SELECT ah FROM AccountHistory ah " +
            "WHERE ah.account.id = :accountId " +
            "AND ah.timestamp BETWEEN :startDate AND :endDate " +
            "ORDER BY ah.timestamp DESC")
    List<AccountHistory> getAccountHistoriesByAccountAndTimestampRange(
            @Param("accountId") Long accountId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ah FROM AccountHistory ah " +
            "WHERE ah.account.user.id = :userId " +
            "AND ah.timestamp BETWEEN :startDate AND :endDate " +
            "ORDER BY ah.timestamp DESC")
    List<AccountHistory> getAccountHistoriesByTimestampRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);



}

