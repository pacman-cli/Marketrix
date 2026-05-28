package com.example.marketrix.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class AiServiceHealthIndicator implements HealthIndicator {

    @Value("${ai.anthropic.api-key:}")
    private String anthropicKey;

    @Value("${ai.openai.api-key:}")
    private String openaiKey;

    @Override
    public Health health() {
        boolean anthropicConfigured = anthropicKey != null && !anthropicKey.isBlank();
        boolean openaiConfigured = openaiKey != null && !openaiKey.isBlank();

        if (anthropicConfigured && openaiConfigured) {
            return Health.up()
                    .withDetail("anthropic", "configured")
                    .withDetail("openai", "configured")
                    .build();
        }

        return Health.down()
                .withDetail("anthropic", anthropicConfigured ? "configured" : "missing")
                .withDetail("openai", openaiConfigured ? "configured" : "missing")
                .build();
    }
}
