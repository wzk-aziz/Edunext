import { Component, Input, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Problem } from 'src/app/backend/coding-game-admin/models/problem.model';
import { GitService } from './git.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent {
  @Input() problem!: Problem; 
  
  languages = [
    { id: 54, name: 'C++ (GCC 9.2.0)' },
    { id: 50, name: 'C (GCC 9.2.0)' },
    { id: 71, name: 'Python (3.8.1)' },
    { id: 62, name: 'Java (OpenJDK 13.0.1)' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)' }
  ];

  // GitHub configuration
  githubToken: string = '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';
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
  
  // URLs Judge0
  private apiUrl = 'https://judge0-ce.p.rapidapi.com/submissions';
  private headers = new HttpHeaders({
    'content-type': 'application/json',
    'X-RapidAPI-Key': '58ed86b64fmsh66a4bf39c5ccddep162a57jsne4e639de074e',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  });

  constructor(
    private http: HttpClient, 
    private gitService: GitService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    console.log('Problem received by editor:', this.problem);
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

    this.http.post<any>(`${this.apiUrl}?base64_encoded=false&wait=false`, payload, { headers: this.headers })
      .subscribe({
        next: (response) => {
          if (response.token) {
            this.checkResult(response.token);
          } else {
            this.output = '❌ Submission error.';
            this.isRunning = false;
          }
        },
        error: (err) => {
          this.output = '❌ API connection error.';
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
        this.output = '❌ Unknown execution error.';
        break;
    }
  }
}