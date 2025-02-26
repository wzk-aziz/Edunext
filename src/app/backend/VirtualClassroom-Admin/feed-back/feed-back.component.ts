import { Component, OnInit } from '@angular/core';
import { FeedBackService } from './feed-back.service';
import { Feedback } from './feed-back.model';

@Component({
  selector: 'app-feed-back',
  templateUrl: './feed-back.component.html',
  styleUrls: ['./feed-back.component.css']
})
export class FeedBackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  newFeedback: Feedback = { id_feedback: 0, content_feedback: '', rating: 0, session_id: 0 };
  selectedFeedback: Feedback | null = null;
  showCreateForm = false;
  searchTerm: string = '';

  constructor(private feedbackService: FeedBackService) {}

  ngOnInit(): void {
    this.fetchFeedbacks();
  }

  fetchFeedbacks(): void {
    this.feedbackService.getFeedbacks().subscribe((data: Feedback[]) => {
      this.feedbacks = data;
      this.filteredFeedbacks = data;
    });
  }

  filterFeedbacks(): void {
    this.filteredFeedbacks = this.feedbacks.filter(feedback =>
      feedback.content_feedback.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      feedback.session_id.toString().includes(this.searchTerm)
    );
  }

  createFeedback(): void {
    this.feedbackService.createFeedback(this.newFeedback).subscribe((data: Feedback) => {
      this.feedbacks.push(data);
      this.filteredFeedbacks = this.feedbacks;
      this.newFeedback = { id_feedback: 0, content_feedback: '', rating: 0, session_id: 0 };
      this.showCreateForm = false;
    });
  }

  updateFeedback(): void {
    if (this.selectedFeedback) {
      this.feedbackService.updateFeedback(this.selectedFeedback).subscribe(() => {
        this.fetchFeedbacks();
        this.selectedFeedback = null;
      });
    }
  }

  deleteFeedback(id: number): void {
    this.feedbackService.deleteFeedback(id).subscribe(() => {
      this.feedbacks = this.feedbacks.filter(feedback => feedback.id_feedback !== id);
      this.filteredFeedbacks = this.feedbacks;
    });
  }

  selectFeedback(feedback: Feedback): void {
    this.selectedFeedback = { ...feedback };
  }

  clearSelection(): void {
    this.selectedFeedback = null;
  }
}