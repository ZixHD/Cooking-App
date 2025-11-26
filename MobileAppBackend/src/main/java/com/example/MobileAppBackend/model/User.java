package com.example.MobileAppBackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="users")
@Slf4j
@ToString
public class User {

    @Id
    private String id;

    private String username;
    private String email;
    private String password;
    private String avatar;
    private List<String> preferred_tags;
    private List<String> preferred_cuisine;
    private List<String> allergies;
    private List<Long> favorites;


}
