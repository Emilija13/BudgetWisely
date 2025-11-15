package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    @Query("SELECT rt FROM RecurringTransaction rt WHERE rt.isActive = true " +
            "AND rt.startDate <= :today " +
            "AND (rt.endDate IS NULL OR rt.endDate >= :today)")
    List<RecurringTransaction> findAllActiveForProcessing(@Param("today") LocalDate today);

    List<RecurringTransaction> findByAccountUserId(Long userId);

    @Query("SELECT rt FROM RecurringTransaction rt " +
            "JOIN rt.account a " +
            "WHERE a.user.id = :userId")
    List<RecurringTransaction> findAllByUserId(@Param("userId") Long userId);
}
