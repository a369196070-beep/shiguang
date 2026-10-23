package com.shiguang.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(String uploadDir, String publicBaseUrl, String allowedOrigins) {
    public String uploadDirOrDefault() {
        return uploadDir == null || uploadDir.isBlank() ? "./uploads" : uploadDir;
    }
}
