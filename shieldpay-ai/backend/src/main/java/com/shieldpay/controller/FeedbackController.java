package com.shieldpay.controller;

import com.shieldpay.dto.FeedbackRequest;
import com.shieldpay.entity.Feedback;
import com.shieldpay.repository.FeedbackRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, Object>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        Feedback feedback = new Feedback(
                request.getScanId(),
                request.getUseful(),
                request.getActualStatus(),
                request.getComments()
        );
        Feedback saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thank you for helping protect the community. Your anonymized feedback has been recorded.",
                "feedbackId", saved.getId()
        ));
    }
}
