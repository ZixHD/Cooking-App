package com.example.MobileAppBackend.controller;

import com.example.MobileAppBackend.dto.create.CreateRecipeRequest;
import com.example.MobileAppBackend.dto.model.FilterRequest;
import com.example.MobileAppBackend.model.Recipe;
import com.example.MobileAppBackend.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes(){
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id){
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Recipe>> filterRecipes(@RequestBody FilterRequest filterRequest){
        return ResponseEntity.ok(recipeService.filterRecipes(filterRequest));
    }

    @PostMapping("/create")
    public ResponseEntity<Recipe> createRecipe(@Valid @RequestBody CreateRecipeRequest createRecipeRequest){
        return ResponseEntity.ok(recipeService.createRecipe(createRecipeRequest));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Recipe> editRecipe(@PathVariable String id, @RequestBody CreateRecipeRequest createRecipeRequest){
        return ResponseEntity.ok(recipeService.editRecipe(id, createRecipeRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Recipe> deleteRecipe(@PathVariable String id){
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok().build();
    }
}
