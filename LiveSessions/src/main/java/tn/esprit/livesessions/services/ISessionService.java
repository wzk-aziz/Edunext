package tn.esprit.livesessions.services;

import tn.esprit.livesessions.entities.Session;
import java.util.List;

public interface ISessionService {
    List<Session> getAllSessions();
    Session getSessionById(Long id);
    Session saveSession(Session session);
    void deleteSession(Long id);
}