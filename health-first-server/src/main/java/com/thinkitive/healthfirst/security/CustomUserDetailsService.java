package com.thinkitive.healthfirst.security;

import com.thinkitive.healthfirst.entity.UserEntity;
import com.thinkitive.healthfirst.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        return buildUserDetails(user);
    }

    public UserDetails loadUserByEmailOrPhone(String emailOrPhone) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmailOrPhoneNumber(emailOrPhone, emailOrPhone)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or phone: " + emailOrPhone));

        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(UserEntity user) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(Collections.singletonList(authority))
                .disabled(!user.getIsActive())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .build();
    }
} 