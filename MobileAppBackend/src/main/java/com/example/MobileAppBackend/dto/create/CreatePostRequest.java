package com.example.MobileAppBackend.dto.create;

import com.example.MobileAppBackend.dto.model.RatingDto;
import com.example.MobileAppBackend.model.Ingredient;
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
    @Size(min = 5, max = 100, message = "Post text must be between 5 and 50 characters long.")
    private String text;

    private String cuisine;
    private List<String> allergies;
    private String difficulty;
    private int prep_time;
    private int calories;
    private List<String> tags;
    private List<Ingredient> ingredients;

    private List<RatingDto> ratings;
    private int views;
    private LocalDateTime created_at;

}
