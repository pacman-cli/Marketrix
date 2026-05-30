package com.example.marketrix.auth.service;

import com.example.marketrix.auth.dto.AuthResponse;
import com.example.marketrix.auth.dto.LoginRequest;
import com.example.marketrix.auth.dto.RefreshRequest;
import com.example.marketrix.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshRequest request);

    void logout(String refreshToken);
}
