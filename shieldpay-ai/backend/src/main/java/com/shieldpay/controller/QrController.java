package com.shieldpay.controller;

import com.shieldpay.dto.QrScanRequest;
import com.shieldpay.dto.QrScanResponse;
import com.shieldpay.service.QrAnalyzerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QrController {

    private final QrAnalyzerService qrAnalyzerService;

    public QrController(QrAnalyzerService qrAnalyzerService) {
        this.qrAnalyzerService = qrAnalyzerService;
    }

    @PostMapping("/scan/qr")
    public ResponseEntity<QrScanResponse> analyzeQr(@RequestBody QrScanRequest request) {
        QrScanResponse response = qrAnalyzerService.analyzeQr(request);
        return ResponseEntity.ok(response);
    }
}
