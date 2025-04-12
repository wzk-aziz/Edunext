package tn.esprit.tutoring.services;

import tn.esprit.tutoring.entities.MentorshipProgram;

import java.util.List;

public interface IMentorshipProgramService {
    List<MentorshipProgram> getAllMentorshipPrograms();
    MentorshipProgram getMentorshipProgramById(Long id);
    MentorshipProgram createMentorshipProgram(MentorshipProgram mentorshipProgram);
    MentorshipProgram updateMentorshipProgram(long id, MentorshipProgram mentorshipProgram);
    void deleteMentorshipProgram(Long id);
}