package com.example.MobileAppBackend.service;

import com.example.MobileAppBackend.dto.create.CreatePostRequest;
import com.example.MobileAppBackend.model.Post;
import com.example.MobileAppBackend.model.Rating;
import com.example.MobileAppBackend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;


    public List<Post> getAll(){
        return this.postRepository.findAll();
    }

    public Post getById(String id){
        return this.postRepository.findById(id).get();
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
        optionalPost.ifPresent(postRepository::delete);
    }

}
