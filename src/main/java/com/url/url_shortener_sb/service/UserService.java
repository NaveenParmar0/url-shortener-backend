package com.url.url_shortener_sb.service;

import com.url.url_shortener_sb.dto.LoginRequest;
import com.url.url_shortener_sb.models.User;
import com.url.url_shortener_sb.repository.UserRepository;
import com.url.url_shortener_sb.security.jwt.JwtAuthenticationResponse;
import com.url.url_shortener_sb.security.jwt.jwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@AllArgsConstructor
@Service
public class UserService {

    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private jwtUtils jwtUtils;

    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
//        userDetailsImpl userDetails = authentication.getPrincipal();
        userDetailsImpl userDetails = (userDetailsImpl) authentication.getPrincipal();
        String jwt =jwtUtils.generateToken(userDetails);

        return new JwtAuthenticationResponse(jwt);
    }

    public User findByUsername(String name) {
        return  userRepository.findByUserName(name).orElseThrow(() -> new UsernameNotFoundException("User not Found with name: "+name));

    }
}
