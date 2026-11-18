// Lời thuyết trình (speaker notes) → Word
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, TabStopType, Footer, PageNumber, PositionalTab,
  PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader, HeadingLevel,
} = require("docx");

const OUT = process.argv[2];
const NOTES = JSON.parse(fs.readFileSync(path.join(__dirname, "notes.json"), "utf8"));
const COL = { navy: "0E2F7A", blue: "163F9F", orange: "F58220", green: "1E7B34", teal: "0F7C7C", slate: "40516B", muted: "6B7890", border: "D9E2F1", text: "122033" };
const SPEAKER = { "THÚY": COL.green, "DƯƠNG": COL.blue, "THẢO": COL.teal };
const TITLES = [
  "Hai nhân viên cùng xin nghỉ một ngày",
  "Em dựa vào đâu để quyết định?",
  "Nghe trước – đề xuất sau – hỏi lại",
  "Không ai thắng – không ai thua",
  "Nếu cả hai đều không thể đổi?",
  "Dẫn dắt bằng nguyên tắc, không bằng quyền lực",
];
const SCRIPT_TITLES = {
  "KỊCH BẢN ROLE-PLAY – CASE 1: THẢO ĐỒNG Ý ĐỔI NGÀY": "Role-play · Case 1: Thảo đồng ý đổi ngày",
  'KỊCH BẢN NHÁNH: NẾU THẢO CẢM THẤY "CHỊ BÊNH DƯƠNG"': "Role-play · Nhánh: Nếu Thảo cảm thấy “chị bênh Dương”",
  "KỊCH BẢN ROLE-PLAY – CASE 2: CẢ HAI ĐỀU KHÔNG ĐỒNG Ý ĐỔI": "Role-play · Case 2: Cả hai đều không đồng ý đổi",
};
const TAB = 1250; // cột tên người nói
const W = 9638;   // A4, lề 2 cm

const p = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [children], ...o });
const r = (text, o = {}) => new TextRun({ text, ...o });

function timeLabel(first) {
  const m = first.match(/~\s?(\d+)\s*giây/);
  const sec = m ? m[1] : "";
  const extra = /role-play/i.test(first) ? "  +  DIỄN ROLE-PLAY" : "";
  return p(r(`THỜI LƯỢNG ~${sec} GIÂY${extra}`, { size: 18, bold: true, color: COL.orange, characterSpacing: 20 }), { spacing: { after: 160 } });
}

function dialogueLine(line, state) {
  const m = line.match(/^(THÚY|DƯƠNG|THẢO)(?: \(([^)]*)\))?:\s*(.*)$/);
  if (m) {
    state.speaker = m[1];
    const runs = [r(m[1], { bold: true, color: SPEAKER[m[1]] }), r("\t")];
    if (m[2]) runs.push(r(`(${m[2]}) `, { italics: true, color: COL.muted }));
    runs.push(r(m[3]));
    return p(runs, { tabStops: [{ type: TabStopType.LEFT, position: TAB }], indent: { left: TAB, hanging: TAB }, spacing: { before: 100, after: 60 } });
  }
  // câu nói tiếp của cùng người
  return p(r(line), { indent: { left: TAB }, spacing: { after: 60 } });
}

function slideSection(i) {
  const out = [];
  const lines = NOTES[i].split("\n");
  out.push(p([r(`SLIDE ${i + 1}  ·  `, { color: COL.orange }), r(TITLES[i])], { heading: HeadingLevel.HEADING_1 }));
  out.push(timeLabel(lines[0]));

  let inScript = false;
  const state = {};
  let buf = [];
  const flushSpoken = () => {
    if (buf.length) out.push(p(r(buf.join(" ")), { spacing: { after: 160 } }));
    buf = [];
  };
  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (/^=+$/.test(line)) { flushSpoken(); continue; }
    if (SCRIPT_TITLES[line]) {
      flushSpoken();
      inScript = true;
      out.push(p(r(SCRIPT_TITLES[line]), { heading: HeadingLevel.HEADING_2 }));
      continue;
    }
    if (!inScript) {
      if (!line) flushSpoken(); else buf.push(line);
      continue;
    }
    if (!line) continue;
    let mm;
    if ((mm = line.match(/^\[(Bước[^\]]*)\]$/))) {
      out.push(p(r(mm[1], { bold: true, color: COL.orange }), { spacing: { before: 200, after: 60 }, keepNext: true }));
    } else if ((mm = line.match(/^\[(.*)\]$/))) {
      out.push(p(r(mm[1], { italics: true, color: COL.muted }), { spacing: { after: 120 } }));
    } else if ((mm = line.match(/^\((.*)\)$/))) {
      out.push(p(r(mm[1].replace("xem ghi chú slide 4", "xem phần Slide 4"), { italics: true, color: COL.muted }), { spacing: { before: 160, after: 120 } }));
    } else {
      out.push(dialogueLine(line, state));
    }
  }
  flushSpoken();
  return out;
}

// ---------- bảng thời lượng ----------
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: COL.border };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const widths = [1100, 6338, 2200];
const cell = (text, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders,
  shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [p(r(text, { bold: !!o.bold, color: o.color || COL.text, size: 21 }), { alignment: o.align })],
});
const secs = NOTES.map((n) => +(n.split("\n")[0].match(/~\s?(\d+)/) || [0, 0])[1]);
const total = secs.reduce((a, b) => a + b, 0);
const table = new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: widths,
  rows: [
    new TableRow({ tableHeader: true, children: [
      cell("Slide", widths[0], { bold: true, color: "FFFFFF", fill: COL.navy, align: AlignmentType.CENTER }),
      cell("Nội dung", widths[1], { bold: true, color: "FFFFFF", fill: COL.navy }),
      cell("Phần nói", widths[2], { bold: true, color: "FFFFFF", fill: COL.navy, align: AlignmentType.CENTER }),
    ] }),
    ...TITLES.map((t, i) => new TableRow({ children: [
      cell(String(i + 1), widths[0], { align: AlignmentType.CENTER }),
      cell(t + ([2, 3, 4].includes(i) ? "  (+ role-play)" : ""), widths[1]),
      cell(`~${secs[i]} giây`, widths[2], { align: AlignmentType.CENTER }),
    ] })),
    new TableRow({ children: [
      cell("", widths[0], { fill: "EAF1FF" }),
      cell("Tổng phần nói (chưa tính thời gian diễn role-play)", widths[1], { bold: true, fill: "EAF1FF" }),
      cell(`~${Math.floor(total / 60)} phút ${total % 60} giây`, widths[2], { bold: true, fill: "EAF1FF", align: AlignmentType.CENTER }),
    ] }),
  ],
});

const doc = new Document({
  creator: "Bài thi thăng cấp SM",
  title: "Lời thuyết trình – Tình huống 2",
  styles: {
    default: { document: { run: { font: "Arial", size: 24, color: COL.text }, paragraph: { spacing: { line: 300 } } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { font: "Arial", size: 40, bold: true, color: COL.navy }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Arial", size: 30, bold: true, color: COL.navy },
        paragraph: { spacing: { before: 440, after: 80 }, keepNext: true, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COL.border, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Arial", size: 25, bold: true, color: COL.blue },
        paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [p([
      r("Tình huống 2 – Lời thuyết trình", { size: 16, color: COL.muted }),
      r("\tTrang ", { size: 16, color: COL.muted }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COL.muted }),
    ], { tabStops: [{ type: TabStopType.RIGHT, position: W }] })] }) },
    children: [
      p(r("BÀI THI THĂNG CẤP QUẢN LÝ NHÀ THUỐC (SM) • FPT LONG CHÂU", { size: 18, bold: true, color: COL.orange, characterSpacing: 20 }), { spacing: { after: 80 } }),
      p(r("Lời thuyết trình – Tình huống 2"), { heading: HeadingLevel.TITLE }),
      p(r("Hai nhân viên cùng xin nghỉ một ngày  •  Chủ đề 2: Quản trị nhân sự", { color: COL.slate }), { spacing: { after: 200 } }),
      p([r("Nhân vật: ", { bold: true }), r("Thúy", { bold: true, color: SPEAKER["THÚY"] }), r(" – trưởng ca  ·  "), r("Dương", { bold: true, color: SPEAKER["DƯƠNG"] }), r(" – nhân viên bán hàng  ·  "), r("Thảo", { bold: true, color: SPEAKER["THẢO"] }), r(" – nhân viên bán hàng")], { spacing: { after: 80 } }),
      p([r("Cách đọc: ", { bold: true }), r("đoạn văn thường là lời em nói với giảng viên. Phần "), r("Role-play", { bold: true, color: COL.blue }), r(" là lời thoại diễn giữa Thúy, Dương và Thảo.")], { spacing: { after: 80 } }),
      p([r("Xưng hô: ", { bold: true }), r("kịch bản dùng “chị – em”. Nếu Dương lớn tuổi hơn Thúy, đổi thành “chị Dương – em” ở các câu Thúy nói với Dương.")], { spacing: { after: 240 } }),
      table,
      ...NOTES.flatMap((_, i) => slideSection(i)),
    ],
  }],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("Wrote", OUT); });
