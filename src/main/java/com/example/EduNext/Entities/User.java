package com.example.EduNext.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@Entity
@Table(name="users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonProperty("first_name") // Pour renommer la propriété dans la réponse JSON
    private String firstname;

    @JsonProperty("last_name") // Pour renommer la propriété dans la réponse JSON
    private String lastname;

    @Column(unique = true, nullable = false)
    @JsonProperty("email_address") // Pour renommer la propriété dans la réponse JSON
    private String email;

    private String password;
    //private String address;
    private boolean mfaEnabled;
    private String secret;

    @Column(name = "image")
    private String Image;

    @JsonIgnore
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Token> tokens;


    private boolean banned = false; // Ajout du champ banned



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public User(Integer id, String firstname, String lastname, String email, String password, boolean mfaEnabled, String secret, String image, Role role, List<Token> tokens, boolean banned) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.mfaEnabled = mfaEnabled;
        this.secret = secret;
        Image = image;
        this.role = role;
        this.tokens = tokens;
        this.banned = banned;
    }


}
