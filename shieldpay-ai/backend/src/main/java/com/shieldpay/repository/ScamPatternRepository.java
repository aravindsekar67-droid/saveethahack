package com.shieldpay.repository;

import com.shieldpay.entity.ScamPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScamPatternRepository extends JpaRepository<ScamPattern, Long> {
    List<ScamPattern> findByEnabledTrue();
    List<ScamPattern> findByCategory(String category);
}
