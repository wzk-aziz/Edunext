package tn.esprit.merge.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import tn.esprit.merge.entities.Goal;
import tn.esprit.merge.entities.MentorshipProgram;
import tn.esprit.merge.services.IGoalService;
import tn.esprit.merge.services.IMentorshipProgramService;

import java.util.List;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:4200")
public class GoalController {
    @Autowired
    private IGoalService goalService;

    @Autowired
    private IMentorshipProgramService mentorshipProgramService;

    @GetMapping("/all")
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }

    @GetMapping("/{id}")
    public Goal getGoalById(@PathVariable Long id) {
        return goalService.getGoalById(id);
    }

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, "application/json;charset=UTF-8"})
    public Goal createGoal(@RequestBody Goal goal) {
        if (goal.getMentorshipProgramId() != null) {
            MentorshipProgram mentorshipProgram = mentorshipProgramService
                .getMentorshipProgramById(goal.getMentorshipProgramId());
            goal.setMentorshipProgram(mentorshipProgram);
        }
        return goalService.createGoal(goal);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Goal updateGoal(@PathVariable Long id, @RequestBody Goal updatedGoal) {
        Goal existingGoal = goalService.getGoalById(id);
        if (existingGoal == null) {
            return null;
        }

        if (updatedGoal.getMentorshipProgramId() != null) {
            MentorshipProgram mentorshipProgram = mentorshipProgramService
                .getMentorshipProgramById(updatedGoal.getMentorshipProgramId());
            existingGoal.setMentorshipProgram(mentorshipProgram);
        }

        existingGoal.setGoalDescription(updatedGoal.getGoalDescription());
        existingGoal.setGoalTargetDate(updatedGoal.getGoalTargetDate());

        return goalService.updateGoal(id, existingGoal);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
}