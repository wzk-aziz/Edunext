import { Injectable } from '@angular/core';

import  pdfMake from 'pdfmake/build/pdfmake';
import  pdfFonts from 'pdfmake/build/vfs_fonts';

// Import your MentorshipProgram interface
import { MentorshipProgram } from 'src/app/Student-Pages/student-tutoring/student-tutoring.model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  
  constructor() {
    // More robust way to configure pdfMake with fonts
    if (pdfMake) {
      // @ts-ignore - Ignore TypeScript errors for this line
      pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;
    }
  }
  
  generateMentorshipProgramsPDF(programs: MentorshipProgram[], instructorName: string): void {
    try {
      console.log("Generating PDF for", programs.length, "programs");
      
      // Current date for the PDF
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Define the PDF document definition with proper types
      const documentDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        
        header: {
          columns: [
            {
              text: 'EduNext Learning Platform',
              alignment: 'right',
              margin: [0, 20, 40, 0],
              fontSize: 14,
              color: '#5e35b1'
            }
          ]
        },
        
        footer: (currentPage: any, pageCount: any) => {
          return {
            columns: [
              { text: 'EduNext © 2023', alignment: 'left', margin: [40, 0, 0, 0], fontSize: 8 },
              { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', margin: [0, 0, 40, 0], fontSize: 8 }
            ],
            margin: [40, 20, 40, 40]
          };
        },
        
        content: [
          {
            text: 'Mentorship Programs Report',
            style: 'header'
          },
          {
            text: `Instructor: ${instructorName}`,
            style: 'subheader'
          },
          {
            text: `Generated on: ${currentDate}`,
            style: 'date'
          },
          {
            text: `Total Programs: ${programs.length}`,
            style: 'stats'
          },
          {
            text: 'Program Details',
            style: 'sectionHeader',
            margin: [0, 20, 0, 10]
          }
        ],
        
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            color: '#5e35b1',
            margin: [0, 20, 0, 10]
          },
          subheader: {
            fontSize: 16,
            color: '#333',
            margin: [0, 0, 0, 5]
          },
          date: {
            fontSize: 12,
            color: '#555',
            margin: [0, 0, 0, 15]
          },
          stats: {
            fontSize: 14,
            color: '#333',
            margin: [0, 5, 0, 5]
          },
          sectionHeader: {
            fontSize: 18,
            bold: true,
            color: '#5e35b1',
            margin: [0, 15, 0, 10]
          },
          programCard: {
            margin: [0, 0, 0, 15],
            padding: 10,
            fillColor: '#f9f9f9'
          },
          programName: {
            fontSize: 16,
            bold: true,
            color: '#333'
          },
          subject: {
            fontSize: 14,
            color: '#5e35b1',
            italics: true
          },
          price: {
            fontSize: 14,
            bold: true,
            color: '#5e35b1'
          },
          dates: {
            fontSize: 12,
            color: '#555'
          },
          description: {
            fontSize: 12,
            color: '#333',
            margin: [0, 5, 0, 0]
          }
        }
      };
      
      // Add each program as a styled box
      programs.forEach((program, index) => {
        const startDate = program.programStartDate ? 
          new Date(program.programStartDate).toLocaleDateString() : 'Not specified';
        const endDate = program.programEndDate ? 
          new Date(program.programEndDate).toLocaleDateString() : 'Not specified';
        
        documentDefinition.content.push({
          stack: [
            { text: program.programName || 'Unnamed Program', style: 'programName' },
            { text: `Subject: ${program.programSubject || 'Not specified'}`, style: 'subject', margin: [0, 5, 0, 0] },
            { text: `Price: $${(program.programPrice || 0).toFixed(2)}`, style: 'price', margin: [0, 5, 0, 0] },
            { text: `Duration: ${startDate} - ${endDate}`, style: 'dates', margin: [0, 5, 0, 0] },
            { text: `Description: ${program.programDescription || 'No description provided.'}`, style: 'description', margin: [0, 10, 0, 0] }
          ],
          style: 'programCard',
          margin: [0, (index > 0) ? 20 : 0, 0, 0]
        });
      });
      
      console.log("PDF definition created, attempting to generate PDF");
      
      // Try both download and open methods
      try {
        // First try download
        pdfMake.createPdf(documentDefinition).download('Mentorship_Programs.pdf');
        console.log("PDF download initiated");
      } catch (err) {
        console.error("Download failed, trying open method", err);
        // If download fails, try opening in new window
        pdfMake.createPdf(documentDefinition).open();
      }
    } catch (error) {
      console.error("Error in PDF generation:", error);
      throw error; // Re-throw so component can catch it
    }
  }
  
  // Base64 encoded small logo for header
  private getLogo(): string {
    // Just the first part of your base64 string for brevity
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDMtMDFUMTU6NDA6NDcrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAzLTAxVDE1OjQzOjIwKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTAzLTAxVDE1OjQzOjIwKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMTlhZGJmOS04MWE0LTRiZDYtODU3Yi0wOWMyMmNkZjIxYzIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmYzRiZTJiYi1jZGE0LWE5NGUtYmVlZC01NjQzZmE5YjRlMzQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OTMzN2FiMS0yMzE2LTRiMzItYTZiZS01ZjlmNzFkMzQ3MmEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU5MzM3YWIxLTIzMTYtNGIzMi1hNmJlLTVmOWY3MWQzNDcyYSIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0wMVQxNTo0MDo0NyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmExOWFkYmY5LTgxYTQtNGJkNi04NTdiLTA5YzIyY2RmMjFjMiIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0wMVQxNTo0MzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+';
  }
}