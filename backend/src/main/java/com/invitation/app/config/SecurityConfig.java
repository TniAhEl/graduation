package com.invitation.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/invitations").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/invitations").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/invitations/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/invitation/attendees").hasRole("ADMIN")
                        .anyRequest().permitAll())
                .httpBasic(basic -> basic.realmName("Invitation Admin"))
                .build();
    }

    @Bean
    public UserDetailsService adminUserDetailsService(
            @Value("${admin.username:}") String username,
            @Value("${admin.password:}") String password,
            PasswordEncoder passwordEncoder) {
        if (username.isBlank() || password.isBlank()) {
            log.warn("Admin access is locked because ADMIN_USERNAME or ADMIN_PASSWORD is missing.");
            return requestedUsername -> {
                throw new UsernameNotFoundException("Admin credentials are not configured.");
            };
        }

        String encodedPassword = passwordEncoder.encode(password);

        return requestedUsername -> {
            if (!username.equals(requestedUsername)) {
                throw new UsernameNotFoundException("Admin user not found.");
            }
            return User.withUsername(username)
                    .password(encodedPassword)
                    .roles("ADMIN")
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
