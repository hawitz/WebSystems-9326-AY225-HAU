from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.platypus import Image, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import os

class PDFGenerator:
    """Generate professional PDF learning materials from scraped data"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._create_custom_styles()
    
    def _create_custom_styles(self):
        """Create custom paragraph styles for professional look"""
        
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#003366'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section heading style
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=selfyles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#004080'),
            spaceBefore=20,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        ))
        
        # Subsection heading style
        self.styles.add(ParagraphStyle(
            name='SubsectionHeading',
            parent=self.styles['Heading3'],
            fontSize=14,
            textColor=colors.HexColor('#0066CC'),
            spaceBefore=15,
            spaceAfter=8,
            fontName='Helvetica-Bold'
        ))
        
        # Normal text style
        self.styles.add(ParagraphStyle(
            name='CustomNormal',
            parent=self.styles['Normal'],
            fontSize=11,
            leading=14,
            spaceAfter=8,
            alignment=TA_JUSTIFY,
            fontName='Helvetica'
        ))
        
        # Code block style
        self.styles.add(ParagraphStyle(
            name='CodeStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            leading=12,
            textColor=colors.HexColor('#333333'),
            backColor=colors.HexColor('#F5F5F5'),
            borderPadding=10,
            borderWidth=1,
            borderColor=colors.HexColor('#CCCCCC'),
            fontName='Courier',
            leftIndent=20,
            rightIndent=20,
            spaceBefore=10,
            spaceAfter=10
        ))
        
        # Header style
        self.styles.add(ParagraphStyle(
            name='HeaderStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#666666'),
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        # Footer style
        self.styles.add(ParagraphStyle(
            name='FooterStyle',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#999999'),
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        # Difficulty badge styles
        self.styles.add(ParagraphStyle(
            name='DifficultyEasy',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#155724'),
            backColor=colors.HexColor('#D4EDDA'),
            alignment=TA_CENTER,
            borderWidth=1,
            borderColor=colors.HexColor('#C3E6CB'),
            borderPadding=5
        ))
        
        self.styles.add(ParagraphStyle(
            name='DifficultyMedium',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#856404'),
            backColor=colors.HexColor('#FFF3CD'),
            alignment=TA_CENTER,
            borderWidth=1,
            borderColor=colors.HexColor('#FFEEBA'),
            borderPadding=5
        ))
        
        self.styles.add(ParagraphStyle(
            name='DifficultyHard',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#721C24'),
            backColor=colors.HexColor('#F8D7DA'),
            alignment=TA_CENTER,
            borderWidth=1,
            borderColor=colors.HexColor('#F5C6CB'),
            borderPadding=5
        ))
    
    def _create_header(self, canvas, doc):
        """Create page header with topic and date"""
        canvas.saveState()
        
        # Header line
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.HexColor('#666666'))
        
        # Left header - Topic
        canvas.drawString(doc.leftMargin, doc.height + doc.topMargin - 10, 
                         "Data Science Learning Material")
        
        # Right header - Date
        date_str = datetime.now().strftime("%B %d, %Y")
        canvas.drawRightString(doc.width + doc.leftMargin, 
                              doc.height + doc.topMargin - 10, date_str)
        
        # Header line
        canvas.setStrokeColor(colors.HexColor('#CCCCCC'))
        canvas.line(doc.leftMargin, doc.height + doc.topMargin - 15,
                   doc.width + doc.leftMargin, doc.height + doc.topMargin - 15)
        
        canvas.restoreState()
    
    def _create_footer(self, canvas, doc):
        """Create page footer with page number and disclaimer"""
        canvas.saveState()
        
        # Footer line
        canvas.setStrokeColor(colors.HexColor('#CCCCCC'))
        canvas.line(doc.leftMargin, doc.bottomMargin - 10,
                   doc.width + doc.leftMargin, doc.bottomMargin - 10)
        
        # Footer text
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(colors.HexColor('#999999'))
        
        # Left footer - Disclaimer
        canvas.drawString(doc.leftMargin, doc.bottomMargin - 25,
                         "Generated by Data Science Academic Scraper System")
        
        # Right footer - Page number
        page_num = f"Page {doc.page}"
        canvas.drawRightString(doc.width + doc.leftMargin, doc.bottomMargin - 25, page_num)
        
        canvas.restoreState()
    
    def generate_learning_material(self, data, output_filename):
        """Generate complete PDF learning material"""
        
        # Create PDF document
        doc = SimpleDocTemplate(
            output_filename,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Build story
        story = []
        
        # Title Page
        story.append(Paragraph("Data Science Learning Material", self.styles['CustomTitle']))
        story.append(Spacer(1, 0.5*inch))
        
        # Subject Category
        story.append(Paragraph(
            f"Subject Category: <b>Data Science & Machine Learning</b>",
            self.styles['SectionHeading']
        ))
        
        # Generation info
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph(
            f"<b>Date of Generation:</b> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
            self.styles['CustomNormal']
        ))
        story.append(Paragraph(
            f"<b>Number of Topics:</b> {len(data)}",
            self.styles['CustomNormal']
        ))
        
        # Table of Contents
        story.append(PageBreak())
        story.append(Paragraph("Table of Contents", self.styles['SectionHeading']))
        story.append(Spacer(1, 0.2*inch))
        
        # Create TOC
        toc_data = [['#', 'Topic Title', 'Difficulty', 'Page']]
        for i, topic in enumerate(data, 1):
            toc_data.append([
                str(i),
                topic['title'][:50] + '...' if len(topic['title']) > 50 else topic['title'],
                topic['difficulty'],
                str(i+2)  # Page number approximation
            ])
        
        toc_table = Table(toc_data, colWidths=[0.5*inch, 4*inch, 1*inch, 0.5*inch])
        toc_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#003366')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F8F9FA')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#CCCCCC')),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        story.append(toc_table)
        
        # Content Sections
        for i, topic in enumerate(data, 1):
            story.append(PageBreak())
            
            # Topic Title with numbering
            story.append(Paragraph(f"Topic {i}: {topic['title']}", self.styles['SectionHeading']))
            story.append(Spacer(1, 0.1*inch))
            
            # Difficulty Badge
            difficulty_style = 'DifficultyEasy'
            if 'medium' in topic['difficulty'].lower():
                difficulty_style = 'DifficultyMedium'
            elif 'hard' in topic['difficulty'].lower():
                difficulty_style = 'DifficultyHard'
            
            story.append(Paragraph(f"Difficulty Level: {topic['difficulty']}", 
                                  self.styles[difficulty_style]))
            story.append(Spacer(1, 0.2*inch))
            
            # Key Concepts
            story.append(Paragraph("Key Technical Concepts", self.styles['SubsectionHeading']))
            story.append(Paragraph(topic['concepts'], self.styles['CustomNormal']))
            story.append(Spacer(1, 0.1*inch))
            
            # Code Implementation
            if topic['code'] != "Not Available":
                story.append(Paragraph("Implementation", self.styles['SubsectionHeading']))
                story.append(Paragraph(topic['code'], self.styles['CodeStyle']))
                story.append(Spacer(1, 0.1*inch))
            
            # Complexity Analysis
            if topic['complexity'] != "Not Available":
                story.append(Paragraph("Complexity Analysis", self.styles['SubsectionHeading']))
                story.append(Paragraph(topic['complexity'], self.styles['CustomNormal']))
                story.append(Spacer(1, 0.1*inch))
            
            # References
            story.append(Paragraph("References", self.styles['SubsectionHeading']))
            story.append(Paragraph(
                f"<a href='{topic['references']}' color='blue'>{topic['references']}</a>",
                self.styles['CustomNormal']
            ))
            
            # Source URL
            story.append(Spacer(1, 0.1*inch))
            story.append(Paragraph(
                f"<i>Source: <a href='{topic['url']}' color='blue'>{topic['url']}</a></i>",
                self.styles['FooterStyle']
            ))
        
        # Build PDF with headers and footers
        doc.build(story, onFirstPage=self._create_header, 
                 onLaterPages=self._create_footer,
                 onFirstPage=self._create_footer)
        
        return os.path.basename(output_filename)

# Example usage
if __name__ == "__main__":
    import json
    
    # Load sample data
    with open('scraped_data_test.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Generate PDF
    pdf_gen = PDFGenerator()
    filename = pdf_gen.generate_learning_material(data, 'test_output.pdf')
    print(f"PDF generated: {filename}")