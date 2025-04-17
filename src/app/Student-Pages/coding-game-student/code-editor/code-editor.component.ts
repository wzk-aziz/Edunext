import { Component, Input, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Submission } from '../models/submission.model';// Adjust the path as needed
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Problem } from 'src/app/backend/coding-game-admin/models/problem.model';
import { GitService } from './git.service';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from 'src/app/backend/coding-game-admin/problems/problem.service';
import {AuthenticationService} from "../../../Shared/services/authentication.service";
import {SubmissionService} from "../services/submission.service";

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  @Input() problem!: Problem;
  @ViewChild('codeEditor') codeEditorElement!: ElementRef;
  
  languages = [
    { id: 54, name: 'C++ (GCC 9.2.0)' },
    { id: 50, name: 'C (GCC 9.2.0)' },
    { id: 71, name: 'Python (3.8.1)' },
    { id: 62, name: 'Java (OpenJDK 13.0.1)' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)' }
  ];

  // GitHub configuration
// Instead of this:
githubToken: string = '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';

// Do this:
githubOwner: string = 'Amalesprit01';
  repoName: string = 'myCplusplusProject';
  filePath: string = 'src/code/solution.cpp';
  commitMsg: string = 'Code update from Angular editor';

  // Code editor properties
  selectedLanguage: number = 54;
  sourceCode: string = `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`;
  inputData: string = '';
  output: string = 'Ready to run your code...';
  
  // Status flags
  isCodeExecutedSuccessfully: boolean = false;
  isRunning: boolean = false;
  isPushing: boolean = false;
  
  // Enhanced anti-cheating flags
  attemptedToLeave: number = 0;
  attemptedToPaste: number = 0;
  suspiciousActivity: boolean = false;
  lastFocusTime: number = Date.now();
  inactiveTime: number = 0;
  keyPressPatterns: number[] = [];
  codeSnapshots: string[] = [];
  
  // URLs Judge0
  private apiUrl = 'https://judge0-ce.p.rapidapi.com/submissions';
  private headers = new HttpHeaders({
    'content-type': 'application/json',
    'X-RapidAPI-Key': '6a711ecbb6msh68b0e418f026859p197313jsnf5b9ce9e42ba',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  });

  constructor(
    private http: HttpClient,
    private gitService: GitService,
    private route: ActivatedRoute,
    private el: ElementRef,
    private problemService: ProblemService, 
    private authService: AuthenticationService,
    private submissionService: SubmissionService
  ) {}
  userId: number = 0;
// Add these properties to your CodeEditorComponent class
timerRunning: boolean = false;
startTime: number = 0;
elapsedTime: string = '00:00:00';
timerInterval: any;
timerProgressOffset: number = 125.6; // Full circle circumference (2πr) where r=20
timerWarningThreshold: number = 15 * 60 * 1000; // 15 minutes in ms
timerDangerThreshold: number = 30 * 60 * 1000; // 30 minutes in ms
timerMaxTime: number = 60 * 60 * 1000; // 60 minutes in ms for progress calculation

// Add this method to start the timer
startTimer(): void {
  if (!this.timerRunning) {
    this.timerRunning = true;
    this.startTime = Date.now() - (this.parseTimeToMs(this.elapsedTime) || 0);
    
    this.timerInterval = setInterval(() => {
      const elapsedMs = Date.now() - this.startTime;
      this.elapsedTime = this.formatTime(elapsedMs);
      this.updateTimerProgress(elapsedMs);
    }, 1000);
  }
}

// Add this method to stop the timer
stopTimer(): void {
  if (this.timerRunning) {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
  }
}

// Add this method to reset the timer
resetTimer(): void {
  this.stopTimer();
  this.elapsedTime = '00:00:00';
  this.timerProgressOffset = 125.6; // Reset to full circle
}

// Format milliseconds to MM:SS for display in the circular timer
formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // For the circular timer, we'll show only minutes:seconds if under an hour
  if (hours > 0) {
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  } else {
    return [
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }
}

// Parse time string (HH:MM:SS) to milliseconds
parseTimeToMs(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    // Format is HH:MM:SS
    return ((parts[0] * 60 + parts[1]) * 60 + parts[2]) * 1000;
  } else if (parts.length === 2) {
    // Format is MM:SS
    return (parts[0] * 60 + parts[1]) * 1000;
  }
  return 0;
}

// Update the timer progress circle
updateTimerProgress(elapsedMs: number): void {
  // Calculate percentage of max time
  const percentage = Math.min(elapsedMs / this.timerMaxTime, 1);
  // Calculate the stroke-dashoffset (full circle = 125.6)
  this.timerProgressOffset = 125.6 * (1 - percentage);
  
  // Apply class based on elapsed time
  const timerElement = document.querySelector('.circular-timer');
  if (timerElement) {
    timerElement.classList.remove('timer-warning', 'timer-danger');
    
    if (elapsedMs >= this.timerDangerThreshold) {
      timerElement.classList.add('timer-danger');
    } else if (elapsedMs >= this.timerWarningThreshold) {
      timerElement.classList.add('timer-warning');
    }
    
    if (this.timerRunning) {
      timerElement.classList.add('timer-running');
    } else {
      timerElement.classList.remove('timer-running');
    }
  }
}

  ngOnInit(): void {
    // Charger le problème depuis l'URL
    const problemId = +this.route.snapshot.paramMap.get('id')!;
    this.problemService.getProblemById(problemId).subscribe({
      next: (data) => {
        this.problem = data;
        console.log("✅ Problème chargé :", this.problem);
        this.startTimer();

      },
      error: (err) => {
        console.error('❌ Problème non trouvé', err);
      }
    });
  
    // 🔐 Récupérer l’ID de l’utilisateur connecté
    this.userId = this.authService.getUserId() ?? 0;
    console.log("User ID:", this.userId);
  
    this.setupAntiCheatingListeners();
    this.startCodeMonitoring();
  }

  submitCode(): void {
     // Stop the timer when submitting
    this.stopTimer();
    // Vérifier si le code est prêt à être soumis
    if (!this.sourceCode || this.isRunning) {
      this.output = '⚠️ Veuillez exécuter votre code avant de le soumettre';
      return;
    }
  
    // Récupérer l'ID de l'utilisateur depuis localStorage
    const userId = this.authService.getUserId();
    console.log(userId);
    if (!userId) {
      this.output = '❌ Utilisateur non identifié. Veuillez vous reconnecter.';
      return;
    }
  
    // Récupérer l'ID du problème actuel
    const problemId = this.problem?.id;
    if (!problemId) {
      this.output = '❌ Problème non identifié.';
      return;
    }
  
    // Préparer l'objet de soumission
    const submission: Submission = {
      code: this.sourceCode,
      language: {
        id: this.selectedLanguage
      },
      output: this.output,
      problem: {
        id: problemId
      },
      student: {
        id: userId
      },
      gitLink: this.gitLink || this.githubOwner + '/' + this.repoName,
      elapsedTime: this.elapsedTime

    };
  
    // Envoyer la soumission au backend
    this.submissionService.submit(submission).subscribe({
      next: (response) => {
        console.log('✅ Soumission réussie:', response);
        this.output = `✅ Soumission réussie! Score: ${response.score}/100`;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la soumission:', err);
        this.output = '❌ Erreur lors de la soumission. Veuillez réessayer.';
        this.startTimer();

      }
    });
  }
  

  // Enhanced anti-cheating detection system
  private setupAntiCheatingListeners(): void {
    // Add paste event listener to code editor
    setTimeout(() => {
      const editorElement = this.el.nativeElement.querySelector('.judge0-editor');
      if (editorElement) {
        editorElement.addEventListener('paste', (e: ClipboardEvent) => this.handlePasteEvent(e));
        editorElement.addEventListener('keydown', (e: KeyboardEvent) => this.trackKeyPressPatterns(e));
        editorElement.addEventListener('cut', (e: ClipboardEvent) => this.handleCutEvent(e));
        editorElement.addEventListener('copy', (e: ClipboardEvent) => this.handleCopyEvent(e));
      }
    }, 500);
    
    // Track window focus and blur events
    window.addEventListener('focus', () => this.handleWindowFocus());
  }
  
  // Start code monitoring for suspicious patterns
  private startCodeMonitoring(): void {
    // Take periodic snapshots of the code to detect sudden changes
    setInterval(() => {
      this.takeCodeSnapshot();
    }, 10000); // Every 10 seconds
    
    // Check for inactive time
    setInterval(() => {
      const currentTime = Date.now();
      this.inactiveTime = currentTime - this.lastFocusTime;
      
      // If inactive for more than 2 minutes, consider it suspicious
      if (this.inactiveTime > 120000) { // 2 minutes
        this.attemptedToLeave++;
        this.lastFocusTime = currentTime;
        this.showCheatingAlert(`⚠️ Warning: Detected ${Math.floor(this.inactiveTime/60000)} minutes of inactivity`);
      }
    }, 30000); // Check every 30 seconds
  }
  
  // Take a snapshot of the current code
  private takeCodeSnapshot(): void {
    this.codeSnapshots.push(this.sourceCode);
    
    // Keep only the last 10 snapshots
    if (this.codeSnapshots.length > 10) {
      this.codeSnapshots.shift();
    }
    
    // Compare with previous snapshot to detect sudden large changes
    if (this.codeSnapshots.length >= 2) {
      const currentSnapshot = this.codeSnapshots[this.codeSnapshots.length - 1];
      const prevSnapshot = this.codeSnapshots[this.codeSnapshots.length - 2];
      
      // Calculate difference size
      const diffSize = Math.abs(currentSnapshot.length - prevSnapshot.length);
      
      // If suddenly a large amount of code appears (more than 100 chars at once)
      if (diffSize > 100 && currentSnapshot.length > prevSnapshot.length) {
        this.showCheatingAlert('⚠️ Warning: Detected sudden code change');
        this.attemptedToPaste++;
        
        if (this.attemptedToPaste >= 2) {
          this.suspiciousActivity = true;
          this.logSuspiciousActivity('Sudden code changes detected');
        }
      }
    }
  }
  
  // Track key press patterns to detect unusual typing behavior
  private trackKeyPressPatterns(event: KeyboardEvent): void {
    this.lastFocusTime = Date.now();
    this.keyPressPatterns.push(Date.now());
    
    // Keep only the last 50 key presses
    if (this.keyPressPatterns.length > 50) {
      this.keyPressPatterns.shift();
    }
    
    // If more than 20 keys, analyze the pattern
    if (this.keyPressPatterns.length >= 20) {
      const isNatural = this.isNaturalTypingPattern();
      
      if (!isNatural) {
        this.showCheatingAlert('⚠️ Warning: Unusual typing pattern detected');
        this.suspiciousActivity = true;
        this.logSuspiciousActivity('Unnatural typing pattern');
      }
    }
  }
  
  // Analyze if the typing pattern looks natural
  private isNaturalTypingPattern(): boolean {
    // Calculate time differences between key presses
    const timeDiffs = [];
    for (let i = 1; i < this.keyPressPatterns.length; i++) {
      timeDiffs.push(this.keyPressPatterns[i] - this.keyPressPatterns[i-1]);
    }
    
    // Check for too uniform typing (bot-like)
    const sum = timeDiffs.reduce((a, b) => a + b, 0);
    const avg = sum / timeDiffs.length;
    const variance = timeDiffs.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / timeDiffs.length;
    
    // Human typing has natural variance, bot typing is too uniform
    return variance > 10000; // Adjust threshold as needed
  }

  // Window blur event handler (detects when user switches tabs or windows)
  @HostListener('window:blur', ['$event'])
  onWindowBlur(event: FocusEvent): void {
    this.attemptedToLeave++;
    this.showCheatingAlert(`⚠️ Warning: Navigating away from the editor (${this.attemptedToLeave} times)`);
    
    if (this.attemptedToLeave >= 3) {
      this.suspiciousActivity = true;
      this.logSuspiciousActivity('Multiple attempts to leave the editor');
    }
  }
  
  // Window focus handler
  handleWindowFocus(): void {
    this.lastFocusTime = Date.now();
  }

  // Paste event handler
  handlePasteEvent(event: ClipboardEvent): void {
    // Get pasted content
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    
    const pastedText = clipboardData.getData('text');
    
    // Check for suspicious patterns in the pasted code
    if (this.containsSuspiciousCode(pastedText)) {
      event.preventDefault(); // Prevent the paste
      this.attemptedToPaste++;
      this.showCheatingAlert(`⚠️ Warning: Suspicious code paste detected (${this.attemptedToPaste} times)`);
      
      if (this.attemptedToPaste >= 2) {
        this.suspiciousActivity = true;
        this.logSuspiciousActivity('Multiple attempts to paste suspicious code');
      }
      
      // Take a snapshot after paste attempt
      this.takeCodeSnapshot();
    }
  }
  
  // Cut event handler
  handleCutEvent(event: ClipboardEvent): void {
    // Take a snapshot after cut
    setTimeout(() => this.takeCodeSnapshot(), 100);
  }
  
  // Copy event handler
  handleCopyEvent(event: ClipboardEvent): void {
    // No immediate action needed, but could be used for tracking
  }

  // Check if the pasted code contains suspicious patterns
  private containsSuspiciousCode(text: string): boolean {
    // Check for HTML/Angular component patterns
    const htmlPatterns = [
      '<div class=',
      '<button',
      'ngModel',
      '[(ngModel)]',
      '*ngFor',
      '[disabled]',
      '</div>',
      'class="judge0'
    ];
    
    // Check for API keys and tokens
    const sensitivePatterns = [
      'api-key',
      'apikey',
      'token',
      'password',
      'credentials',
      'ghp_',
      'sk-'
    ];
    
    // Check for solution patterns (common competitive programming solutions)
    const solutionPatterns = [
      '// Solution to problem',
      '// Answer: ',
      'public static void main',
      'class Solution',
      'def solution(',
      'solved by'
    ];
    
    // Check for large code blocks that might be solutions
    const isTooLarge = text.length > 500; // Adjust threshold as needed
    
    // Check for specific patterns
    const containsHtmlPattern = htmlPatterns.some(pattern => text.includes(pattern));
    const containsSensitivePattern = sensitivePatterns.some(pattern => text.toLowerCase().includes(pattern));
    const containsSolutionPattern = solutionPatterns.some(pattern => text.includes(pattern));
    
    return containsHtmlPattern || containsSensitivePattern || containsSolutionPattern || isTooLarge;
  }

  // Show professional alert for cheating
  private showCheatingAlert(message: string): void {
    // Store original output to restore later
    const originalOutput = this.output;
    
    // Show alert in the output panel
    this.output = message;
    
    // Create and show modal alert
    const alertElement = document.createElement('div');
    alertElement.className = 'anti-cheat-alert';
    alertElement.style.position = 'fixed';
    alertElement.style.top = '50%';
    alertElement.style.left = '50%';
    alertElement.style.transform = 'translate(-50%, -50%)';
    alertElement.style.zIndex = '9999';
    alertElement.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    alertElement.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    alertElement.style.borderRadius = '8px';
    alertElement.style.padding = '0';
    alertElement.style.width = '400px';
    alertElement.style.maxWidth = '90vw';
    alertElement.style.fontFamily = 'Arial, sans-serif';
    
    alertElement.innerHTML = `
      <div style="padding: 20px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="background-color: #FFEBEE; color: #D32F2F; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 15px;">
            <span style="font-size: 24px;">⚠️</span>
          </div>
          <h3 style="margin: 0; color: #D32F2F; font-size: 18px;">Anti-Cheating System Alert</h3>
        </div>
        <p style="margin: 0 0 20px 0; color: #333; font-size: 14px; line-height: 1.5;">${message}</p>
        <div style="border-top: 1px solid #EEEEEE; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #757575;">This activity will be logged</span>
          <button id="dismissAlert" style="background-color: #D32F2F; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">Acknowledge</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertElement);
    
    // Add listener to dismiss button
    document.getElementById('dismissAlert')?.addEventListener('click', () => {
      document.body.removeChild(alertElement);
      
      // Restore original output after a brief delay
      setTimeout(() => {
        if (this.output === message) {
          this.output = originalOutput;
        }
      }, 1000);
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (document.body.contains(alertElement)) {
        document.body.removeChild(alertElement);
      }
      
      // Restore original output
      if (this.output === message) {
        this.output = originalOutput;
      }
    }, 8000);
    
    // Play alert sound
    this.playAlertSound();
  }
  
  // Play alert sound
  private playAlertSound(): void {
    try {
      const audio = new Audio('assets/alert.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Unable to play alert sound');
    }
  }

  // Log suspicious activity for later review
  private logSuspiciousActivity(reason: string): void {
    console.warn('Suspicious activity detected:', reason);
    
    // You could implement an API call to log this on the server
    const logData = {
      userId: 'current-user-id', // Get from auth service
      problemId: this.problem?.id,
      timestamp: new Date().toISOString(),
      reason: reason,
      attemptedToLeave: this.attemptedToLeave,
      attemptedToPaste: this.attemptedToPaste,
      codeSnapshot: this.sourceCode.substring(0, 200) + '...' // First 200 chars
    };
    
    // Store in localStorage in case server logging fails
    const logs = JSON.parse(localStorage.getItem('suspicious-activity-logs') || '[]');
    logs.push(logData);
    localStorage.setItem('suspicious-activity-logs', JSON.stringify(logs));
    
    // Implement server logging
    this.http.post('/api/activity-log/suspicious', logData).subscribe({
      next: () => console.log('Suspicious activity logged'),
      error: (err) => console.error('Failed to log suspicious activity', err)
    });
    
    // If highly suspicious, take screenshot of the page
    if (this.attemptedToLeave > 3 || this.attemptedToPaste > 2) {
      this.captureScreenshot();
    }
  }
  
  // Capture screenshot for evidence
  private captureScreenshot(): void {
    // This would require a browser extension or server-side integration
    // Here we'll just log that we would take a screenshot
    console.log('Screenshot would be captured here if implemented');
    
    // In a real implementation, you might use a library or service API call
  }

  // Auto-resize textarea based on content
  autoResize(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  pushToGit(): void {
    if (!this.isCodeExecutedSuccessfully) return;

    this.isPushing = true;
    this.output = '⏳ Pushing to GitHub...';

    this.gitService.getFileSha(
      this.githubOwner,
      this.repoName,
      this.filePath
    ).subscribe({
      next: (sha) => {
        this.gitService.pushFileToGithub(
          this.githubOwner,
          this.repoName,
          this.filePath,
          this.sourceCode,
          this.commitMsg,
          undefined,
          sha ?? undefined
        ).subscribe({
          next: (pushResponse) => {
            this.output = '✅ Successfully pushed to GitHub!';
            this.isPushing = false;
          },
          error: (pushError) => {
            this.output = '❌ GitHub push failed.';
            this.isPushing = false;
          }
        });
      },
      error: (err) => {
        this.output = '❌ GitHub operation failed.';
        this.isPushing = false;
      }
    });
  }

runCode(): void {
  this.isRunning = true;
  this.isCodeExecutedSuccessfully = false;
  this.output = '⏳ Compiling...';

  const payload = {
    source_code: this.sourceCode,
    language_id: this.selectedLanguage,
    stdin: this.inputData
  };

  // Add detailed logging
  console.log('Sending code to Judge0 API with payload:', payload);

  this.http.post<any>(`${this.apiUrl}?base64_encoded=false&wait=false`, payload, { headers: this.headers })
    .subscribe({
      next: (response) => {
        console.log('Judge0 API response:', response);
        if (response.token) {
          this.checkResult(response.token);
        } else {
          this.output = '❌ Submission error: No token received';
          this.isRunning = false;
        }
      },
      error: (err) => {
        console.error('Judge0 API error details:', err);
        this.output = `❌ API connection error: ${err.status} ${err.statusText}`;
        this.isRunning = false;
      }
    });
}

  private checkResult(token: string, retries = 10, delay = 2000): void {
    if (retries === 0) {
      this.output = '⏳ Timeout error.';
      this.isRunning = false;
      return;
    }

    setTimeout(() => {
      this.http.get<any>(`${this.apiUrl}/${token}?base64_encoded=false`, { headers: this.headers })
        .subscribe({
          next: (response) => {
            if (response.status.id === 1 || response.status.id === 2) {
              this.checkResult(token, retries - 1, delay);
            } else {
              this.displayResult(response);
              this.isRunning = false;
            }
          },
          error: (err) => {
            this.output = '❌ Result retrieval error.';
            this.isRunning = false;
          }
        });
    }, delay);
  }

  private displayResult(response: any): void {
    let executionTime = response.time ? `⏱️ Execution time: ${response.time}s` : '';

    switch (response.status.id) {
      case 3: // Accepted
        this.isCodeExecutedSuccessfully = true;
        this.output = `✅ Output:\n${response.stdout}\n${executionTime}`;
        break;
      case 4: // Compilation Error
        this.output = `❌ Compilation Error:\n${response.compile_output}`;
        break;
      case 5: // Runtime Error
        this.output = `❌ Runtime Error:\n${response.stderr}`;
        break;
      default:
        this.output = `❌ Unknown execution error.\nStatus: ${response.status.description}`;
        break;
    }
  }
  gitLink: string = '';



}
