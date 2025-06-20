import PDFDocument from 'pdfkit';
import { CertificatePdfServiceInterface, CertificateTemplateData } from '../../../app/providers/generate-certificate.interface';

export class CertificatePdfService implements CertificatePdfServiceInterface {
  private readonly platformName: string;
  private readonly certificateTemplate: string;

  constructor(platformName: string = 'Byway Learning Platform') {
    this.platformName = platformName;
    this.certificateTemplate = this.getDefaultTemplate();
  }

  async generateCertificatePDF(data: CertificateTemplateData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        this.renderCertificate(doc, data);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateCertificatePDFStream(data: CertificateTemplateData): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    });

    this.renderCertificate(doc, data);
    doc.end();

    return doc;
  }

  private renderCertificate(doc: PDFKit.PDFDocument, data: CertificateTemplateData): void {
    // Background with elegant design
    this.drawBackground(doc);

    // Decorative elements
    this.drawDecorativeElements(doc);

    // Ornate border
    this.drawBorder(doc);

    // Header with logo area
    this.drawHeader(doc);

    // Main content with elegant typography
    this.drawMainContent(doc, data);

    // Footer with signatures
    this.drawFooter(doc, data);

    // Certificate number with styling
    this.drawCertificateNumber(doc, data.certificateNumber);

    // Watermark
    this.drawWatermark(doc);
  }

  private drawBackground(doc: PDFKit.PDFDocument): void {
    // Elegant gradient background
    const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
    gradient.stop(0, '#fdfcfb');
    gradient.stop(0.5, '#f7f3f0');
    gradient.stop(1, '#e8ddd4');
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);

    // Subtle pattern overlay
    doc.fillOpacity(0.03);
    doc.fillColor('#8b4513');
    for (let x = 0; x < doc.page.width; x += 40) {
      for (let y = 0; y < doc.page.height; y += 40) {
        doc.circle(x, y, 1).fill();
      }
    }
    doc.fillOpacity(1);
  }

  private drawDecorativeElements(doc: PDFKit.PDFDocument): void {
    // Corner decorative elements
    const cornerSize = 60;
    const margin = 40;

    // Top-left corner
    doc.strokeColor('#d4af37');
    doc.lineWidth(2);
    doc
      .moveTo(margin, margin + cornerSize)
      .lineTo(margin, margin)
      .lineTo(margin + cornerSize, margin)
      .stroke();

    // Top-right corner
    doc
      .moveTo(doc.page.width - margin - cornerSize, margin)
      .lineTo(doc.page.width - margin, margin)
      .lineTo(doc.page.width - margin, margin + cornerSize)
      .stroke();

    // Bottom-left corner
    doc
      .moveTo(margin, doc.page.height - margin - cornerSize)
      .lineTo(margin, doc.page.height - margin)
      .lineTo(margin + cornerSize, doc.page.height - margin)
      .stroke();

    // Bottom-right corner
    doc
      .moveTo(doc.page.width - margin - cornerSize, doc.page.height - margin)
      .lineTo(doc.page.width - margin, doc.page.height - margin)
      .lineTo(doc.page.width - margin, doc.page.height - margin - cornerSize)
      .stroke();

    // Decorative flourishes
    this.drawFlourish(doc, doc.page.width / 2, 160);
    this.drawFlourish(doc, doc.page.width / 2, doc.page.height - 80);
  }

  private drawFlourish(
    doc: PDFKit.PDFDocument,
    centerX: number,
    centerY: number
  ): void {
    doc.strokeColor('#d4af37');
    doc.lineWidth(1.5);
    doc.fillColor('#d4af37');

    // Central ornament
    doc.circle(centerX, centerY, 3).fill();

    // Side flourishes
    const length = 30;
    const curves = 5;

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < curves; i++) {
        const x = centerX + side * (10 + i * 6);
        const y = centerY + Math.sin(i * 0.8) * 3;
        doc.circle(x, y, 1).fill();
      }
    }
  }

  private drawBorder(doc: PDFKit.PDFDocument): void {
    // Outer decorative border
    doc.strokeColor('#8b4513');
    doc.lineWidth(4);
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke();

    // Inner golden border
    doc.strokeColor('#d4af37');
    doc.lineWidth(2);
    doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70).stroke();

    // Innermost fine border
    doc.strokeColor('#8b4513');
    doc.lineWidth(1);
    doc.rect(45, 45, doc.page.width - 90, doc.page.height - 90).stroke();
  }

  private drawHeader(doc: PDFKit.PDFDocument): void {
    const centerX = doc.page.width / 2;

    // Logo placeholder circle
    doc.strokeColor('#d4af37');
    doc.lineWidth(3);
    doc.fillColor('#ffffff');
    doc.circle(centerX, 90, 20).fillAndStroke();

    // Academy crest lines
    doc.strokeColor('#8b4513');
    doc.lineWidth(2);
    doc
      .moveTo(centerX - 15, 85)
      .lineTo(centerX + 15, 85)
      .stroke();
    doc
      .moveTo(centerX - 10, 90)
      .lineTo(centerX + 10, 90)
      .stroke();
    doc
      .moveTo(centerX - 15, 95)
      .lineTo(centerX + 15, 95)
      .stroke();

    // Platform name with elegant font
    doc.fontSize(16);
    doc.font('Helvetica');
    doc.fillColor('#8b4513');
    doc.text(this.platformName.toUpperCase(), centerX, 125, {
      align: 'center',
      characterSpacing: 2,
    });

    // Certificate title with dramatic styling
    doc.fontSize(48);
    doc.font('Helvetica-Bold');
    doc.fillColor('#2c1810');
    doc.text('CERTIFICATE', centerX, 150, { align: 'center' });

    doc.fontSize(24);
    doc.font('Helvetica');
    doc.fillColor('#8b4513');
    doc.text('of Achievement', centerX, 200, {
      align: 'center',
      characterSpacing: 4,
    });
  }

  private drawMainContent(doc: PDFKit.PDFDocument, data: CertificateTemplateData): void {
    const centerX = doc.page.width / 2;
    let currentY = 260;

    // Ceremonial text
    doc.fontSize(18);
    doc.font('Helvetica');
    doc.fillColor('#5d4037');
    doc.text('This is to certify that', centerX, currentY, {
      align: 'center',
      characterSpacing: 1,
    });

    currentY += 45;

    // Student name with elegant styling
    doc.fontSize(36);
    doc.font('Helvetica-Bold');
    doc.fillColor('#2c1810');

    // Name with underline decoration
    const nameWidth = doc.widthOfString(data.studentName);
    const nameX = centerX - nameWidth / 2;
    doc.text(data.studentName, centerX, currentY, { align: 'center' });

    // Decorative underline
    doc.strokeColor('#d4af37');
    doc.lineWidth(2);
    doc
      .moveTo(nameX - 20, currentY + 45)
      .lineTo(nameX + nameWidth + 20, currentY + 45)
      .stroke();

    currentY += 70;

    // Achievement text
    doc.fontSize(18);
    doc.font('Helvetica');
    doc.fillColor('#5d4037');
    doc.text('has successfully completed the course', centerX, currentY, {
      align: 'center',
      characterSpacing: 1,
    });

    currentY += 45;

    // Course title with emphasis
    doc.fontSize(28);
    doc.font('Helvetica-Bold');
    doc.fillColor('#8b4513');
    doc.text(data.courseTitle, centerX, currentY, {
      align: 'center',
      characterSpacing: 1,
    });

    currentY += 50;

    // Performance metrics in elegant format
    if (data.totalLessons && data.completedLessons) {
      doc.fontSize(14);
      doc.font('Helvetica');
      doc.fillColor('#6d4c41');
      doc.text(
        `Completed ${data.completedLessons} of ${data.totalLessons} lessons`,
        centerX,
        currentY,
        { align: 'center', characterSpacing: 0.5 }
      );
      currentY += 20;
    }

    if (data.averageScore) {
      doc.fontSize(14);
      doc.font('Helvetica-Bold');
      doc.fillColor('#8b4513');
      doc.text(`Average Score: ${data.averageScore}%`, centerX, currentY, {
        align: 'center',
        characterSpacing: 0.5,
      });
      currentY += 25;
    }

    // Completion date with formal styling
    doc.fontSize(16);
    doc.font('Helvetica');
    doc.fillColor('#5d4037');
    doc.text(`Completed on ${data.completionDate}`, centerX, currentY, {
      align: 'center',
      characterSpacing: 1,
    });
  }

  private drawFooter(doc: PDFKit.PDFDocument, data: CertificateTemplateData): void {
    const centerX = doc.page.width / 2;
    const footerY = doc.page.height - 140;
    const leftX = 120;
    const rightX = doc.page.width - 120;

    // Signature lines
    doc.strokeColor('#8b4513');
    doc.lineWidth(1);
    doc
      .moveTo(leftX - 50, footerY + 20)
      .lineTo(leftX + 50, footerY + 20)
      .stroke();
    doc
      .moveTo(rightX - 50, footerY + 20)
      .lineTo(rightX + 50, footerY + 20)
      .stroke();

    // Signature labels
    doc.fontSize(12);
    doc.font('Helvetica');
    doc.fillColor('#6d4c41');

    if (data.instructorName) {
      doc.text(data.instructorName, leftX, footerY + 30, { align: 'center' });
      doc.text('Course Instructor', leftX, footerY + 45, { align: 'center' });
    } else {
      doc.text('Course Instructor', leftX, footerY + 30, { align: 'center' });
    }

    doc.text('Academic Director', rightX, footerY + 30, { align: 'center' });
    doc.text(this.platformName, rightX, footerY + 45, { align: 'center' });

    // Issued date centered
    doc.fontSize(14);
    doc.font('Helvetica');
    doc.fillColor('#5d4037');
    doc.text(`Issued: ${data.issuedDate}`, centerX, footerY + 60, {
      align: 'center',
      characterSpacing: 1,
    });
  }

  private drawCertificateNumber(doc: PDFKit.PDFDocument, certificateNumber: string): void {
    // Certificate number with decorative frame
    const x = doc.page.width - 100;
    const y = doc.page.height - 60;

    doc.strokeColor('#d4af37');
    doc.lineWidth(1);
    doc.rect(x - 40, y - 15, 80, 25).stroke();

    doc.fontSize(10);
    doc.font('Helvetica');
    doc.fillColor('#8b4513');
    doc.text('Certificate No.', x, y - 10, { align: 'center' });
    doc.text(certificateNumber, x, y + 2, { align: 'center' });
  }

  private drawWatermark(doc: PDFKit.PDFDocument): void {
    // Subtle watermark
    doc.fillOpacity(0.03);
    doc.fontSize(120);
    doc.font('Helvetica-Bold');
    doc.fillColor('#8b4513');
    doc.save();
    doc.rotate(-15, { origin: [doc.page.width / 2, doc.page.height / 2 - 60] });
    doc.text('CERTIFIED', doc.page.width / 2, doc.page.height / 2 - 60, { align: 'center' });
    doc.restore();
    doc.fillOpacity(1);
  }

  private getDefaultTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap');
          
          body { 
            font-family: 'Source Sans Pro', sans-serif; 
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #fdfcfb 0%, #e8ddd4 100%);
          }
          
          .certificate { 
            border: 4px solid #8b4513;
            border-radius: 15px;
            padding: 60px; 
            text-align: center; 
            background: #ffffff;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
            max-width: 800px;
            margin: 40px auto;
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%);
            pointer-events: none;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            border: 3px solid #d4af37;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(45deg, #d4af37, #ffd700);
            color: white;
            font-weight: bold;
            font-size: 24px;
          }
          
          .platform-name { 
            font-size: 16px; 
            color: #8b4513; 
            font-weight: 300;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          
          .title { 
            font-family: 'Playfair Display', serif;
            font-size: 54px; 
            font-weight: 700; 
            color: #2c1810;
            margin: 20px 0 10px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          
          .subtitle {
            font-size: 24px;
            color: #8b4513;
            font-weight: 300;
            letter-spacing: 4px;
            margin-bottom: 40px;
            text-transform: uppercase;
          }
          
          .certify-text {
            font-size: 18px;
            color: #5d4037;
            margin: 30px 0;
            font-weight: 300;
            letter-spacing: 1px;
          }
          
          .name { 
            font-family: 'Playfair Display', serif;
            font-size: 42px; 
            font-weight: 700; 
            color: #2c1810;
            margin: 30px 0;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 10px;
            display: inline-block;
          }
          
          .course { 
            font-size: 28px; 
            color: #8b4513;
            font-weight: 600;
            margin: 30px 0;
            letter-spacing: 1px;
          }
          
          .metrics {
            font-size: 14px;
            color: #6d4c41;
            margin: 20px 0;
            font-weight: 400;
          }
          
          .score {
            font-size: 16px;
            color: #8b4513;
            font-weight: 600;
            margin: 15px 0;
          }
          
          .date { 
            font-size: 16px; 
            color: #5d4037;
            margin: 25px 0;
            font-weight: 400;
          }
          
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 20px;
          }
          
          .signature {
            text-align: center;
            flex: 1;
            margin: 0 30px;
          }
          
          .signature-line {
            border-top: 2px solid #8b4513;
            margin-bottom: 10px;
            width: 150px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .signature-name {
            font-size: 14px;
            color: #6d4c41;
            font-weight: 600;
          }
          
          .signature-title {
            font-size: 12px;
            color: #8b4513;
            font-weight: 300;
          }
          
          .number { 
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 12px; 
            color: #8b4513;
            border: 1px solid #d4af37;
            padding: 8px 15px;
            border-radius: 5px;
            background: rgba(255,255,255,0.8);
          }
          
          .decorative-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
          }
          
          .corner-decoration {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 2px solid #d4af37;
          }
          
          .corner-decoration.top-left {
            top: 20px;
            left: 20px;
            border-right: none;
            border-bottom: none;
          }
          
          .corner-decoration.top-right {
            top: 20px;
            right: 20px;
            border-left: none;
            border-bottom: none;
          }
          
          .corner-decoration.bottom-left {
            bottom: 20px;
            left: 20px;
            border-right: none;
            border-top: none;
          }
          
          .corner-decoration.bottom-right {
            bottom: 20px;
            right: 20px;
            border-left: none;
            border-top: none;
          }
          
          .flourish {
            color: #d4af37;
            font-size: 30px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="decorative-elements">
            <div class="corner-decoration top-left"></div>
            <div class="corner-decoration top-right"></div>
            <div class="corner-decoration bottom-left"></div>
            <div class="corner-decoration bottom-right"></div>
          </div>
          
          <div class="logo">★</div>
          <div class="platform-name">{{platformName}}</div>
          <div class="title">CERTIFICATE</div>
          <div class="subtitle">of Achievement</div>
          <div class="flourish">❦</div>
          
          <div class="certify-text">This is to certify that</div>
          <div class="name">{{studentName}}</div>
          <div class="certify-text">has successfully completed the course</div>
          <div class="course">{{courseTitle}}</div>
          
          <div class="metrics">Completed {{completedLessons}} of {{totalLessons}} lessons</div>
          <div class="score">Average Score: {{averageScore}}%</div>
          <div class="date">Completed on {{completionDate}}</div>
          
          <div class="flourish">❦</div>
          
          <div class="signatures">
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-name">{{instructorName}}</div>
              <div class="signature-title">Course Instructor</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-name">Academic Director</div>
              <div class="signature-title">{{platformName}}</div>
            </div>
          </div>
          
          <div class="date">Issued: {{issuedDate}}</div>
          <div class="number">Certificate No. {{certificateNumber}}</div>
        </div>
      </body>
      </html>
    `;
  }
} 