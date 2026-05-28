package com.example.marketrix.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter implements Filter {

    private final Map<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private volatile long windowStart = System.currentTimeMillis();
    private static final long WINDOW_MS = 60_000; // 1 minute
    private static final int MAX_REQUESTS = 100;
    private static final int MAX_AI_REQUESTS = 10;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpRes = (HttpServletResponse) response;

        // Reset window
        if (System.currentTimeMillis() - windowStart > WINDOW_MS) {
            requestCounts.clear();
            windowStart = System.currentTimeMillis();
        }

        String clientKey = getClientKey(httpReq);
        AtomicInteger count = requestCounts.computeIfAbsent(clientKey, k -> new AtomicInteger(0));
        int current = count.incrementAndGet();

        int limit = httpReq.getRequestURI().contains("/api/startups/brief") ? MAX_AI_REQUESTS : MAX_REQUESTS;

        if (current > limit) {
            httpRes.setStatus(429);
            httpRes.getWriter().write("{\"success\":false,\"message\":\"Rate limit exceeded\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientKey(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return "token:" + auth.substring(7, Math.min(auth.length(), 20));
        }
        return "ip:" + request.getRemoteAddr();
    }
}
