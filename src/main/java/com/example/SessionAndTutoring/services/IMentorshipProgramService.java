package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.MentorshipProgram;

import java.util.List;

public interface IMentorshipProgramService {
    List<MentorshipProgram> getAllMentorshipPrograms();
    MentorshipProgram getMentorshipProgramById(Long id);
    MentorshipProgram createMentorshipProgram(MentorshipProgram mentorshipProgram);
    MentorshipProgram updateMentorshipProgram(long id, MentorshipProgram mentorshipProgram);
    void deleteMentorshipProgram(Long id);
}