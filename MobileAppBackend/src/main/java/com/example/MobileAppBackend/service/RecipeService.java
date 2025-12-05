package com.example.MobileAppBackend.service;

import com.example.MobileAppBackend.dto.create.CreateRecipeRequest;
import com.example.MobileAppBackend.dto.model.FilterRequest;
import com.example.MobileAppBackend.model.*;
import com.example.MobileAppBackend.repository.RecipeRepository;
import com.example.MobileAppBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;


    public List<Recipe> getAllRecipes(){
        return this.recipeRepository.findAll();
    }

    public Recipe getRecipeById(String id){
        return this.recipeRepository.findById(id).orElse(null);
    }

    //TODO: Add filtering with calorie range, date_and_time, cuisine and so on
    public List<Recipe> filterRecipes(FilterRequest filterRequest){

        List<String> tags = filterRequest.getTags();
        if (tags.isEmpty()){
            return this.recipeRepository.findAll();
        }
        return recipeRepository.findAll().stream()
                .filter(recipe -> recipe.getTags().stream().anyMatch(tags::contains))
                .toList();
    }

    public Recipe createRecipe(CreateRecipeRequest createRecipeRequest){
        Recipe recipe = modelMapper.map(createRecipeRequest, Recipe.class);

        List<Ingredient> ingredients = createRecipeRequest.getIngredients().stream()
                .map(ingredientDto -> modelMapper.map(ingredientDto, Ingredient.class))
                .collect(Collectors.toList());
        recipe.setIngredients(ingredients);

        List<Step> steps = createRecipeRequest.getSteps().stream()
                .map(stepDto -> modelMapper.map(stepDto, Step.class))
                .collect(Collectors.toList());
        recipe.setSteps(steps);

        return this.recipeRepository.save(recipe);
    }

    public Recipe editRecipe(String id, CreateRecipeRequest createRecipeRequest){

        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if(!existingRecipe.getAuthor_id().equals(getCurrentUserId())){
            throw new RuntimeException("You are not the author of the recipe.");
        }
        Optional.ofNullable(createRecipeRequest.getTitle()).ifPresent(existingRecipe::setTitle);
        Optional.ofNullable(createRecipeRequest.getAuthor_id()).ifPresent(existingRecipe::setAuthor_id);

        if (createRecipeRequest.getIngredients() != null) {
            List<Ingredient> mappedIngredients = createRecipeRequest.getIngredients().stream()
                    .map(dto -> {
                        Ingredient ingredient = new Ingredient();
                        ingredient.setName(dto.getName());
                        ingredient.setQuantity(dto.getQuantity());
                        return ingredient;
                    })
                    .collect(Collectors.toList());
            existingRecipe.setIngredients(mappedIngredients);
        }

        if (createRecipeRequest.getSteps() != null) {
            List<Step> mappedSteps = createRecipeRequest.getSteps().stream()
                    .map(dto -> {
                        Step step = new Step();
                        step.setStepNumber(dto.getStepNumber());
                        step.setInstruction(dto.getInstruction());
                        step.setMedia(dto.getMedia());
                        return step;
                    })
                    .collect(Collectors.toList());
            existingRecipe.setSteps(mappedSteps);
        }

        Optional.ofNullable(createRecipeRequest.getDescription()).ifPresent(existingRecipe::setDescription);
        Optional.ofNullable(createRecipeRequest.getTags()).ifPresent(existingRecipe::setTags);
        Optional.ofNullable(createRecipeRequest.getCuisine()).ifPresent(existingRecipe::setCuisine);
        Optional.ofNullable(createRecipeRequest.getAllergies()).ifPresent(existingRecipe::setAllergies);
        Optional.ofNullable(createRecipeRequest.getDifficulty()).ifPresent(existingRecipe::setDifficulty);
        Optional.ofNullable(createRecipeRequest.getPrep_time()).ifPresent(existingRecipe::setPrep_time);
        Optional.ofNullable(createRecipeRequest.getCalories()).ifPresent(existingRecipe::setCalories);

        return this.recipeRepository.save(existingRecipe);

    }

    public void deleteRecipe(String id){



        Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
        Recipe recipe = optionalRecipe.get();
        if(!recipe.getAuthor_id().equals(getCurrentUserId())){
            throw new RuntimeException("You are not the author of the recipe.");
        }
        optionalRecipe.ifPresent(recipeRepository::delete);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getId();
    }

}
