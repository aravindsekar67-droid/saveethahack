package com.shieldpay.dto;

import java.util.ArrayList;
import java.util.List;

public class AdminTrendsResponse {

    public static class TrendPoint {
        private String date;
        private double avgRiskScore;
        private long scanCount;

        public TrendPoint() {}

        public TrendPoint(String date, double avgRiskScore, long scanCount) {
            this.date = date;
            this.avgRiskScore = avgRiskScore;
            this.scanCount = scanCount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getAvgRiskScore() {
            return avgRiskScore;
        }

        public void setAvgRiskScore(double avgRiskScore) {
            this.avgRiskScore = avgRiskScore;
        }

        public long getScanCount() {
            return scanCount;
        }

        public void setScanCount(long scanCount) {
            this.scanCount = scanCount;
        }
    }

    private List<TrendPoint> trends = new ArrayList<>();

    public AdminTrendsResponse() {}

    public AdminTrendsResponse(List<TrendPoint> trends) {
        this.trends = trends;
    }

    public List<TrendPoint> getTrends() {
        return trends;
    }

    public void setTrends(List<TrendPoint> trends) {
        this.trends = trends;
    }
}
