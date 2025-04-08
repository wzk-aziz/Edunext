package com.security.EduNext.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "validation")
public class Validation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant creation;
    private Instant expiration;
    private Instant activation;
    private String code;

    @OneToOne(cascade = CascadeType.ALL)
    private User user;

    public void setExpiration(Instant expiration) {
        this.expiration = expiration;
    }

    public void setCreation(Instant instant) {
        this.creation = instant;
    }

    public void setUtilisateur(User user) {
        this.user = user;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // Getter methods
    public Instant getCreation() {
        return creation;
    }

    public Instant getExpiration() {
        return expiration;
    }

    public Instant getActivation() {
        return activation;
    }

    public String getCode() {
        return code;
    }

    public User getUser() {
        return user;
    }

    // Ajoutez d'autres méthodes setter si nécessaire
}