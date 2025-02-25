package com.security.EduNext.Repositories;

import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);

}