package com.shieldpay.repository;

import com.shieldpay.entity.AdminEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminEventRepository extends JpaRepository<AdminEvent, Long> {
    List<AdminEvent> findAllByOrderByCreatedAtDesc();
}
