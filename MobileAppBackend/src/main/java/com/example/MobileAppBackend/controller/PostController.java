package com.example.MobileAppBackend.controller;


import com.example.MobileAppBackend.dto.create.CreatePostRequest;
import com.example.MobileAppBackend.model.Post;
import com.example.MobileAppBackend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(){
        List<Post> posts =  postService.getAll();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id){
        Post post = postService.getById(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@Valid @RequestBody CreatePostRequest createPostRequest){
        System.out.println("Create Post: " + createPostRequest);
        Post post = postService.createPost(createPostRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Post> editPost(@PathVariable String id,  @Valid @RequestBody CreatePostRequest createPostRequest){
        Post updated = postService.editPost(id, createPostRequest);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Post> deletePost(@PathVariable String id){
        this.postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

}
