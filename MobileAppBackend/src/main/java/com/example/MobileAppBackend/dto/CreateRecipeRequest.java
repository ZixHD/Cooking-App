package com.example.MobileAppBackend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;


import java.util.List;

@Data
@ToString
@Slf4j
public class CreateRecipeRequest {

    private String id;
    
    @NotBlank(message = "Recipe must have a title.")
    @Size(min = 5, max = 100, message = "Recipe title must be between 5 and 100 characters long.")
    private String title;

    @NotBlank(message = "Recipe must have an author id.")
    private String author_id;

    @NotNull(message = "Recipe must have a list of ingredients.")
    private List<IngredientDto> ingredients;

    @NotNull(message = "Recipe must have a list of steps.")
    private List<StepDto> steps;

    @NotBlank(message = "Description must not be empty.")
    private String description;

    @NotNull(message = "Recipe must have tags defined.")
    private List<String> tags;

    @NotBlank(message = "Recipe must have a define cuisine.")
    private String cuisine;

    @NotNull(message = "Recipe must have a allergies defined.")
    private List<String> allergies;

    @NotBlank(message = "Recipe must have a set difficulty rating.")
    private String difficulty;

    @NotNull(message = "Recipe must have preparation time set.")
    private int prep_time;

    @NotNull(message = "Recipe must have defined calories.")
    private int calories;


}
