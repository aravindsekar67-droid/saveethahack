package com.shieldpay.dto;

public class LoginResponse {
    private boolean authenticated;
    private String token;
    private String email;
    private String name;
    private String role;
    private String message;

    public LoginResponse() {}

    public LoginResponse(boolean authenticated, String token, String email, String name, String role, String message) {
        this.authenticated = authenticated;
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.message = message;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
