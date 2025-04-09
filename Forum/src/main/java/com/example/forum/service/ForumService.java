package com.example.forum.service;

import com.example.forum.entity.Forum;
import com.example.forum.entity.Blog;
import com.example.forum.repository.ForumRepository;
import com.example.forum.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ForumService {
    @Autowired
    private ForumRepository forumRepository;

    public List<Forum> getAllForums() {
        return forumRepository.findAll();
    }

    public Optional<Forum> getForumById(Long id) {
        return forumRepository.findById(id);
    }

    public Forum createForum(Forum forum) {
        return forumRepository.save(forum);
    }

    public Forum updateForum(Forum forum) {
        return forumRepository.save(forum);
    }

    public void deleteForum(Long id) {
        forumRepository.deleteById(id);
    }
}