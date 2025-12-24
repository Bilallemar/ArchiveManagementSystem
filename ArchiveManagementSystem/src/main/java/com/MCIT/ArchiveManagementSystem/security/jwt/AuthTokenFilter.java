package com.MCIT.ArchiveManagementSystem.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.MCIT.ArchiveManagementSystem.security.services.UserDetailsServiceImpl;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        logger.info("========================================");
        logger.info("🔍 Request: {} {}", method, requestURI);
        logger.info("🌐 Origin: {}", request.getHeader("Origin"));
        logger.info("🔑 Authorization Header: {}", request.getHeader("Authorization"));
        
        try {
            String jwt = parseJwt(request);
            
            if (jwt != null) {
                logger.info("✅ JWT Token found: {}...", jwt.substring(0, Math.min(jwt.length(), 20)));
                
                if (jwtUtils.validateJwtToken(jwt)) {
                    logger.info("✅ JWT Token is VALID");
                    
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("👤 Username from JWT: {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    logger.info("👥 User roles: {}", userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    logger.info("✅ Authentication set successfully for user: {}", username);
                } else {
                    logger.error("❌ JWT Token validation FAILED");
                }
            } else {
                logger.warn("⚠️ No JWT Token found in request to {}", requestURI);
            }
        } catch (Exception e) {
            logger.error("❌ Cannot set user authentication: {}", e.getMessage(), e);
        }
        
        logger.info("========================================");
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String jwt = jwtUtils.getJwtFromHeader(request);
        
        if (jwt != null) {
            logger.debug("📋 Parsed JWT: {}...", jwt.substring(0, Math.min(jwt.length(), 30)));
        } else {
            logger.debug("📋 No JWT token to parse");
        }
        
        return jwt;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // Skip filter for public endpoints
        boolean skip = path.startsWith("/api/auth/public/") ||
                      path.startsWith("/uploads/") ||
                      path.startsWith("/api/csrf-token") ||
                      path.equals("/error");
        
        if (skip) {
            logger.info("⏭️ Skipping filter for public endpoint: {}", path);
        }
        
        return skip;
    }
}