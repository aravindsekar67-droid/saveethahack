package com.shieldpay.controller;

import com.shieldpay.dto.ConversationScanRequest;
import com.shieldpay.dto.ConversationScanResponse;
import com.shieldpay.dto.ScanRequest;
import com.shieldpay.dto.ScanResponse;
import com.shieldpay.exception.ResourceNotFoundException;
import com.shieldpay.service.ConversationAnalyzerService;
import com.shieldpay.service.ScamDetectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScanController {

    private final ScamDetectionService scamDetectionService;
    private final ConversationAnalyzerService conversationAnalyzerService;

    public ScanController(ScamDetectionService scamDetectionService, ConversationAnalyzerService conversationAnalyzerService) {
        this.scamDetectionService = scamDetectionService;
        this.conversationAnalyzerService = conversationAnalyzerService;
    }

    @PostMapping("/scan")
    public ResponseEntity<ScanResponse> analyzeScan(@Valid @RequestBody ScanRequest request) {
        ScanResponse response = scamDetectionService.analyzeScan(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/scan/conversation")
    public ResponseEntity<ConversationScanResponse> analyzeConversation(@RequestBody ConversationScanRequest request) {
        ConversationScanResponse response = conversationAnalyzerService.analyzeConversation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/scan/{id}")
    public ResponseEntity<ScanResponse> getScanById(@PathVariable Long id) {
        ScanResponse response = scamDetectionService.getScanById(id);
        if (response == null) {
            throw new ResourceNotFoundException("Scan with ID " + id + " was not found.");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ScanResponse>> getScanHistory() {
        List<ScanResponse> history = scamDetectionService.getScanHistory();
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory() {
        scamDetectionService.clearHistory();
        return ResponseEntity.noContent().build();
    }
}
