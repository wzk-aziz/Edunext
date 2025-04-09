package com.example.SessionAndTutoring.services;

import com.example.SessionAndTutoring.entities.MentorshipProgram;
import com.example.SessionAndTutoring.repositories.MentorshipProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class MentorshipProgramServiceImpl implements IMentorshipProgramService {

        @Autowired
        private MentorshipProgramRepository mentorshipProgramRepository;

        @Override
        public List<MentorshipProgram> getAllMentorshipPrograms() {
            return mentorshipProgramRepository.findAll();
        }

        @Override
        public MentorshipProgram getMentorshipProgramById(Long id) {
            return mentorshipProgramRepository.findById(id).orElse(null);
        }

        @Override
        public MentorshipProgram createMentorshipProgram(MentorshipProgram mentorshipProgram) {
            return mentorshipProgramRepository.save(mentorshipProgram);
        }

        @Override
        public MentorshipProgram updateMentorshipProgram(long id, MentorshipProgram mentorshipProgram) {
            if (mentorshipProgramRepository.existsById(id)) {
                mentorshipProgram.setIdMentorshipProgram((long ) id);
                return mentorshipProgramRepository.save(mentorshipProgram);
            }
            return null;
        }

        @Override
        public void deleteMentorshipProgram(Long id) {
            mentorshipProgramRepository.deleteById(id);
        }
    }