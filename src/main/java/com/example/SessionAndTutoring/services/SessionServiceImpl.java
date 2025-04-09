package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.Session;
import com.example.SessionAndTutoring.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionServiceImpl implements ISessionService {
    @Autowired
    private SessionRepository sessionRepository;

    @Override
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @Override
    public Session getSessionById(Long id) {
        return sessionRepository.findById(id).orElse(null);
    }

    @Override
    public Session saveSession(Session session) {
        return sessionRepository.save(session);
    }

    @Override
    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }
}