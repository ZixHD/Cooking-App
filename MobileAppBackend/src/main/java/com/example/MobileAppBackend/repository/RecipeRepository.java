package com.example.MobileAppBackend.repository;

import com.example.MobileAppBackend.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    Recipe findRecipeById(String id);
}
