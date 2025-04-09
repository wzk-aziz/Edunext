package tn.esprit.merge.services;

import tn.esprit.merge.entities.Session;
import java.util.List;

public interface ISessionService {
    List<Session> getAllSessions();
    Session getSessionById(Long id);
    Session saveSession(Session session);
    void deleteSession(Long id);
}