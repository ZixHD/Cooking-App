package com.example.MobileAppBackend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "SUPER_SECRET_JWT_KEY_64_CHARS_MINIMUM";

    public String generateToken(String user_id, String username) {
        return Jwts.builder()
                .setSubject(user_id)
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 min
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    public boolean isTokenValid(String token){
        try{
            extractUserId(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    public String extractUserId(String token){
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


}
