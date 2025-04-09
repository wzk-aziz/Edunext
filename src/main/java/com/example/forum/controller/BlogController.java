package com.example.forum.controller;

import com.example.forum.entity.Blog;
import com.example.forum.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.example.forum.entity.Blog;
import com.example.forum.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "*")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping("/blogs")
    public ResponseEntity<List<Blog>> getAllBlogs() {
        List<Blog> blogs = blogService.getAllBlogs();
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }

    @GetMapping("/forums/{forumId}/blogs")
    public ResponseEntity<List<Blog>> getBlogsByForumId(@PathVariable Long forumId) {
        List<Blog> blogs = blogService.getBlogsByForumId(forumId);
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }

    @GetMapping("/blogs/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        Optional<Blog> blog = blogService.getBlogById(id);
        return blog.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/forums/{forumId}/blogs")
    public ResponseEntity<Blog> createBlog(@PathVariable Long forumId, @RequestBody Blog blog) {
        Blog createdBlog = blogService.createBlog(blog, forumId);
        if (createdBlog == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(createdBlog, HttpStatus.CREATED);
    }

    @PutMapping("/blogs/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody Blog blog) {
        if (!blogService.getBlogById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        blog.setId(id);
        Blog updatedBlog = blogService.updateBlog(blog);
        return new ResponseEntity<>(updatedBlog, HttpStatus.OK);
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        if (!blogService.getBlogById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        blogService.deleteBlog(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
