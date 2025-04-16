package com.example.EduNext.Auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AuthenticationResponse {

    private String accessToken;
    private String refreshToken;
    private boolean mfaEnabled;
    private String secretImageUri;
    @JsonProperty("role")
    private String role;
    @JsonProperty("first_name")
    private String firstName;

    private int userId;
    @JsonProperty("last_name")
    private String lastName;

    @JsonProperty("email_address")
    private String email;


}
