package com.example.forum.service;

import com.example.forum.entity.Reaction;
import com.example.forum.entity.ReactionType;
import com.example.forum.repository.ReactionRepository;
import com.example.forum.repository.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.forum.entity.Thread;

import java.util.List;
import java.util.Optional;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private ThreadRepository threadRepository;


    public List<Reaction> getAllReactions() {
        return reactionRepository.findAll();
    }

    public List<Reaction> getReactionsByThreadId(Long threadId) {
        return reactionRepository.findByThread_Id(threadId);
    }

    public List<Reaction> getReactionsByBlogId(Long blogId) {
        return reactionRepository.findByBlog_Id(blogId);
    }

    public List<Reaction> getReactionsByStudentEmail(String studentEmail) {
        return reactionRepository.findByStudentEmail(studentEmail);
    }

    public Optional<Reaction> getReactionById(Long id) {
        return reactionRepository.findById(id);
    }

    public Reaction createBlogReaction(Long blogId, Reaction reaction) {
        // For now, using the existing methods in your entity
        reaction.setBlogId(blogId);
        return reactionRepository.save(reaction);
    }

    public Reaction createThreadReaction(Long threadId, Reaction reaction) {
        reaction.setThreadId(threadId);
        return reactionRepository.save(reaction);
    }

    public Reaction updateReaction(Long id, Reaction reaction) {
        reaction.setId(id);
        return reactionRepository.save(reaction);
    }

    public void deleteReaction(Long id) {
        reactionRepository.deleteById(id);
    }




    public Long countReactionsByThreadIdAndType(Long threadId, ReactionType type) {
        return reactionRepository.countByThread_IdAndType(threadId, type);
    }

    public boolean hasUserReactedWithType(Long threadId, String email, ReactionType type) {
        return reactionRepository.existsByThread_IdAndStudentEmailAndType(threadId, email, type);
    }

    public Long getUserReactionId(Long threadId, String email, ReactionType type) {
        return reactionRepository.findByThread_IdAndStudentEmailAndType(threadId, email, type)
                .map(Reaction::getId)
                .orElse(null);
    }

    public Reaction createComment(Long threadId, String content, String studentEmail) {
        Reaction comment = new Reaction();
        comment.setThreadId(threadId);
        comment.setStudentEmail(studentEmail);
        comment.setType(ReactionType.COMMENT);
        comment.setContent(content); // IMPORTANT : maintenant que "content" existe
        return reactionRepository.save(comment);
    }
    public Reaction addReaction(Long threadId, String studentEmail, ReactionType type) {
        Optional<Reaction> existingReaction = reactionRepository
                .findByThread_IdAndStudentEmailAndType(threadId, studentEmail, type);

        if (existingReaction.isPresent()) {
            // L’utilisateur a déjà réagi avec ce type => on retourne la réaction existante
            return existingReaction.get();
        }
        // Sinon on crée la réaction
        Reaction reaction = new Reaction();
        reaction.setThreadId(threadId);
        reaction.setStudentEmail(studentEmail);
        reaction.setType(type);

        return reactionRepository.save(reaction);
    }


    // Méthode spécifique pour ajouter un "j'aime"
    public Reaction addLike(Long threadId, String studentEmail) {
        return addReaction(threadId, studentEmail, ReactionType.LIKE);
    }

    // Méthode spécifique pour ajouter un "je n'aime pas"
    public Reaction addDislike(Long threadId, String studentEmail) {
        return addReaction(threadId, studentEmail, ReactionType.DISLIKE);
    }

    // Méthode pour marquer comme utile
    public Reaction markAsHelpful(Long threadId, String studentEmail) {
        return addReaction(threadId, studentEmail, ReactionType.HELPFUL);
    }

    // Méthode pour ajouter aux favoris
    public Reaction addToFavorites(Long threadId, String studentEmail) {
        return addReaction(threadId, studentEmail, ReactionType.FAVORITE);
    }
    public List<Reaction> getCommentsByThreadId(Long threadId) {
        return reactionRepository.findByThread_IdAndType(threadId, ReactionType.COMMENT);
    }



}