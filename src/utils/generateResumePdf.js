// Generates a genuine, text-selectable one-page PDF resume from the same
// data that drives the interactive site, so the two never drift apart.
// jsPDF is loaded on demand so its ~200kB doesn't sit in the main bundle
// for the vast majority of visits that never open the resume modal.
export async function generateResumePdf({ candidate, experience, projects, skillsCategories, certifications }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 56;

  const GREEN = [29, 185, 84];
  const INK = [20, 20, 20];
  const MUTED = [110, 110, 110];

  const ensureSpace = (needed) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = 56;
    }
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text(candidate.name, margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(...GREEN);
  doc.text(candidate.role, margin, y);
  y += 16;

  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  const contactLine = [candidate.location, candidate.email, candidate.linkedin, candidate.github]
    .filter(Boolean)
    .join("   ·   ");
  doc.text(doc.splitTextToSize(contactLine, contentWidth), margin, y);
  y += 22;

  doc.setDrawColor(...GREEN);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("SUMMARY", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const bioLines = doc.splitTextToSize(candidate.bio, contentWidth);
  doc.text(bioLines, margin, y);
  y += bioLines.length * 12.5 + 16;

  // Stats row
  if (candidate.stats?.length) {
    const colW = contentWidth / candidate.stats.length;
    candidate.stats.forEach((s, i) => {
      const x = margin + i * colW;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...GREEN);
      doc.text(s.value, x, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(s.label.toUpperCase(), x, y + 12);
    });
    y += 32;
  }

  const sectionHeader = (title) => {
    ensureSpace(30);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(title, margin, y);
    y += 14;
  };

  // Experience
  if (experience?.length) {
    sectionHeader("EXPERIENCE");
    experience.forEach((exp) => {
      ensureSpace(50);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      doc.text(`${exp.role} — ${exp.company}`, margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      const periodText = `${exp.period}${exp.location ? " · " + exp.location : ""}`;
      doc.text(periodText, pageWidth - margin, y, { align: "right" });
      y += 13;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      const descLines = doc.splitTextToSize(exp.description, contentWidth);
      doc.text(descLines, margin, y);
      y += descLines.length * 11.5 + 2;

      (exp.highlights || []).forEach((h) => {
        ensureSpace(14);
        const lines = doc.splitTextToSize(`•  ${h}`, contentWidth - 10);
        doc.text(lines, margin + 6, y);
        y += lines.length * 11.5;
      });
      y += 12;
    });
  }

  // Shipped models / projects
  if (projects?.length) {
    sectionHeader("SHIPPED MODELS");
    projects.forEach((p) => {
      ensureSpace(46);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...INK);
      doc.text(p.title, margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(p.architecture, pageWidth - margin, y, { align: "right" });
      y += 12;

      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      const lines = doc.splitTextToSize(p.description, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 11.5 + 3;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(p.stack.join("  ·  "), margin, y);
      y += 16;
    });
  }

  // Skills
  if (skillsCategories?.length) {
    sectionHeader("SKILLS");
    skillsCategories.forEach((cat) => {
      ensureSpace(28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(cat.category, margin, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      const line = cat.skills.map((s) => `${s.name} (${s.level})`).join("   ·   ");
      const lines = doc.splitTextToSize(line, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 11 + 10;
    });
  }

  // Certifications
  if (certifications?.length) {
    sectionHeader("CERTIFICATIONS");
    certifications.forEach((c) => {
      ensureSpace(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(c.title, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(c.date, pageWidth - margin, y, { align: "right" });
      y += 12;
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 90);
      doc.text(`${c.issuer}   ·   ${c.credentialId}`, margin, y);
      y += 16;
    });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(`Generated from the live portfolio · ${new Date().toLocaleDateString()}`, margin, footerY);

  doc.save(`${candidate.name.replace(/\s+/g, "_")}_Resume.pdf`);
}
