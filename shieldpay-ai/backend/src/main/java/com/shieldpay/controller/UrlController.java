package com.shieldpay.controller;

import com.shieldpay.dto.UrlScanRequest;
import com.shieldpay.dto.UrlScanResponse;
import com.shieldpay.service.UrlAnalyzer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlAnalyzer urlAnalyzer;

    public UrlController(UrlAnalyzer urlAnalyzer) {
        this.urlAnalyzer = urlAnalyzer;
    }

    @PostMapping("/scan/url")
    public ResponseEntity<UrlScanResponse> analyzeUrl(@RequestBody UrlScanRequest request) {
        UrlScanResponse response = urlAnalyzer.analyzeUrl(request.getUrl());
        return ResponseEntity.ok(response);
    }
}
