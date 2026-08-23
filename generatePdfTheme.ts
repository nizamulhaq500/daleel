export const generatePdfTheme = \`
  // Add dark header background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');
  
  // Header Text
  doc.setFontSize(24);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.setFont("helvetica", "bold");
  doc.text('Daleel', 20, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text('Official Evidence & Escalation Report', 20, 30);
\`;
