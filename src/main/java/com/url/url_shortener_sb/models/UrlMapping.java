package com.url.url_shortener_sb.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Getter
@Setter

public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private String originalUrl;
    private String shortUrl;
    private  int ClickCount =0;
     private LocalDateTime createdDate;

     @ManyToOne
     @JoinColumn(name ="user_id")
    private User user;

     @OneToMany(mappedBy = "urlMapping")
     private List<ClickEvent> clickEvents;

}
