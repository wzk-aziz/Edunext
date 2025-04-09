package com.example.forum.service;

import com.example.forum.entity.Blog;
import com.example.forum.entity.Forum;
import com.example.forum.repository.BlogRepository;
import com.example.forum.repository.ForumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlogService {
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private ForumRepository forumRepository;

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public List<Blog> getBlogsByForumId(Long forumId) {
        return blogRepository.findByForumIdForum(forumId);
    }

    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    public Blog createBlog(Blog blog, Long forumId) {
        Optional<Forum> forumOpt = forumRepository.findById(forumId);
        if (forumOpt.isPresent()) {
            blog.setForum(forumOpt.get());
            return blogRepository.save(blog);
        }
        return null;
    }

    public Blog updateBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }
}

