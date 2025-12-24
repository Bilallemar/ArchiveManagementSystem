package com.MCIT.ArchiveManagementSystem.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.MCIT.ArchiveManagementSystem.security.services.UserDetailsImpl;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${spring.app.jwtSecret}")
    private String jwtSecret;

    @Value("${spring.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        logger.debug("📨 Authorization Header: {}", bearerToken != null ? bearerToken.substring(0, Math.min(bearerToken.length(), 30)) + "..." : "null");
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            logger.debug("✂️ Extracted token (first 30 chars): {}...", token.substring(0, Math.min(token.length(), 30)));
            return token;
        }
        
        logger.warn("⚠️ No Bearer token found in Authorization header");
        return null;
    }

    public String generateTokenFromUsername(UserDetailsImpl userDetails) {
        String username = userDetails.getUsername();
        String roles = userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.joining(","));
        
        Long managementId = userDetails.getManagement() != null 
                ? userDetails.getManagement().getManagementId() 
                : null;
        
        logger.info("🔐 Generating JWT for user: {}", username);
        logger.info("👥 Roles: {}", roles);
        logger.info("🏢 Management ID: {}", managementId);
        logger.info("⏰ Expiration: {} ms", jwtExpirationMs);
        
        JwtBuilder builder = Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("is2faEnabled", userDetails.is2faEnabled())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs));
        
        if (managementId != null) {
            builder.claim("managementId", managementId);
        }
        
        String token = builder.signWith(key()).compact();
        logger.info("✅ JWT generated successfully (length: {})", token.length());
        
        return token;
    }

    public String getUserNameFromJwtToken(String token) {
        try {
            String username = Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
            
            logger.debug("👤 Extracted username from JWT: {}", username);
            return username;
        } catch (Exception e) {
            logger.error("❌ Error extracting username from JWT: {}", e.getMessage());
            throw e;
        }
    }

    private Key key() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            logger.debug("🔑 Secret key decoded successfully (length: {} bytes)", keyBytes.length);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            logger.error("❌ Error decoding JWT secret: {}", e.getMessage());
            throw e;
        }
    }

    public boolean validateJwtToken(String authToken) {
        try {
            logger.info("🔍 Validating JWT token...");
            
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(authToken);
            
            logger.info("✅ JWT token is VALID");
            return true;
            
        } catch (MalformedJwtException e) {
            logger.error("❌ Invalid JWT token structure: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("❌ JWT token is EXPIRED: {}", e.getMessage());
            logger.error("   Expiration date: {}", e.getClaims().getExpiration());
        } catch (UnsupportedJwtException e) {
            logger.error("❌ JWT token is UNSUPPORTED: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("❌ JWT claims string is EMPTY: {}", e.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException e) {
            logger.error("❌ JWT signature does NOT MATCH: {}", e.getMessage());
            logger.error("   This usually means the JWT_SECRET is different!");
        } catch (Exception e) {
            logger.error("❌ Unknown JWT validation error: {}", e.getMessage(), e);
        }
        
        return false;
    }
}