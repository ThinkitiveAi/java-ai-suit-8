package com.thinkitive.healthfirst.middlewares;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thinkitive.healthfirst.dtos.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Value("${rate.limit.enabled:true}")
    private boolean enabled;

    @Value("${rate.limit.requests-per-hour:5}")
    private int requestsPerHour;

    // In-memory store for rate limiting - in a production environment, use Redis or similar
    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!enabled || !shouldLimitRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        RequestCounter counter = requestCounts.computeIfAbsent(clientIp, k -> new RequestCounter());

        if (counter.incrementAndGet() > requestsPerHour) {
            log.warn("Rate limit exceeded for IP: {}", clientIp);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            ApiResponse<?> errorResponse = ApiResponse.error("Rate limit exceeded. Please try again later.");
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldLimitRequest(HttpServletRequest request) {
        // Only limit registration endpoint
        String path = request.getRequestURI();
        return path.contains("/api/v1/provider/register");
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RequestCounter {
        private final AtomicInteger count = new AtomicInteger(0);
        private final long resetTime;

        public RequestCounter() {
            this.resetTime = System.currentTimeMillis() + 3600000; // 1 hour
        }

        public int incrementAndGet() {
            if (System.currentTimeMillis() > resetTime) {
                count.set(0);
                return 1;
            }
            return count.incrementAndGet();
        }
    }
} 