package com.example.forum.controller;

import com.example.forum.entity.Thread;
import com.example.forum.service.ThreadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.example.forum.entity.Thread;
import com.example.forum.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ThreadController {
    @Autowired
    private ThreadService threadService;

    @GetMapping("/threads")
    public ResponseEntity<List<Thread>> getAllThreads() {
        List<Thread> threads = threadService.getAllThreads();
        return new ResponseEntity<>(threads, HttpStatus.OK);
    }

    @GetMapping("/forums/{forumId}/threads")
    public ResponseEntity<List<Thread>> getThreadsByForumId(@PathVariable Long forumId) {
        List<Thread> threads = threadService.getThreadsByForumId(forumId);
        return new ResponseEntity<>(threads, HttpStatus.OK);
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<Thread> getThreadById(@PathVariable Long id) {
        Optional<Thread> thread = threadService.getThreadById(id);
        return thread.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/forums/{forumId}/threads")
    public ResponseEntity<Thread> createThread(@PathVariable Long forumId, @RequestBody Thread thread) {
        Thread createdThread = threadService.createThread(thread, forumId);
        if (createdThread == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(createdThread, HttpStatus.CREATED);
    }

    @PutMapping("/threads/{id}")
    public ResponseEntity<Thread> updateThread(@PathVariable Long id, @RequestBody Thread thread) {
        if (!threadService.getThreadById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        thread.setId(id);
        Thread updatedThread = threadService.updateThread(thread);
        return new ResponseEntity<>(updatedThread, HttpStatus.OK);
    }

    @DeleteMapping("/threads/{id}")
    public ResponseEntity<Void> deleteThread(@PathVariable Long id) {
        if (!threadService.getThreadById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        threadService.deleteThread(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
