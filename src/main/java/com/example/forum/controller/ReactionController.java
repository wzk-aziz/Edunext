package com.example.forum.controller;

import com.example.forum.entity.Reaction;
import com.example.forum.entity.ReactionType;
import com.example.forum.service.ReactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@RestController
@RequestMapping("/api/reaction")
@CrossOrigin(origins = "*")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;
    @GetMapping("/reactions")
    public ResponseEntity<List<Reaction>> getAllReactions() {
        List<Reaction> reactions = reactionService.getAllReactions();
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }

    @GetMapping("/blogs/{blogId}/reactions")
    public ResponseEntity<List<Reaction>> getReactionsByBlogId(@PathVariable Long blogId) {
        List<Reaction> reactions = reactionService.getReactionsByBlogId(blogId);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }

    @GetMapping("/threads/{threadId}/reactions")
    public ResponseEntity<List<Reaction>> getReactionsByThreadId(@PathVariable Long threadId) {
        List<Reaction> reactions = reactionService.getReactionsByThreadId(threadId);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }

    @GetMapping("/reactions/student/{studentEmail}")
    public ResponseEntity<List<Reaction>> getReactionsByStudentEmail(@PathVariable String studentEmail) {
        List<Reaction> reactions = reactionService.getReactionsByStudentEmail(studentEmail);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }

    @GetMapping("/reactions/{id}")
    public ResponseEntity<Reaction> getReactionById(@PathVariable Long id) {
        Optional<Reaction> reaction = reactionService.getReactionById(id);
        return reaction.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Dans ReactionController.java
    @PostMapping("/blogs/{blogId}/reactions")
    public ResponseEntity<Reaction> createBlogReaction(
            @PathVariable("blogId") Long blogId,
            @RequestBody Reaction reaction) {

        Reaction savedReaction = reactionService.createBlogReaction(blogId, reaction);
        return new ResponseEntity<>(savedReaction, HttpStatus.CREATED);
    }


    // Dans ReactionController.java
    @PutMapping("/reactions/{id}")
    public ResponseEntity<Reaction> updateReaction(
            @PathVariable Long id,
            @RequestBody Reaction reaction) {

        Reaction updatedReaction = reactionService.updateReaction(id, reaction);
        return ResponseEntity.ok(updatedReaction);
    }
    @DeleteMapping("/reactions/{id}")
    public ResponseEntity<Void> deleteReaction(@PathVariable Long id) {
        if (!reactionService.getReactionById(id).isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        reactionService.deleteReaction(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/reactions/count/{threadId}/{type}")
    public ResponseEntity<Long> getReactionCountByType(
            @PathVariable Long threadId,
            @PathVariable String type) {
        Long count = reactionService.countReactionsByThreadIdAndType(threadId, ReactionType.valueOf(type));
        return ResponseEntity.ok(count);
    }

    @GetMapping("/reactions/comments/count/{threadId}")
    public ResponseEntity<Long> getCommentCountByThreadId(@PathVariable Long threadId) {
        // Comptez les réactions de type COMMENT pour ce threadId
        Long count = reactionService.countReactionsByThreadIdAndType(threadId, ReactionType.COMMENT);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/threads/{threadId}/reactions/check")
    public ResponseEntity<Boolean> hasUserReactedWithType(
            @PathVariable Long threadId,
            @RequestParam String email,
            @RequestParam String type) {
        boolean hasReacted = reactionService.hasUserReactedWithType(threadId, email, ReactionType.valueOf(type));
        return ResponseEntity.ok(hasReacted);
    }

    @GetMapping("/threads/{threadId}/reactions/user")
    public ResponseEntity<Long> getUserReactionId(
            @PathVariable Long threadId,
            @RequestParam String email,
            @RequestParam String type) {
        Long reactionId = reactionService.getUserReactionId(threadId, email, ReactionType.valueOf(type));
        return ResponseEntity.ok(reactionId);
    }
    @PostMapping("/threads/{threadId}/reactions")
    public ResponseEntity<?> addReaction(
            @PathVariable Long threadId,
            @RequestBody Reaction reactionRequest
    ) {
        try {
            if (reactionRequest.getType() == null) {
                return ResponseEntity.badRequest().body("Reaction type is required.");
            }

            if (reactionRequest.getType() == ReactionType.COMMENT) {
                if (reactionRequest.getContent() == null || reactionRequest.getContent().isEmpty()) {
                    return ResponseEntity.badRequest().body("Comment content is required.");
                }
                Reaction comment = reactionService.createComment(
                        threadId,
                        reactionRequest.getContent(),
                        reactionRequest.getStudentEmail()
                );
                return ResponseEntity.ok(comment);
            } else {
                Reaction reaction = reactionService.addReaction(
                        threadId,
                        reactionRequest.getStudentEmail(),
                        reactionRequest.getType()
                );
                return ResponseEntity.ok(reaction);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid reaction type.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }


}