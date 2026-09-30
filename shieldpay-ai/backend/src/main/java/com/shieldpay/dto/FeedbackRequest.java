package com.shieldpay.dto;

import jakarta.validation.constraints.NotNull;

public class FeedbackRequest {

    @NotNull(message = "Scan ID is required")
    private Long scanId;

    @NotNull(message = "Useful flag is required")
    private Boolean useful;

    private String actualStatus; // YES, NO, NOT_SURE
    private String comments;

    public FeedbackRequest() {}

    public FeedbackRequest(Long scanId, Boolean useful, String actualStatus, String comments) {
        this.scanId = scanId;
        this.useful = useful;
        this.actualStatus = actualStatus;
        this.comments = comments;
    }

    public Long getScanId() {
        return scanId;
    }

    public void setScanId(Long scanId) {
        this.scanId = scanId;
    }

    public Boolean getUseful() {
        return useful;
    }

    public void setUseful(Boolean useful) {
        this.useful = useful;
    }

    public String getActualStatus() {
        return actualStatus;
    }

    public void setActualStatus(String actualStatus) {
        this.actualStatus = actualStatus;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
