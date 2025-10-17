package com.finki.budgetwisely.repository;

import com.finki.budgetwisely.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long>  {
}
