package com.example.marketrix.auth;

import com.example.marketrix.auth.dto.AuthResponse;
import com.example.marketrix.auth.dto.LoginRequest;
import com.example.marketrix.auth.dto.RegisterRequest;
import com.example.marketrix.auth.enums.Role;
import com.example.marketrix.intake.dto.BriefSubmitRequest;
import com.example.marketrix.intake.dto.BriefResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndBriefFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void fullFlow_register_login_submitBrief() throws Exception {
        // 1. Register
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail("test-" + System.currentTimeMillis() + "@example.com");
        registerReq.setPassword("password123");
        registerReq.setFullName("Test Founder");
        registerReq.setRole(Role.FOUNDER);

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value(registerReq.getEmail()))
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(
                registerResult.getResponse().getContentAsString(), AuthResponse.class);
        String token = authResponse.getAccessToken();

        // 2. Login
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(registerReq.getEmail());
        loginReq.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty());

        // 3. Submit brief (requires FOUNDER role)
        BriefSubmitRequest briefReq = new BriefSubmitRequest();
        briefReq.setName("Test Startup");
        briefReq.setIndustry("AI");
        briefReq.setStage("Seed");
        briefReq.setGoals(List.of("Find market fit"));

        mockMvc.perform(post("/api/startups/brief")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(briefReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Startup"))
                .andExpect(jsonPath("$.status").value("SUBMITTED"));

        // 4. Get my briefs
        mockMvc.perform(get("/api/startups/my-briefs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Startup"));

        // 5. Unauthenticated access should fail
        mockMvc.perform(post("/api/startups/brief")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(briefReq)))
                .andExpect(status().isUnauthorized().isError());

        // 6. Public report catalog should work without auth
        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk());
    }
}
