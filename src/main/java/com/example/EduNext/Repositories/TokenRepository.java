package com.example.EduNext.Repositories;

import com.example.EduNext.Entities.Token;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {


    @Query(value = """
      select t from Token t inner join User u\s
      on t.user.id = u.id\s
      where u.id = :id and (t.expired = false or t.revoked = false)\s
      """)
    List<Token> findAllByValidTokensByUser(Integer id);

    Optional<Token> findByToken(String token);

    @Transactional
    void deleteByUserId(Integer userId);
}
