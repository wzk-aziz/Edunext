package tn.esprit.tutoring.controllers;

                        import org.springframework.beans.factory.annotation.Autowired;
                        import org.springframework.web.bind.annotation.*;
                        import tn.esprit.tutoring.entities.MentorshipProgram;
                        import tn.esprit.tutoring.entities.Instructor;
                        import tn.esprit.tutoring.services.IMentorshipProgramService;
                        import tn.esprit.tutoring.repositories.InstructorRepository;

                        import java.util.List;

                        @RestController
                        @RequestMapping("/mentorship-programs")
                        @CrossOrigin(origins = "http://localhost:4200")
                        public class MentorshipProgramController {

                            @Autowired
                            private IMentorshipProgramService mentorshipProgramService;

                            @Autowired
                            private InstructorRepository instructorRepository;

                            @GetMapping("/all")
                            public List<MentorshipProgram> getAllMentorshipPrograms() {
                                return mentorshipProgramService.getAllMentorshipPrograms();
                            }

                            @GetMapping("/{id}")
                            public MentorshipProgram getMentorshipProgramById(@PathVariable Long id) {
                                return mentorshipProgramService.getMentorshipProgramById(id);
                            }

                            @PostMapping(consumes = "application/json")
                            public MentorshipProgram createMentorshipProgram(@RequestBody MentorshipProgram mentorshipProgram) {
                                if (mentorshipProgram.getInstructorId() != null) {
                                    Instructor instructor = instructorRepository.findById(mentorshipProgram.getInstructorId())
                                            .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + mentorshipProgram.getInstructorId()));
                                    mentorshipProgram.setInstructor(instructor);
                                }
                                return mentorshipProgramService.createMentorshipProgram(mentorshipProgram);
                            }

                            @PutMapping(value = "/{id}", consumes = "application/json")
                            public MentorshipProgram updateMentorshipProgram(@PathVariable long id, @RequestBody MentorshipProgram mentorshipProgram) {
                                if (mentorshipProgram.getInstructorId() != null) {
                                    Instructor instructor = instructorRepository.findById(mentorshipProgram.getInstructorId())
                                            .orElseThrow(() -> new RuntimeException("Instructor not found with id: " + mentorshipProgram.getInstructorId()));
                                    mentorshipProgram.setInstructor(instructor);
                                }
                                return mentorshipProgramService.updateMentorshipProgram(id, mentorshipProgram);
                            }

                            @DeleteMapping("/{id}")
                            public void deleteMentorshipProgram(@PathVariable Long id) {
                                mentorshipProgramService.deleteMentorshipProgram(id);
                            }
                        }