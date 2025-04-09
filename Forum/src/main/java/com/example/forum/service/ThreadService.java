package com.example.forum.service;

import com.example.forum.entity.Forum;
import com.example.forum.entity.Thread;
import com.example.forum.repository.ForumRepository;
import com.example.forum.repository.ThreadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ThreadService {

    @Autowired
    private ThreadRepository threadRepository;

    @Autowired
    private ForumRepository forumRepository;

    public List<Thread> getAllThreads() {
        return threadRepository.findAll();
    }

    public List<Thread> getThreadsByForumId(Long forumId) {
        return threadRepository.findByForumIdForum(forumId);
    }

    public Optional<Thread> getThreadById(Long id) {
        return threadRepository.findById(id);
    }

    public Thread createThread(Thread thread, Long forumId) {
        Optional<Forum> forumOpt = forumRepository.findById(forumId);
        if (forumOpt.isPresent()) {
            thread.setForum(forumOpt.get());
            return threadRepository.save(thread);
        }
        return null;
    }

    public Thread updateThread(Thread thread) {
        return threadRepository.save(thread);
    }

    public void deleteThread(Long id) {
        threadRepository.deleteById(id);
    }
}