package com.example.MobileAppBackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "posts")
@Slf4j
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private String id;

    private String authorId;
    private String recipeId;
    private List<Rating> ratings;
    private String text;
    private int views = 0;
    private LocalDateTime created_at;
}
