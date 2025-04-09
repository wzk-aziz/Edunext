package com.example.forum.service;

import com.example.forum.entity.Event;
import com.example.forum.entity.Forum;
import com.example.forum.repository.EventRepository;
import com.example.forum.repository.ForumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ForumRepository forumRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByForumId(Long forumId) {
        return eventRepository.findByForumIdForum(forumId);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event, Long forumId) {
        Optional<Forum> forumOpt = forumRepository.findById(forumId);
        if (forumOpt.isPresent()) {
            event.setForum(forumOpt.get());
            return eventRepository.save(event);
        }
        return null;
    }

    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
