package com.shieldpay.dto;

import java.util.ArrayList;
import java.util.List;

public class ConversationScanRequest {
    private List<String> messages = new ArrayList<>();
    private String senderType = "Unknown Person";
    private Double amount;
    private String paymentMethod = "UPI";

    public ConversationScanRequest() {}

    public List<String> getMessages() {
        return messages;
    }

    public void setMessages(List<String> messages) {
        this.messages = messages;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
