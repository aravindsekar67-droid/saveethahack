package com.shieldpay.repository;

import com.shieldpay.entity.RiskSignal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskSignalRepository extends JpaRepository<RiskSignal, Long> {

    List<RiskSignal> findByScanId(Long scanId);

    @Query("SELECT r.signalName, COUNT(r) FROM RiskSignal r GROUP BY r.signalName ORDER BY COUNT(r) DESC")
    List<Object[]> countGroupedBySignalName();
}
