const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require("canvas");
const { PDFDocument } = require("pdf-lib");
const path = require("path");

async function generateCertificate(
  studentName,
  courseName,
  tutorName,
  courseProvider,
  outputPath
) {
  const templatePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "certificate_template.png"
  );

  const image = await loadImage(templatePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // Draw base certificate image
  ctx.drawImage(image, 0, 0, image.width, image.height);

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";

  // ✅ Student Name - clearly below "PRESENTED TO:"zx
  ctx.font = "bold 70px Arial";
  ctx.fillText(studentName, image.width / 2, 620);

  // ✅ Course Name - smaller and spaced below student name
  ctx.font = "32px Arial";
  ctx.fillText(courseName, image.width / 2, 760);

  // ✅ Tutor Name - left aligned
  ctx.textAlign = "left";
  ctx.font = "bold 32px Arial";
  ctx.fillText(tutorName, 470, 1135);

  // ✅ Date - bottom right
  const today = new Date();
  const issuedDate = today.toLocaleDateString("en-GB");
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(issuedDate, image.width - 60, image.height - 35);

  // Convert to PNG and embed in PDF
  const pngBuffer = canvas.toBuffer("image/png");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([image.width, image.height]);
  const pngImage = await pdfDoc.embedPng(pngBuffer);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`✅ Certificate saved as ${outputPath}`);
}

// Example usage
generateCertificate(
  "Rashin KP",
  "MongoDB Professional Course",
  "Mr. John Mathew",
  "Byway Institute",
  "Rashin_Certificate.pdf"
);
