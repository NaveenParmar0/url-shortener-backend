package com.url.url_shortener_sb.dto;

import lombok.Data;

import java.util.Set;
@Data
public class RegisterRequest {

    private  String username;
    private String email;
    private Set<String> role;
    private  String password;
}
