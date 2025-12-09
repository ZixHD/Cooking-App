package com.example.MobileAppBackend.repository;

import com.example.MobileAppBackend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {

    Post findPostById(String id);
}
