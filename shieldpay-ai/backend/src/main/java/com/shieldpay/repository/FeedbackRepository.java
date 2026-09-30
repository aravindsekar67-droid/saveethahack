package com.shieldpay.repository;

import com.shieldpay.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByScanId(Long scanId);

    long countByUsefulTrue();

    long countByUsefulFalse();

    @Query("SELECT f.actualStatus, COUNT(f) FROM Feedback f GROUP BY f.actualStatus")
    List<Object[]> countGroupedByActualStatus();
}
