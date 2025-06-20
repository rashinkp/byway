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
    // Background
    this.drawBackground(doc);

    // Border
    this.drawBorder(doc);

    // Header
    this.drawHeader(doc);

    // Main content
    this.drawMainContent(doc, data);

    // Footer
    this.drawFooter(doc, data);

    // Certificate number
    this.drawCertificateNumber(doc, data.certificateNumber);
  }

  private drawBackground(doc: PDFKit.PDFDocument): void {
    // Light gradient background
    const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
    gradient.stop(0, '#f8fafc');
    gradient.stop(1, '#e2e8f0');
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);
  }

  private drawBorder(doc: PDFKit.PDFDocument): void {
    // Decorative border
    doc.strokeColor('#1e40af');
    doc.lineWidth(3);
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    // Inner border
    doc.strokeColor('#3b82f6');
    doc.lineWidth(1);
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();
  }

  private drawHeader(doc: PDFKit.PDFDocument): void {
    // Platform name
    doc.fontSize(24);
    doc.font('Helvetica-Bold');
    doc.fillColor('#1e40af');
    doc.text(this.platformName, doc.page.width / 2, 80, { align: 'center' });

    // Certificate title
    doc.fontSize(36);
    doc.font('Helvetica-Bold');
    doc.fillColor('#1f2937');
    doc.text('Certificate of Completion', doc.page.width / 2, 120, { align: 'center' });
  }

  private drawMainContent(doc: PDFKit.PDFDocument, data: CertificateTemplateData): void {
    const centerX = doc.page.width / 2;
    let currentY = 200;

    // This is to certify that
    doc.fontSize(16);
    doc.font('Helvetica');
    doc.fillColor('#4b5563');
    doc.text('This is to certify that', centerX, currentY, { align: 'center' });

    currentY += 40;

    // Student name
    doc.fontSize(28);
    doc.font('Helvetica-Bold');
    doc.fillColor('#1f2937');
    doc.text(data.studentName, centerX, currentY, { align: 'center' });

    currentY += 50;

    // Has successfully completed
    doc.fontSize(16);
    doc.font('Helvetica');
    doc.fillColor('#4b5563');
    doc.text('has successfully completed the course', centerX, currentY, { align: 'center' });

    currentY += 40;

    // Course title
    doc.fontSize(24);
    doc.font('Helvetica-Bold');
    doc.fillColor('#1f2937');
    doc.text(data.courseTitle, centerX, currentY, { align: 'center' });

    currentY += 50;

    // Completion details
    if (data.totalLessons && data.completedLessons) {
      doc.fontSize(14);
      doc.font('Helvetica');
      doc.fillColor('#6b7280');
      doc.text(
        `Completed ${data.completedLessons} out of ${data.totalLessons} lessons`,
        centerX,
        currentY,
        { align: 'center' }
      );
      currentY += 25;
    }

    if (data.averageScore) {
      doc.text(
        `Average Score: ${data.averageScore}%`,
        centerX,
        currentY,
        { align: 'center' }
      );
      currentY += 25;
    }

    // Completion date
    doc.text(
      `Completed on ${data.completionDate}`,
      centerX,
      currentY,
      { align: 'center' }
    );
  }

  private drawFooter(doc: PDFKit.PDFDocument, data: CertificateTemplateData): void {
    const centerX = doc.page.width / 2;
    const footerY = doc.page.height - 120;

    // Issued date
    doc.fontSize(12);
    doc.font('Helvetica');
    doc.fillColor('#6b7280');
    doc.text(`Issued on: ${data.issuedDate}`, centerX, footerY, { align: 'center' });

    // Instructor signature (if available)
    if (data.instructorName) {
      doc.text(
        `Instructor: ${data.instructorName}`,
        centerX,
        footerY + 25,
        { align: 'center' }
      );
    }

    // Platform signature
    doc.text(
      `Platform: ${this.platformName}`,
      centerX,
      footerY + 50,
      { align: 'center' }
    );
  }

  private drawCertificateNumber(doc: PDFKit.PDFDocument, certificateNumber: string): void {
    // Certificate number in bottom right
    doc.fontSize(10);
    doc.font('Helvetica');
    doc.fillColor('#9ca3af');
    doc.text(
      `Certificate #: ${certificateNumber}`,
      doc.page.width - 60,
      doc.page.height - 40,
      { align: 'right' }
    );
  }

  private getDefaultTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .certificate { 
            border: 2px solid #1e40af; 
            padding: 40px; 
            text-align: center; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
          .title { font-size: 36px; font-weight: bold; color: #1f2937; }
          .subtitle { font-size: 24px; color: #1e40af; }
          .name { font-size: 28px; font-weight: bold; color: #1f2937; }
          .course { font-size: 24px; color: #1f2937; }
          .date { font-size: 16px; color: #6b7280; }
          .number { font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="subtitle">Byway Learning Platform</div>
          <div class="title">Certificate of Completion</div>
          <p>This is to certify that</p>
          <div class="name">{{studentName}}</div>
          <p>has successfully completed the course</p>
          <div class="course">{{courseTitle}}</div>
          <div class="date">Completed on {{completionDate}}</div>
          <div class="date">Issued on {{issuedDate}}</div>
          <div class="number">Certificate #: {{certificateNumber}}</div>
        </div>
      </body>
      </html>
    `;
  }
} 