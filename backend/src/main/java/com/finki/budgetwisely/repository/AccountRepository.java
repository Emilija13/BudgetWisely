package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findById(Long id);

    List<Account> findAllByUserId(Long user);

//    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.user.id = :userId")
//    Long getTotalBalanceByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(a.balance), 0) FROM Account a WHERE a.user.id = :userId")
    Long getTotalBalanceByUserId(@Param("userId") Long userId);

}
