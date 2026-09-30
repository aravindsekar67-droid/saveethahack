package com.shieldpay.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "scam_patterns")
public class ScamPattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 200)
    private String keyword;

    @Column(nullable = false)
    private Integer weight;

    @Column(nullable = false)
    private Boolean enabled = true;

    public ScamPattern() {}

    public ScamPattern(String category, String keyword, Integer weight, Boolean enabled) {
        this.category = category;
        this.keyword = keyword;
        this.weight = weight;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
