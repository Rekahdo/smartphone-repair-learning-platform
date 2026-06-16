import jsPDF from "jspdf";
import { levels, tools, certificates } from "../data/curriculum";
import type { Progress, Tools } from "../state/AppContext";

type Summary = {
  name: string;
  date: string;
  xp: number;
  streak: number;
  repairs: number;
  diagnostics: number;
  completed: number;
  totalLessons: number;
  toolsMastered: number;
  currentLevel: number;
  progress: Progress;
  toolState: Tools;
};

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number, fontSize = 11): number {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function downloadCurriculumPDF() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  // Cover header
  doc.setFillColor(10, 20, 48);
  doc.rect(0, 0, pageW, 180, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("RepairMaster Academy", margin, y + 30);
  doc.setFontSize(14);
  doc.text("Smartphone Repair Learning Curriculum", margin, y + 58);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("From Beginner to Advanced Board-Level Technician", margin, y + 82);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y + 102);
  doc.setTextColor(120, 180, 255);
  doc.text("repairmaster.academy · Interactive Training Platform", margin, y + 122);

  y = 210;

  // Intro
  doc.setTextColor(20, 30, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Program Overview", margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = addWrappedText(
    doc,
    "RepairMaster Academy transforms complete beginners into job-ready smartphone repair technicians through a structured 3-level curriculum. Students learn by combining interactive theory, diagnostic simulators, repair workflow practice, and real hands-on disassembly experience.",
    margin,
    y,
    pageW - margin * 2,
    14,
  );
  y += 18;

  // Roadmap table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Recommended Learning Roadmap", margin, y);
  y += 20;

  const roadmap = [
    ["Stage 1", "0-30 Days", "Comfortable opening & assembling phones"],
    ["Stage 2", "1-3 Months", "Master software repairs and flashing"],
    ["Stage 3", "3-6 Months", "Competent hardware repair technician"],
    ["Stage 4", "6-12 Months", "Board-level diagnosis & schematics"],
    ["Stage 5", "12-24 Months", "Advanced micro-soldering technician"],
  ];

  doc.setFontSize(10);
  roadmap.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 240 : 250, 245, 250);
    doc.rect(margin, y - 10, pageW - margin * 2, 28, "F");
    doc.setTextColor(20, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.text(row[0], margin + 8, y);
    doc.setFont("helvetica", "normal");
    doc.text(row[1], margin + 90, y);
    doc.text(row[2], margin + 180, y);
    y += 28;
  });

  // --- Levels & Modules ---
  levels.forEach((lvl, li) => {
    doc.addPage();
    y = margin;

    doc.setFillColor(10, 20, 48);
    doc.rect(0, 0, pageW, 80, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${lvl.badge}  ${lvl.title}`, margin, y + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(lvl.tagline, margin, y + 42);
    y = 110;

    lvl.modules.forEach((mod) => {
      doc.setTextColor(20, 30, 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`${mod.icon}  ${mod.title}`, margin, y);
      y += 16;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(80, 90, 120);
      doc.text(mod.subtitle, margin, y);
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(40, 50, 80);
      mod.lessons.forEach((ls, i) => {
        const prefix = `${String(i + 1).padStart(2, "0")}.`;
        doc.text(`${prefix} ${ls.title}`, margin + 12, y);
        doc.setTextColor(120, 130, 160);
        doc.text(`[${ls.type.toUpperCase()}] ${ls.duration} · +${ls.xp} XP`, pageW - margin - 180, y);
        doc.setTextColor(40, 50, 80);
        y += 14;
        if (y > 760) {
          doc.addPage();
          y = margin;
        }
      });
      y += 10;
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
    });

    // small footer for each level page
    if (li < levels.length - 1) {
      doc.setFontSize(9);
      doc.setTextColor(150, 160, 180);
      doc.text(`RepairMaster Academy · Level ${li + 1} / 3`, margin, 810);
    }
  });

  // --- Tools ---
  doc.addPage();
  y = margin;
  doc.setFillColor(10, 20, 48);
  doc.rect(0, 0, pageW, 80, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("🧰  Required Tool Bench", margin, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Master each tool from purchased → practiced → mastered.", margin, y + 42);
  y = 110;

  tools.forEach((t, i) => {
    doc.setFillColor(i % 2 === 0 ? 240 : 250, 245, 250);
    doc.rect(margin, y - 10, pageW - margin * 2, 40, "F");
    doc.setTextColor(20, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${t.icon}  ${t.name}`, margin + 8, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 70, 100);
    doc.text(t.purpose, margin + 8, y + 14);
    doc.text(`Difficulty: ${t.difficulty} / 5`, pageW - margin - 100, y + 14);
    y += 40;
    if (y > 770 && i < tools.length - 1) {
      doc.addPage();
      y = margin;
    }
  });

  // --- Certificates ---
  doc.addPage();
  y = margin;
  doc.setFillColor(10, 20, 48);
  doc.rect(0, 0, pageW, 80, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("🏆  Certification Program", margin, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Earn industry-recognized certificates at each milestone.", margin, y + 42);
  y = 110;

  certificates.forEach((c, i) => {
    doc.setFillColor(245, 248, 255);
    doc.rect(margin, y - 10, pageW - margin * 2, 60, "F");
    doc.setDrawColor(50, 80, 180);
    doc.setLineWidth(1);
    doc.rect(margin, y - 10, pageW - margin * 2, 60);
    doc.setTextColor(20, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`${c.icon}  ${c.name}`, margin + 12, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 70, 100);
    doc.text(`Requirement: ${c.requirement}`, margin + 12, y + 22);
    doc.text("Minimum score: 80% on final assessment", margin + 12, y + 38);
    y += 70;
    if (y > 760 && i < certificates.length - 1) {
      doc.addPage();
      y = margin;
    }
  });

  // --- Footer page ---
  doc.addPage();
  y = margin + 100;
  doc.setFillColor(10, 20, 48);
  doc.rect(0, 0, pageW, pageW, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Ready to Start?", margin, y);
  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Open RepairMaster Academy in your browser to track progress,", margin, y);
  y += 18;
  doc.text("practice with interactive simulators, and earn your first certificate.", margin, y);
  y += 40;
  doc.setTextColor(120, 180, 255);
  doc.setFontSize(11);
  doc.text("repairmaster.academy", margin, y);
  y += 18;
  doc.setTextColor(180, 190, 210);
  doc.setFontSize(10);
  doc.text(`Curriculum version 1.0 · Printed ${new Date().toLocaleDateString()}`, margin, y);

  doc.save("RepairMaster-Academy-Curriculum.pdf");
}

export function downloadCertificatePDF(certName: string, summary: Summary) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // decorative border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(4);
  doc.rect(30, 30, pageW - 60, pageH - 60);
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(1);
  doc.rect(46, 46, pageW - 92, pageH - 92);

  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageW, pageH, "F");

  // seal / badge
  doc.setFillColor(37, 99, 235);
  doc.circle(pageW / 2, 130, 50, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.text("RM", pageW / 2 - 22, 142);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("RepairMaster Academy", pageW / 2, 200, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text("CERTIFICATE OF ACHIEVEMENT", pageW / 2, 222, { align: "center" });

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(summary.name, pageW / 2, 290, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("has successfully completed the requirements for the", pageW / 2, 320, { align: "center" });

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text(certName, pageW / 2, 360, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("certification program, demonstrating competency in smartphone repair theory,", pageW / 2, 395, { align: "center" });
  doc.text("hands-on diagnostics, and practical troubleshooting techniques.", pageW / 2, 415, { align: "center" });

  // stats row
  const stats = [
    ["Lessons", `${summary.completed} / ${summary.totalLessons}`],
    ["Total XP", String(summary.xp)],
    ["Tools Mastered", String(summary.toolsMastered)],
    ["Repairs", String(summary.repairs)],
    ["Diagnostics", String(summary.diagnostics)],
    ["Streak", `${summary.streak} days`],
  ];

  const cellW = 120;
  const startX = (pageW - cellW * stats.length) / 2;
  stats.forEach((s, i) => {
    const cx = startX + i * cellW;
    doc.setFillColor(239, 246, 255);
    doc.rect(cx, 450, cellW - 6, 50, "F");
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(10);
    doc.text(s[0], cx + cellW / 2 - 3, 470, { align: "center" });
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(s[1], cx + cellW / 2 - 3, 490, { align: "center" });
    doc.setFont("helvetica", "normal");
  });

  // signatures
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.8);
  doc.line(120, pageH - 120, 300, pageH - 120);
  doc.line(pageW - 300, pageH - 120, pageW - 120, pageH - 120);
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
  doc.text("Lead Instructor", 210, pageH - 104, { align: "center" });
  doc.text("Academy Director", pageW - 210, pageH - 104, { align: "center" });
  doc.text(`Issued: ${summary.date}`, pageW / 2, pageH - 70, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`RepairMaster Academy · Certificate ID: RM-${Date.now().toString().slice(-8)}`, pageW / 2, pageH - 50, { align: "center" });

  doc.save(`RepairMaster-${certName.replace(/\s+/g, "-")}.pdf`);
}

export function downloadProgressReport(summary: Summary) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  doc.setFillColor(10, 20, 48);
  doc.rect(0, 0, pageW, 120, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Student Progress Report", margin, y + 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Student: ${summary.name}`, margin, y + 54);
  doc.text(`Generated: ${summary.date}`, margin, y + 74);

  y = 160;

  const stats = [
    ["Current Level", `Level ${summary.currentLevel}`],
    ["Overall Progress", `${Math.round((summary.completed / summary.totalLessons) * 100)}%`],
    ["Lessons Completed", `${summary.completed} / ${summary.totalLessons}`],
    ["Total XP Earned", summary.xp.toLocaleString()],
    ["Tools Mastered", `${summary.toolsMastered} / ${tools.length}`],
    ["Repairs Logged", String(summary.repairs)],
    ["Diagnostics Solved", String(summary.diagnostics)],
    ["Current Streak", `${summary.streak} days`],
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 30, 60);
  doc.text("Performance Summary", margin, y);
  y += 20;

  stats.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 240 : 250, 245, 250);
    doc.rect(margin, y - 10, pageW - margin * 2, 26, "F");
    doc.setTextColor(20, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(row[0], margin + 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(row[1], pageW - margin - 120, y);
    y += 26;
  });

  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Per-Level Progress", margin, y);
  y += 20;

  levels.forEach((lvl) => {
    const totalL = lvl.modules.reduce((a, m) => a + m.lessons.length, 0);
    const doneL = lvl.modules.reduce(
      (a, m) => a + m.lessons.filter((ls) => summary.progress[ls.id]?.completed).length,
      0,
    );
    const pct = Math.round((doneL / totalL) * 100);
    doc.setFillColor(245, 248, 255);
    doc.rect(margin, y - 10, pageW - margin * 2, 36, "F");
    doc.setTextColor(20, 30, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${lvl.badge} ${lvl.title}`, margin + 10, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${doneL} / ${totalL} lessons (${pct}%)`, pageW - margin - 150, y);

    // bar
    const barX = margin + 10;
    const barY = y + 6;
    const barW = pageW - margin * 2 - 20;
    doc.setFillColor(220, 230, 245);
    doc.rect(barX, barY, barW, 6, "F");
    doc.setFillColor(37, 99, 235);
    doc.rect(barX, barY, (barW * pct) / 100, 6, "F");
    y += 46;
  });

  doc.save(`RepairMaster-Progress-Report-${summary.date.replace(/\//g, "-")}.pdf`);
}
