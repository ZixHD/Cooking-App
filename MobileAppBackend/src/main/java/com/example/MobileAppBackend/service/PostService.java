package com.example.MobileAppBackend.service;

import com.example.MobileAppBackend.dto.create.CreatePostRequest;
import com.example.MobileAppBackend.dto.model.PostWithRecipe;
import com.example.MobileAppBackend.model.*;
import com.example.MobileAppBackend.repository.CommentRepository;
import com.example.MobileAppBackend.repository.PostRepository;
import com.example.MobileAppBackend.repository.RecipeRepository;
import com.example.MobileAppBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final ModelMapper modelMapper;


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
