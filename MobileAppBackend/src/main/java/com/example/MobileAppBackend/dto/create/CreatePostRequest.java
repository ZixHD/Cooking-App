package com.example.MobileAppBackend.dto.create;

import com.example.MobileAppBackend.dto.model.RatingDto;
import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Data
@ToString
@Slf4j
public class CreatePostRequest {


    private String id;

    @NotBlank(message = "Post must have an author id.")
    private String authorId;

    @NotBlank(message = "Post must have a recipe id.")
    private String recipeId;

    @NotBlank(message="Text cannot be empty.")
    @Size(min = 5, max = 50, message = "Post text must be between 5 and 50 characters long.")
    private String text;

    private List<RatingDto> ratings;
    private int views;
    private LocalDateTime created_at;

}
