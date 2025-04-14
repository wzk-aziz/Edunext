import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MentorshipProgram } from 'src/app/Student-Pages/student-tutoring/student-tutoring.model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  
  constructor() {
    // Configure pdfMake with fonts
    if (pdfMake) {
      // @ts-ignore
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

      // Calculate some program statistics
      const totalValue = programs.reduce((sum, program) => sum + (program.programPrice || 0), 0);
      const averagePrice = programs.length > 0 ? totalValue / programs.length : 0;
      
      // Count programs by status
      const activePrograms = programs.filter(p => this.isProgramActive(p)).length;
      const upcomingPrograms = programs.filter(p => this.isProgramUpcoming(p)).length;
      const completedPrograms = programs.filter(p => this.isProgramCompleted(p)).length;
      
      // Define the PDF document with enhanced aesthetics
      const documentDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 100, 40, 60],
        
        // Background design with gradient-like effect for pages
        background: function(currentPage: number) {
          return currentPage === 1 ? 
            // Cover page has special gradient background
            {
              canvas: [
                { type: 'rect', x: 0, y: 0, w: 595.28, h: 841.89, color: '#f5f5f5' },
                { type: 'rect', x: 0, y: 0, w: 595.28, h: 350, color: '#5e35b1' },
                { type: 'rect', x: 0, y: 350, w: 595.28, h: 30, color: '#7e57c2' }
              ]
            } : 
            // Other pages have a header strip
            {
              canvas: [
                { type: 'rect', x: 0, y: 0, w: 595.28, h: 70, color: '#5e35b1' }
              ]
            };
        },
        
        // Only show header on non-cover pages
        header: function(currentPage: number) {
          if (currentPage === 1) return null;
          
          return {
            columns: [
              { 
                svg: '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="white" viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>',
                width: 35,
                height: 35,
                margin: [40, 20, 10, 0]
              },
              {
                text: 'EduNext Mentorship',
                color: 'white',
                fontSize: 16,
                bold: true,
                margin: [0, 25, 0, 0]
              },
              {
                text: 'PROGRAM REPORT',
                color: 'white',
                fontSize: 12,
                alignment: 'right',
                margin: [0, 27, 40, 0]
              }
            ]
          };
        },
        
        footer: function(currentPage: number, pageCount: number) {
          // No footer on cover page
          if (currentPage === 1) return null;
          
          return {
            columns: [
              { 
                text: 'EduNext © ' + new Date().getFullYear(), 
                color: '#9e9e9e',
                fontSize: 8,
                margin: [40, 10, 0, 0] 
              },
              { 
                text: `Page ${currentPage - 1} of ${pageCount - 1}`, 
                color: '#9e9e9e',
                fontSize: 8,
                alignment: 'right',
                margin: [0, 10, 40, 0] 
              }
            ],
            // Line above the footer
            canvas: [
              { 
                type: 'line', 
                x1: 40, y1: 5, 
                x2: 555.28, y2: 5, 
                lineWidth: 0.5,
                lineColor: '#e0e0e0' 
              }
            ]
          };
        },
        
        content: [
          // Cover page with attractive design
          {
            stack: [
              // Add spacing at top
              { text: '', margin: [0, 120, 0, 0] },
              
              // Cover title with icon
              {
                columns: [
                  {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>',
                    width: 80,
                    height: 80,
                    alignment: 'center'
                  }
                ],
                margin: [0, 0, 0, 20]
              },
              
              {
                text: 'MENTORSHIP',
                fontSize: 44,
                bold: true,
                color: 'white',
                alignment: 'center',
                margin: [0, 0, 0, 5]
              },
              {
                text: 'PROGRAMS',
                fontSize: 44,
                bold: true,
                color: 'white',
                alignment: 'center',
                margin: [0, 0, 0, 30]
              },
              {
                text: 'Comprehensive Report',
                fontSize: 16,
                color: 'white',
                alignment: 'center',
                margin: [0, 0, 0, 60]
              },
              {
                columns: [
                  {
                    stack: [
                      {
                        text: 'INSTRUCTOR',
                        fontSize: 12,
                        color: 'white',
                        alignment: 'right',
                        margin: [0, 0, 0, 5]
                      },
                      {
                        text: instructorName,
                        fontSize: 16,
                        bold: true,
                        color: 'white',
                        alignment: 'right'
                      }
                    ],
                    width: '50%'
                  },
                  {
                    stack: [
                      {
                        text: 'DATE',
                        fontSize: 12,
                        color: 'white',
                        alignment: 'left',
                        margin: [20, 0, 0, 5]
                      },
                      {
                        text: currentDate,
                        fontSize: 16,
                        bold: true,
                        color: 'white',
                        alignment: 'left',
                        margin: [20, 0, 0, 0]
                      }
                    ],
                    width: '50%'
                  }
                ],
                margin: [0, 0, 0, 0]
              }
            ],
            pageBreak: 'after'
          },
          

        ],
        
        styles: {
          sectionHeader: {
            fontSize: 24,
            bold: true,
            color: '#5e35b1',
            margin: [0, 10, 0, 10]
          },
          statCard: {
            margin: [0, 0, 0, 0]
          },
          statValue: {
            fontSize: 24,
            bold: true,
            margin: [0, 5, 0, 0],
            color: '#333333'
          },
          statLabel: {
            fontSize: 12,
            color: '#757575',
            margin: [0, 5, 0, 0]
          },
          programCard: {
            margin: [0, 0, 0, 30]
          },
          programHeader: {
            fontSize: 18,
            bold: true,
            color: '#5e35b1',
          },
          statusBadge: {
            fontSize: 12,
            bold: true,
            color: 'white',
          },
          price: {
            fontSize: 18,
            bold: true,
            color: '#5e35b1',
            alignment: 'right'
          },
          subjectLabel: {
            fontSize: 14,
            color: '#7e57c2',
            italics: true,
          },
          dateLabel: {
            fontSize: 12,
            color: '#757575',
          },
          description: {
            fontSize: 12,
            color: '#616161',
            margin: [0, 10, 0, 0],
            lineHeight: 1.4
          }
        }
      };
      
      // Add each program as a beautifully styled card
      programs.forEach((program, index) => {
        const startDate = program.programStartDate ? 
          new Date(program.programStartDate).toLocaleDateString() : 'Not specified';
        const endDate = program.programEndDate ? 
          new Date(program.programEndDate).toLocaleDateString() : 'Not specified';
        
        // Determine program status and corresponding color
        let status = 'Unknown';
        let statusColor = '#9e9e9e';
        
        if (this.isProgramActive(program)) {
          status = 'Active';
          statusColor = '#4caf50'; // Green
        } else if (this.isProgramUpcoming(program)) {
          status = 'Upcoming';
          statusColor = '#2196f3'; // Blue
        } else if (this.isProgramCompleted(program)) {
          status = 'Completed';
          statusColor = '#9e9e9e'; // Gray
        }
        
        // Add page break between programs (except first)
        const pageBreak = (index > 0 && index % 2 === 0) ? 'before' : undefined;

        // Add program card with enhanced design
        documentDefinition.content.push({
          stack: [
            // Program header row with name and status badge
            {
              columns: [
                {
                  text: program.programName || 'Unnamed Program',
                  style: 'programHeader',
                  width: '*'
                },
                {
                  stack: [
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0, y: 0,
                          w: 80, h: 25,
                          r: 12.5, // Rounded corners
                          color: statusColor
                        }
                      ]
                    },
                    {
                      text: status,
                      style: 'statusBadge',
                      alignment: 'center',
                      margin: [0, -17, 0, 0]
                    }
                  ],
                  width: 'auto'
                }
              ],
              pageBreak: pageBreak,
              margin: [0, 0, 0, 15]
            },
            
            // Second row with subject and price
            {
              columns: [
                {
                  text: program.programSubject || 'General Subject',
                  style: 'subjectLabel',
                  width: '*'
                },
                {
                  text: `$${(program.programPrice || 0).toFixed(2)}`,
                  style: 'price',
                  width: 'auto'
                }
              ],
              margin: [0, 0, 0, 10]
            },
            
            // Third row with dates
            {
              text: `${startDate} - ${endDate}`,
              style: 'dateLabel',
              margin: [0, 0, 0, 10]
            },
            
            // Description
            {
              text: program.programDescription || 'No description provided for this program.',
              style: 'description'
            },
            
            // Divider after each program
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 20,
                  x2: 515, y2: 20,
                  lineWidth: 0.5,
                  lineColor: '#e0e0e0'
                }
              ],
              margin: [0, 10, 0, 10]
            }
          ],
          style: 'programCard'
        });
      });
      
      // Add a thank you note at the end
      documentDefinition.content.push({
        stack: [
          {
            text: 'Thank you for your dedication to education',
            fontSize: 14,
            italics: true,
            color: '#5e35b1',
            alignment: 'center',
            margin: [0, 30, 0, 0]
          }
        ]
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

  // Helper method to create a stats card with consistent styling
  private createStatsCard(label: string, value: string, color: string, iconPath: string): any {
    return {
      stack: [
        // Card container with shadow
        {
          canvas: [
            {
              type: 'rect',
              x: 0, y: 0,
              w: 235, h: 100,
              r: 4, // rounded corners
              lineColor: '#e0e0e0',
              lineWidth: 1,
              fillColor: '#ffffff',
              color: '#ffffff'
            }
          ]
        },
        // Card content
        {
          columns: [
            // Left: Icon
            {
              stack: [
                {
                  svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="${color}" viewBox="0 0 24 24"><path d="${iconPath}"/></svg>`,
                  width: 24,
                  height: 24,
                }
              ],
              width: 'auto',
              margin: [15, -85, 0, 0]
            },
            // Right: Content
            {
              stack: [
                {
                  text: label,
                  fontSize: 14,
                  color: '#757575',
                  margin: [0, -85, 15, 5]
                },
                {
                  text: value,
                  fontSize: 22,
                  bold: true,
                  color: color,
                  margin: [0, 0, 15, 0]
                }
              ],
              width: '*',
              margin: [10, 0, 0, 0]
            }
          ]
        }
      ],
      style: 'statCard'
    };
  }
  
  // Helper methods to determine program status
  private isProgramActive(program: MentorshipProgram): boolean {
    if (!program.programStartDate || !program.programEndDate) return false;
    
    const now = new Date().getTime();
    const start = new Date(program.programStartDate).getTime();
    const end = new Date(program.programEndDate).getTime();
    
    return now >= start && now <= end;
  }
  
  private isProgramUpcoming(program: MentorshipProgram): boolean {
    if (!program.programStartDate) return false;
    
    const now = new Date().getTime();
    const start = new Date(program.programStartDate).getTime();
    
    return now < start;
  }
  
  private isProgramCompleted(program: MentorshipProgram): boolean {
    if (!program.programEndDate) return false;
    
    const now = new Date().getTime();
    const end = new Date(program.programEndDate).getTime();
    
    return now > end;
  }
}