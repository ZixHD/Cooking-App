package com.example.MobileAppBackend.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        Dotenv dotenv = Dotenv.configure().directory("MobileAppBackend").load();
        String uri = String.format(
                "mongodb+srv://%s:%s@%s/%s?retryWrites=true&w=majority",
                dotenv.get("MONGO_USERNAME"),
                dotenv.get("MONGO_PASSWORD"),
                dotenv.get("MONGO_URI"),
                dotenv.get("MONGO_DB")
        );
        return MongoClients.create(uri);
    }
}