package com.shieldpay.repository;

import com.shieldpay.entity.Scan;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanRepository extends JpaRepository<Scan, Long> {

    List<Scan> findAllByOrderByCreatedAtDesc();

    List<Scan> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByRiskLevel(String riskLevel);

    long countByScamCategory(String scamCategory);

    @Query("SELECT s.scamCategory, COUNT(s) FROM Scan s GROUP BY s.scamCategory")
    List<Object[]> countScansGroupedByCategory();

    @Query("SELECT s.riskLevel, COUNT(s) FROM Scan s GROUP BY s.riskLevel")
    List<Object[]> countScansGroupedByRiskLevel();

    @Query("SELECT s.paymentMethod, COUNT(s) FROM Scan s GROUP BY s.paymentMethod")
    List<Object[]> countScansGroupedByPaymentMethod();

    @Query("SELECT FUNCTION('DATE', s.createdAt), AVG(s.riskScore), COUNT(s) FROM Scan s GROUP BY FUNCTION('DATE', s.createdAt) ORDER BY FUNCTION('DATE', s.createdAt) ASC")
    List<Object[]> findTrendsOverTime();
}
