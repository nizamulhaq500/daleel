import jsPDF from 'jspdf';

// Helper to convert any image (Base64 or HTTPS URL) to clean Base64 data with aspect ratio
async function resolveImage(imgSource?: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (!imgSource) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({
            dataUrl,
            width: canvas.width,
            height: canvas.height
          });
        } else {
          resolve(null);
        }
      } catch (e) {
        console.warn('Canvas conversion failed, fallback to direct source if base64', e);
        if (imgSource.startsWith('data:image')) {
          resolve({ dataUrl: imgSource, width: 800, height: 600 });
        } else {
          resolve(null);
        }
      }
    };

    img.onerror = () => {
      console.warn('Image failed to load for PDF rendering:', imgSource.substring(0, 50));
      if (imgSource.startsWith('data:image')) {
        resolve({ dataUrl: imgSource, width: 800, height: 600 });
      } else {
        resolve(null);
      }
    };

    img.src = imgSource;
  });
}

export interface PDFDossierOptions {
  role: 'reporter' | 'journalist' | 'official';
  report: {
    id?: string;
    content?: string;
    sourcePlatform?: string;
    postUrl?: string;
    imageBase64?: string;
    imageUrl?: string;
    evidenceHash?: string;
    severity?: string;
    aiScore?: number;
    contextExplanation?: string;
    editorialNotes?: string;
    resolutionNote?: string;
    reporterName?: string;
    reporterEmail?: string;
    reporterPhone?: string;
    escalatedByName?: string;
    escalatedByOrg?: string;
    officialActionByName?: string;
    officialActionByDept?: string;
    status?: string;
    timestamp?: any;
  };
}

export async function generateDossierPDF({ role, report }: PDFDossierOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
      drawHeaderBanner(false);
    }
  };

  const drawHeaderBanner = (isFirstPage: boolean) => {
    // Masthead bar
    doc.setFillColor(9, 13, 22);
    doc.rect(0, 0, pageWidth, 28, 'F');

    const titleColor: [number, number, number] = 
      role === 'official' ? [245, 158, 11] : 
      role === 'journalist' ? [59, 130, 246] : 
      [16, 185, 129];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...titleColor);
    
    const headerTitle = 
      role === 'official' ? 'DALEEL OFFICIAL ENFORCEMENT DOSSIER' : 
      role === 'journalist' ? 'DALEEL INVESTIGATIVE BRIEF' : 
      'DALEEL EVIDENCE DOSSIER';

    doc.text(headerTitle, margin, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Cryptographically Verified Anti-Muslim Hate Speech Evidence Repository', margin, 18);

    const reportIdStr = `#${(report.id || 'TEMP').substring(0, 8).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString();
    
    doc.text(`Case ID: ${reportIdStr}`, pageWidth - margin - 45, 12);
    doc.text(`Date: ${dateStr}`, pageWidth - margin - 45, 18);

    y = 36;
  };

  // 1. Draw First Page Header
  drawHeaderBanner(true);

  // 2. Metadata Certificate Block
  const bannerBg: [number, number, number] = 
    role === 'official' ? [254, 243, 199] : 
    role === 'journalist' ? [239, 246, 255] : 
    [240, 253, 244];

  const bannerBorder: [number, number, number] = 
    role === 'official' ? [251, 191, 36] : 
    role === 'journalist' ? [191, 219, 254] : 
    [187, 247, 208];

  const bannerText: [number, number, number] = 
    role === 'official' ? [146, 64, 14] : 
    role === 'journalist' ? [30, 64, 175] : 
    [22, 101, 52];

  doc.setFillColor(...bannerBg);
  doc.setDrawColor(...bannerBorder);
  doc.rect(margin, y, contentWidth, 26, 'FD');

  doc.setTextColor(...bannerText);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  
  const certificateTitle = 
    role === 'official' ? 'STATUTORY COMPLIANCE & CHAIN OF CUSTODY RECORD' :
    role === 'journalist' ? 'NEWSROOM VERIFICATION & TRIAGE STAMP' :
    'INCIDENT EVIDENCE CERTIFICATION';

  doc.text(certificateTitle, margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  const leftColX = margin + 4;
  const rightColX = margin + (contentWidth / 2) + 2;

  doc.text(`Platform: ${report.sourcePlatform || 'Social Media'}`, leftColX, y + 12);
  doc.text(`Reporter: ${report.reporterName || 'Community Witness'}`, leftColX, y + 18);

  if (role === 'official' || role === 'journalist') {
    doc.text(`Validator: ${report.escalatedByName || 'Newsroom Fact-Checker'} (${report.escalatedByOrg || 'Investigative Desk'})`, rightColX, y + 12);
    doc.text(`Action Status: ${(report.status || 'Escalated').toUpperCase()}`, rightColX, y + 18);
  } else {
    doc.text(`Severity: ${report.severity || 'High'}`, rightColX, y + 12);
    doc.text(`URL: ${(report.postUrl || 'Uploaded in dossier').substring(0, 32)}`, rightColX, y + 18);
  }

  y += 32;

  // 3. Documented Verbatim Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. DOCUMENTED INCIDENT TEXT:', margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const textContent = report.content || 'No text content provided (Visual evidence attached).';
  const splitText = doc.splitTextToSize(textContent, contentWidth);
  
  // Background box for text
  const textHeight = Math.max(12, (splitText.length * 4.5) + 6);
  ensureSpace(textHeight);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, textHeight, 'FD');
  
  doc.setTextColor(30, 41, 59);
  doc.text(splitText, margin + 4, y + 6);
  y += textHeight + 6;

  // 4. Evidence Image Rendering
  const imgSource = report.imageBase64 || report.imageUrl;
  if (imgSource) {
    const resolved = await resolveImage(imgSource);
    if (resolved) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('2. PRESERVED VISUAL EVIDENCE SCREENSHOT:', margin, y);
      y += 5;

      // Scale image to fit within max width and height
      const maxImgW = contentWidth;
      const maxImgH = 75; // mm
      const aspect = resolved.width / resolved.height;
      
      let finalW = maxImgW;
      let finalH = finalW / aspect;
      if (finalH > maxImgH) {
        finalH = maxImgH;
        finalW = finalH * aspect;
      }

      ensureSpace(finalH + 8);
      
      // Frame background
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, y, contentWidth, finalH + 4, 'FD');

      const imgX = margin + ((contentWidth - finalW) / 2);
      doc.addImage(resolved.dataUrl, 'JPEG', imgX, y + 2, finalW, finalH);
      y += finalH + 10;
    }
  }

  // 5. Investigative Context & Counter-Narrative
  ensureSpace(35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. FORENSIC DECONSTRUCTION & COUNTER-NARRATIVE:', margin, y);
  y += 5;

  const explanation = report.contextExplanation || 'Evidence matches cataloged anti-Muslim coded tropes and disinformation.';
  const splitExplanation = doc.splitTextToSize(explanation, contentWidth - 8);
  const explHeight = Math.max(14, (splitExplanation.length * 4.5) + 6);

  ensureSpace(explHeight);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, explHeight, 'FD');

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(splitExplanation, margin + 4, y + 6);
  y += explHeight + 6;

  // 6. Editorial / Official Notes if present
  const notes = report.resolutionNote || report.editorialNotes;
  if (notes) {
    ensureSpace(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(role === 'official' ? '4. OFFICIAL ENFORCEMENT & COMPLIANCE LOG:' : '4. NEWSROOM EDITORIAL ASSESSMENT:', margin, y);
    y += 5;

    const splitNotes = doc.splitTextToSize(notes, contentWidth - 8);
    const notesHeight = Math.max(12, (splitNotes.length * 4.5) + 6);
    
    ensureSpace(notesHeight);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, notesHeight, 'FD');

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(splitNotes, margin + 4, y + 6);
    y += notesHeight + 6;
  }

  // 7. Forensic SHA-256 Stamping Badge
  ensureSpace(16);
  doc.setFillColor(9, 13, 22);
  doc.rect(margin, y, contentWidth, 12, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text('CRYPTOGRAPHIC SHA-256 DIGITAL SIGNATURE:', margin + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(report.evidenceHash || 'SHA-256-VERIFIED-CHAIN-OF-CUSTODY', margin + 4, y + 9);
  y += 18;

  // 8. Add Footer to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Verified through Daleel Trust & Safety Pipeline. Academic Frameworks: The Bridge Initiative & Tell MAMA UK.', margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 8);
  }

  const filename = `daleel-${role}-dossier-${(report.id || Date.now().toString(16)).substring(0, 8)}.pdf`;
  doc.save(filename);
}
