import { createCanvas, loadImage } from "canvas";
import { PDFDocument } from "pdf-lib";
import path from "path";
import {
  CertificatePdfServiceInterface,
  CertificateTemplateData,
} from "../../../app/providers/generate-certificate.interface";

export class CertificatePdfService implements CertificatePdfServiceInterface {
  private readonly _platformName: string;
  private readonly _certificateTemplate: string;

  constructor(platformName: string = "Byway Learning Platform") {
    this._platformName = platformName;
    this._certificateTemplate = this.getTemplatePath();
  }

  async generateCertificatePDF(data: CertificateTemplateData): Promise<Buffer> {
    try {
      // Load the certificate template image
      const templatePath = this._certificateTemplate;
      const image = await loadImage(templatePath);

      // Create canvas with same dimensions as template
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      // Draw base certificate image
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Set text properties
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";

      // Student Name - clearly below "PRESENTED TO:"
      ctx.font = "bold 70px Arial";
      ctx.fillText(data.studentName, image.width / 2, 620);

      // Course Name - smaller and spaced below student name
      ctx.font = "32px Arial";
      ctx.fillText(data.courseTitle, image.width / 2, 760);

      // Instructor Name - left aligned
      ctx.textAlign = "left";
      ctx.font = "bold 32px Arial";
      const instructorName = data.instructorName || "Course Instructor";
      ctx.fillText(instructorName, 470, 1135);

      // Date - bottom right
      const issuedDate =
        data.issuedDate || new Date().toLocaleDateString("en-GB");
      ctx.font = "20px Arial";
      ctx.textAlign = "right";
      ctx.fillText(issuedDate, image.width - 60, image.height - 35);

      // Certificate Number - top right
      ctx.font = "16px Arial";
      ctx.textAlign = "right";
      ctx.fillText(
        `Certificate No: ${data.certificateNumber}`,
        image.width - 60,
        80
      );

      // Convert canvas to PNG buffer
      const pngBuffer = canvas.toBuffer("image/png");

      // Create PDF and embed the image
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([image.width, image.height]);
      const pngImage = await pdfDoc.embedPng(pngBuffer);

      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      // Save PDF as buffer
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch {
      throw new Error("Failed to generate certificate PDF");
    }
  }

  generateCertificatePDFStream(data: CertificateTemplateData): never {
    throw new Error("Streaming not implemented for image-based certificates");
  }

  private getTemplatePath(): string {
    // Path to your certificate template image
    return path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "public",
      "certificate_template.png"
    );
  }

  private getDefaultTemplate(): string {
    // This method is no longer needed but kept for interface compatibility
    return "";
  }
}
