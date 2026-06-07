import jsPDF from "jspdf";

export function generateTripPDF({
  source, destination, budget, mood, days,
  itinerary, total_places, estimated_activity_cost,
  match_score, summary, totalKm, travelHours,
  travelCost, foodCost, stayCost, actCost,
  totalSpend, remaining, route, theme,
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // ── Color helpers ────────────────────────────────────────────
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [37, 99, 235];
  }

  const primaryRgb = hexToRgb(theme?.primary || "#2563eb");

  function setColor(r, g, b) { doc.setTextColor(r, g, b); }
  function setFill(r, g, b)  { doc.setFillColor(r, g, b); }
  function setDraw(r, g, b)  { doc.setDrawColor(r, g, b); }
  function setPrimary()      { setColor(...primaryRgb); }
  function setDark()         { setColor(30, 41, 59); }
  function setMuted()        { setColor(100, 116, 139); }
  function setWhite()        { setColor(255, 255, 255); }

  function checkPage(needed = 20) {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  }

  function drawRect(x, ry, w, h, r, g, b) {
    setFill(r, g, b);
    doc.rect(x, ry, w, h, "F");
  }

  function drawLine(ry, r = 226, g = 232, b = 240) {
    setDraw(r, g, b);
    doc.setLineWidth(0.3);
    doc.line(margin, ry, pageWidth - margin, ry);
  }

  // ════════════════════════════════════════════════
  // HEADER BAND
  // ════════════════════════════════════════════════
  drawRect(0, 0, pageWidth, 42, ...primaryRgb);
  setWhite();
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SmartRoute AI", margin, 16);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Intelligent Travel Companion  —  Trip Report", margin, 24);
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, margin, 32);
  y = 52;

  // ════════════════════════════════════════════════
  // TRIP TITLE
  // ════════════════════════════════════════════════
  setMuted();
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TRIP SUMMARY", margin, y);
  y += 7;

  setDark();
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${source}  →  ${destination}`, margin, y);
  y += 7;

  setMuted();
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${days}-day ${mood} trip  ·  ₹${Number(budget).toLocaleString()} total budget`, margin, y);
  y += 10;

  drawLine(y);
  y += 8;

  // ════════════════════════════════════════════════
  // STAT STRIP
  // ════════════════════════════════════════════════
  const statW = contentWidth / 4;
  const stats = [
    { label: "DISTANCE",    value: `${totalKm} km` },
    { label: "TRAVEL TIME", value: `${travelHours} hrs` },
    { label: "PLACES",      value: String(total_places) },
    { label: "MATCH SCORE", value: `${match_score}%` },
  ];

  drawRect(margin, y, contentWidth, 20, 248, 250, 252);
  setDraw(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 20);

  stats.forEach((s, i) => {
    const x = margin + i * statW + statW / 2;
    setPrimary();
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(s.value, x, y + 8, { align: "center" });
    setMuted();
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(s.label, x, y + 15, { align: "center" });
  });
  y += 28;

  // ════════════════════════════════════════════════
  // MATCH SCORE + INSIGHT
  // ════════════════════════════════════════════════
  drawRect(margin, y, contentWidth, 14, ...hexToRgb(theme?.light || "#eff6ff"));
  setPrimary();
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const insightText = summary.budget_status === "Within budget"
    ? `✓  This plan stays within your ₹${Number(budget).toLocaleString()} budget.  ${summary.recommendation}.`
    : `⚠  Activity costs may exceed budget. Consider reducing days or activities.`;
  doc.text(insightText, margin + 4, y + 9);
  y += 22;

  // ════════════════════════════════════════════════
  // ITINERARY
  // ════════════════════════════════════════════════
  checkPage(20);
  setMuted();
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("SMART ITINERARY", margin, y);
  y += 8;

  itinerary.forEach((day) => {
    checkPage(16);

    // Day header
    drawRect(margin, y, contentWidth, 10, 30, 41, 59);
    setWhite();
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Day ${day.day}`, margin + 4, y + 7);
    y += 14;

    const slots = Object.entries(day.slots);
    slots.forEach(([slot, places]) => {
      if (places.length === 0) return;

      checkPage(14);

      // Slot label
      setPrimary();
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1);
      const slotTime  = slot === "morning" ? "6 AM – 12 PM" : slot === "afternoon" ? "12 PM – 5 PM" : "5 PM – 9 PM";
      doc.text(`${slotLabel}  `, margin + 2, y + 5);
      setMuted();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(slotTime, margin + 22, y + 5);
      y += 8;

      places.forEach((place) => {
        checkPage(10);
        drawRect(margin, y, contentWidth, 9, 248, 250, 252);
        setDraw(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.rect(margin, y, contentWidth, 9);

        // Dot
        setFill(...primaryRgb);
        doc.circle(margin + 5, y + 4.5, 1.2, "F");

        setDark();
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text(place.name, margin + 10, y + 5.5);

        // Cost
        const costText = place.cost === 0 ? "Free" : `₹${place.cost}`;
        setMuted();
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.text(costText, pageWidth - margin - 2, y + 5.5, { align: "right" });

        // Type badge
        setPrimary();
        doc.setFontSize(6.5);
        doc.text(place.type, margin + 10, y + 8.5);

        y += 11;
      });

      y += 2;
    });
    y += 4;
  });

  // ════════════════════════════════════════════════
  // BUDGET BREAKDOWN
  // ════════════════════════════════════════════════
  checkPage(60);
  drawLine(y);
  y += 8;

  setMuted();
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BUDGET BREAKDOWN", margin, y);
  y += 8;

  const budgetItems = [
    { label: "Transport",  amount: travelCost, pct: 35 },
    { label: "Food",       amount: foodCost,   pct: 25 },
    { label: "Stay",       amount: stayCost,   pct: 25 },
    { label: "Activities", amount: actCost,    pct: Math.round((actCost / Number(budget)) * 100) },
  ];

  budgetItems.forEach((item) => {
    checkPage(12);
    setDark();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, margin, y + 4);

    // Bar background
    const barX = margin + 28;
    const barW = contentWidth - 50;
    drawRect(barX, y, barW, 5, 241, 245, 249);

    // Bar fill
    setFill(...primaryRgb);
    doc.rect(barX, y, barW * (Math.min(item.pct, 100) / 100), 5, "F");

    // Amount
    setDark();
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${item.amount.toLocaleString()}`, pageWidth - margin, y + 4, { align: "right" });

    setMuted();
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`${item.pct}%`, barX + barW + 2, y + 4);

    y += 12;
  });

  // Budget status
  checkPage(12);
  const statusBg = remaining >= 0 ? [240, 253, 244] : [254, 242, 242];
  const statusColor = remaining >= 0 ? [22, 101, 52] : [153, 27, 27];
  drawRect(margin, y, contentWidth, 10, ...statusBg);
  doc.setTextColor(...statusColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const statusText = remaining >= 0
    ? `✓  Within budget  —  ₹${remaining.toLocaleString()} remaining`
    : `⚠  Over budget by ₹${Math.abs(remaining).toLocaleString()}`;
  doc.text(statusText, margin + 4, y + 7);
  setMuted();
  doc.setFont("helvetica", "normal");
  doc.text(`Total: ₹${totalSpend.toLocaleString()} / ₹${Number(budget).toLocaleString()}`, pageWidth - margin - 4, y + 7, { align: "right" });
  y += 18;

  // ════════════════════════════════════════════════
  // SMART ROUTE
  // ════════════════════════════════════════════════
  checkPage(40);
  drawLine(y);
  y += 8;

  setMuted();
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("SMART ROUTE", margin, y);
  y += 8;

  drawRect(margin, y, contentWidth, 22, 248, 250, 252);
  setDraw(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, 22);

  setPrimary();
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${route.type} Route  —  Recommended`, margin + 4, y + 8);

  setMuted();
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const wrappedReason = doc.splitTextToSize(route.reason, contentWidth - 8);
  doc.text(wrappedReason, margin + 4, y + 15);
  y += 30;

  // ════════════════════════════════════════════════
  // FINAL INSIGHT
  // ════════════════════════════════════════════════
  checkPage(30);
  drawRect(margin, y, contentWidth, 28, 30, 41, 59);
  setWhite();
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("FINAL INSIGHT", margin + 4, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const insightFull = `This itinerary covers ${total_places} locations across ${days} days in ${destination} with an optimised ${route.type} route. ${summary.budget_status === "Within budget" ? `The plan stays within your ₹${Number(budget).toLocaleString()} budget with ₹${remaining.toLocaleString()} to spare.` : "Consider trimming activities to stay within budget."} Match score: ${match_score}%.`;
  const wrappedInsight = doc.splitTextToSize(insightFull, contentWidth - 8);
  doc.text(wrappedInsight, margin + 4, y + 15);
  y += 36;

  // ════════════════════════════════════════════════
  // FOOTER ON EVERY PAGE
  // ════════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawRect(0, 287, pageWidth, 10, 30, 41, 59);
    setWhite();
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("SmartRoute AI  —  Intelligent Travel Companion", margin, 293);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 293, { align: "right" });
  }

  // ════════════════════════════════════════════════
  // SAVE
  // ════════════════════════════════════════════════
  doc.save(`SmartRoute_${source}_to_${destination}.pdf`);
}