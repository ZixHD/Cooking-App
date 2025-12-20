package com.example.MobileAppBackend.service;

import com.example.MobileAppBackend.dto.create.CreatePostRequest;
import com.example.MobileAppBackend.dto.model.FilterRequest;
import com.example.MobileAppBackend.dto.model.PostWithRecipe;
import com.example.MobileAppBackend.model.*;
import com.example.MobileAppBackend.repository.CommentRepository;
import com.example.MobileAppBackend.repository.PostRepository;
import com.example.MobileAppBackend.repository.RecipeRepository;
import com.example.MobileAppBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ModelMapper modelMapper;
    private final MongoTemplate mongoTemplate;


    public List<Post> getAll(){
        return this.postRepository.findAll();
    }

    public PostWithRecipe getById(String id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Recipe recipe = recipeRepository.findById(post.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        List<Comment> comments = commentRepository.findCommentsByPostId(id);
        if (comments == null || comments.isEmpty()) {
            throw new RuntimeException("No comments found for this post.");
        }
        return new PostWithRecipe(post, recipe, comments);

    }

    public List<Post> filterRecipes(FilterRequest filterRequest){

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (filterRequest.getTags() != null && !filterRequest.getTags().isEmpty()) {
            for (String tag : filterRequest.getTags()) {
                criteriaList.add(Criteria.where("tags").is(tag));
            }
        }
        if(filterRequest.getAllergies() != null && !filterRequest.getAllergies().isEmpty()){
            criteriaList.add(Criteria.where("allergies").nin(filterRequest.getAllergies()));
        }
        if(filterRequest.getDifficulty() != null && !filterRequest.getDifficulty().isEmpty()){
            criteriaList.add(Criteria.where("difficulty").in(filterRequest.getDifficulty()));
        }

        if(filterRequest.getCuisine() != null && !filterRequest.getCuisine().isEmpty()){
            criteriaList.add(Criteria.where("cuisine").in(filterRequest.getCuisine()));
        }

        if(filterRequest.getMinCalories() != null || filterRequest.getMaxCalories() != null){
            Criteria calories = Criteria.where("calories");
            if(filterRequest.getMinCalories() != null){
                calories = calories.gte(filterRequest.getMinCalories());
            }
            if(filterRequest.getMaxCalories() != null){
                calories = calories.lte(filterRequest.getMaxCalories());
            }
            criteriaList.add(calories);
        }

        if(filterRequest.getMinPrepTime() != null || filterRequest.getMaxPrepTime() != null){
            Criteria prep = Criteria.where("prep_time");
            if(filterRequest.getMinPrepTime() != null){
                prep = prep.gte(filterRequest.getMinPrepTime());
            }
            if(filterRequest.getMaxPrepTime() != null){
                prep = prep.lte(filterRequest.getMaxPrepTime());
            }
            criteriaList.add(prep);
        }

        if(!criteriaList.isEmpty()){
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // Sorting
//        if(filterRequest.isSortByNewest()){
//            query.with(Sort.by(Sort.Direction.DESC, "created_at"));
//        }else if(filterRequest.isSortByOldest()){
//            query.with(Sort.by(Sort.Direction.ASC, "created_at"));
//        }else if(filterRequest.isSortByPopularity()){
//            query.with(Sort.by(Sort.Direction.ASC, "views"));
//        }else if(filterRequest.isSortByPrepTime()){
//            query.with(Sort.by(Sort.Direction.ASC, "prep_time"));
//        }

        return mongoTemplate.find(query, Post.class);

    }

    public void toggleFavorite(String id){
        User user  = userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (user.getFavorites().contains(id)) {
            user.getFavorites().remove(id);
        } else {
            user.getFavorites().add(id);
        }

        userRepository.save(user);
    }

    public Post createPost(CreatePostRequest createPostRequest){

        createPostRequest.setCreated_at(LocalDateTime.now());
        Post post = modelMapper.map(createPostRequest, Post.class);

        // New part
        Recipe recipe = recipeRepository.findRecipeById(createPostRequest.getRecipeId());
        post.setAllergies(recipe.getAllergies());
        post.setCalories(recipe.getCalories());
        post.setDifficulty(recipe.getDifficulty());
        post.setIngredients(recipe.getIngredients());
        post.setTags(recipe.getTags());
        post.setPrep_time(recipe.getPrep_time());

        List<Rating> ratings = createPostRequest.getRatings().stream()
                .map(ratingDto -> modelMapper.map(ratingDto, Rating.class))
                .collect(Collectors.toList());
        post.setRatings(ratings);
        return this.postRepository.save(post);
    }

    public Post editPost(String id, CreatePostRequest createPostRequest) {
        Post existingPost = this.postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if(!existingPost.getAuthorId().equals(getCurrentUserId())) {
            throw new RuntimeException("You are not allowed to edit this post");
        }

        Optional.ofNullable(createPostRequest.getAuthorId()).ifPresent(existingPost::setAuthorId);
        Optional.ofNullable(createPostRequest.getRecipeId()).ifPresent(existingPost::setRecipeId);
        if (createPostRequest.getRatings() != null) {
            List<Rating> mappedRatings = createPostRequest.getRatings().stream()
                    .map(dto -> {
                        Rating rating = new Rating();
                        rating.setUserId(dto.getUserId());
                        rating.setScore(dto.getScore());
                        return rating;
                    })
                    .collect(Collectors.toList());
            existingPost.setRatings(mappedRatings);
        }
        Optional.ofNullable(createPostRequest.getText()).ifPresent(existingPost::setText);
        Optional.ofNullable(createPostRequest.getViews()).ifPresent(existingPost::setViews);
        Optional.ofNullable(createPostRequest.getCreated_at()).ifPresent(existingPost::setCreated_at);

        return postRepository.save(existingPost);
    }

    public void deletePost(String id){
        Optional<Post> optionalPost = this.postRepository.findById(id);
        Post post = optionalPost.get();
        if(!post.getAuthorId().equals(getCurrentUserId())) {
            throw new RuntimeException("You are not allowed to remove this post");
        }
        optionalPost.ifPresent(postRepository::delete);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return currentUser.getId();
    }

}
