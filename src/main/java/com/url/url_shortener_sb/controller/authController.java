package com.url.url_shortener_sb.controller;

import com.url.url_shortener_sb.dto.LoginRequest;
import com.url.url_shortener_sb.dto.RegisterRequest;
import com.url.url_shortener_sb.models.User;
import com.url.url_shortener_sb.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class authController {
//    Long Url --> Short Url

    private UserService userService;

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        return  ResponseEntity.ok(userService.authenticateUser(loginRequest));
    }

    @PostMapping("/public/register")
    public ResponseEntity<?>registerUser(@RequestBody RegisterRequest registerRequest){
        User user =  new User();
        user.setUserName(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword((registerRequest.getPassword()));
        user.setRole("ROLE_USER");
        userService.registerUser(user);
        return ResponseEntity.ok("User  Registered Successfully");

    }
}
