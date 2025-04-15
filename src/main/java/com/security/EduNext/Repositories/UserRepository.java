package com.security.EduNext.Repositories;

import com.security.EduNext.Entities.Role;
import com.security.EduNext.Entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);

    List<User> findByBannedTrue();


    // Custom query to find banned users by role
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.banned = true")
    List<User> findBannedUsersByRole(@Param("role") Role role);



    @Transactional
    @Modifying
    @Query("update User u set u.password = ?2 where u.email = ?1")
    void updatePassword(String email, String password);






}