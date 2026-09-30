package com.shieldpay.dto;

import java.util.ArrayList;
import java.util.List;

public class UrlScanRequest {
    private String url;

    public UrlScanRequest() {}

    public UrlScanRequest(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
