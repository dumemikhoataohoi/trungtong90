// Tình huống 2 – Hai nhân viên cùng xin nghỉ (Chủ đề 2: Quản trị nhân sự)
// Phong cách: theo file mẫu của người dùng (nền sáng, thanh navy trên cùng, nhãn cam, Dương navy / Thảo teal / Shop vàng)
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

const SKILL = "/root/.claude/skills/synced/3e0d2e55-6f8d-4264-95c2-c52768f99e24_9443f717-091e-4d94-a272-b45cf398594d/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");
const OUT = process.argv[2] || path.join(__dirname, "deck.pptx");
const NOTES = JSON.parse(fs.readFileSync(path.join(__dirname, "notes.json"), "utf8"));

const THEME = {
  name: "Long Chau SM",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: "122033", lt1: "FFFFFF", dk2: "0E2F7A", lt2: "F7FAFF",
    accent1: "163F9F", // xanh navy – Dương, thanh trên cùng
    accent2: "1AA6A6", // teal – Thảo
    accent3: "F3B61F", // vàng – Shop
    accent4: "F58220", // cam – nhãn, điểm nhấn
    accent5: "28A745", // xanh lá – Thúy, đề xuất, đạt
    accent6: "E5484D", // đỏ – cảnh báo, "không nên"
    hlink: "163F9F", folHlink: "1AA6A6",
  },
};
const HEX = { ...THEME.colors, slate: "40516B", muted: "6B7890", border: "D9E2F1", chevron: "C9D3E4", greenDk: "1E7B34", tealDk: "0F7C7C" };

const iconCache = {};
async function icon(name, color = "FFFFFF", size = 256) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[name], { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Tình huống 2 – Hai nhân viên cùng xin nghỉ";
  pres.subject = "Chủ đề 2: Quản trị nhân sự";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const S = pres.shapes;

  // ---------- helpers ----------
  const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
  const shadow = () => ({ type: "outer", color: HEX.dk2, opacity: 0.08, blur: 8, offset: 2, angle: 90 });
  const card = (slide, o) => slide.addShape(S.ROUNDED_RECTANGLE, {
    rectRadius: 0.12, fill: { color: C.background1 }, line: { color: HEX.border, width: 1 }, shadow: shadow(), ...o,
  });
  const tint = (slide, o) => slide.addShape(S.ROUNDED_RECTANGLE, { rectRadius: 0.1, line: { type: "none" }, ...o });
  async function iconCircle(slide, { x, y, d, fill, name, color = "FFFFFF", pad = 0.24, objectName }) {
    slide.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: objectName + " – nền" });
    const p = d * pad;
    slide.addImage({ data: await icon(name, color), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, altText: objectName, objectName: objectName + " – biểu tượng" });
  }
  function numCircle(slide, { x, y, d, fill, n, color = C.background1, objectName }) {
    slide.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName });
    T(slide, String(n), { x, y, w: d, h: d, fontSize: 14, bold: true, color, align: "center", valign: "middle", objectName: objectName + " – số" });
  }
  const pill = (slide, text, { x, y, w, h = 0.36, fill, color, fontSize = 11, objectName }) => {
    slide.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill, line: { type: "none" }, objectName });
    T(slide, text, { x, y, w, h, fontSize, bold: true, color, align: "center", valign: "middle", charSpacing: 0.5, objectName: objectName + " – chữ" });
  };
  const line = (slide, x, y, w, h, o, name) => slide.addShape(S.LINE, { x, y, w, h, line: { color: HEX.accent1, width: 1.75, ...o }, objectName: name });

  // ---------- layout ----------
  pres.defineSlideMaster({
    title: "LC_LIGHT",
    background: { color: C.background2 },
    objects: [
      { rect: { x: 0, y: 0, w: 13.333, h: 0.18, fill: { color: C.accent1 } } },
      { text: { text: "", options: { x: 10.53, y: 0.34, w: 2.2, h: 0.56, shape: S.ROUNDED_RECTANGLE, rectRadius: 0.08, fill: { color: C.accent1 }, margin: 0 } } },
      { image: { x: 10.7, y: 0.43, w: 1.74, h: 0.38, path: path.join(__dirname, "logo-long-chau.png"), altText: "Logo Nhà thuốc Long Châu" } },
      { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.44, w: 9.7, h: 0.3, fontSize: 12, bold: true, color: C.accent4, charSpacing: 2, margin: 0, valign: "middle", bullet: false }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.8, w: 9.8, h: 0.6, fontSize: 30, bold: true, color: C.text2, margin: 0, valign: "middle", align: "left" }, text: "" } },
      { placeholder: { options: { name: "sub", type: "body", x: 0.6, y: 1.44, w: 12.13, h: 0.34, fontSize: 14, color: HEX.slate, margin: 0, valign: "middle", bullet: false }, text: "" } },
      { text: { text: "CHỦ ĐỀ 2 • QUẢN TRỊ NHÂN SỰ", options: { x: 0.6, y: 7.1, w: 5, h: 0.25, fontSize: 9, color: HEX.muted, margin: 0, valign: "middle" } } },
      { text: { text: "FPT LONG CHÂU • BÀI THI THĂNG CẤP SM", options: { x: 7.6, y: 7.1, w: 4.55, h: 0.25, fontSize: 9, color: HEX.muted, margin: 0, align: "right", valign: "middle" } } },
    ],
    slideNumber: { x: 12.25, y: 7.1, w: 0.48, h: 0.25, fontSize: 9, color: HEX.muted, align: "right" },
  });
  const head = (s, k, t, sub) => {
    s.addText(k, { placeholder: "kicker" });
    s.addText(t, { placeholder: "title" });
    s.addText(sub, { placeholder: "sub" });
  };

  // =====================================================================
  // SLIDE 1 – ĐỀ BÀI
  // =====================================================================
  pres.addSection({ title: "Đặt vấn đề" });
  {
    const s = pres.addSlide({ masterName: "LC_LIGHT", sectionTitle: "Đặt vấn đề" });
    head(s, "TÌNH HUỐNG 2", "Hai nhân viên cùng xin nghỉ một ngày", "Bài toán quản lý: cân bằng nhu cầu cá nhân và khả năng vận hành của shop");

    // Hai nhân viên
    const people = [
      { name: "DƯƠNG", y: 1.95, fill: C.accent1, col: C.accent1 },
      { name: "THẢO", y: 3.6, fill: C.accent2, col: C.accent2 },
    ];
    for (const p of people) {
      card(s, { x: 0.6, y: p.y, w: 3.0, h: 1.35, objectName: `Thẻ ${p.name}` });
      await iconCircle(s, { x: 0.8, y: p.y + 0.3, d: 0.75, fill: p.fill, name: "FaUser", objectName: `Avatar ${p.name}` });
      T(s, p.name, { x: 1.7, y: p.y + 0.2, w: 1.85, h: 0.4, fontSize: 18, bold: true, color: p.col, charSpacing: 1, objectName: `Tên ${p.name}` });
      T(s, [
        { text: "Nhân viên bán hàng", options: { fontSize: 12, color: HEX.slate, breakLine: true } },
        { text: "Xin nghỉ: ", options: { fontSize: 13, bold: true, color: C.text1 } },
        { text: "THỨ BẢY", options: { fontSize: 13, bold: true, color: C.accent4 } },
      ], { x: 1.7, y: p.y + 0.64, w: 1.85, h: 0.55, paraSpaceAfter: 2, objectName: `Mô tả ${p.name}` });
    }
    line(s, 3.6, 2.625, 0.25, 0, {}, "Nối Dương");
    line(s, 3.6, 4.275, 0.25, 0, {}, "Nối Thảo");
    line(s, 3.85, 2.625, 0, 1.65, {}, "Gộp");
    line(s, 3.85, 3.45, 0.38, 0, { endArrowType: "triangle" }, "Mũi tên vào cảnh báo");

    // Nguy cơ + ảnh hưởng tới shop
    tint(s, { x: 4.25, y: 1.95, w: 4.5, h: 3.0, rectRadius: 0.12, fill: { color: C.accent3, transparency: 88 }, line: { color: "F7E1A2", width: 1 }, objectName: "Thẻ nguy cơ" });
    await iconCircle(s, { x: 4.5, y: 2.17, d: 0.95, fill: C.accent3, name: "FaTriangleExclamation", color: HEX.dk2, pad: 0.22, objectName: "Cảnh báo" });
    T(s, [
      { text: "NẾU CẢ HAI CÙNG NGHỈ", options: { fontSize: 11, bold: true, color: HEX.slate, charSpacing: 1, breakLine: true } },
      { text: "ca chỉ còn ", options: { fontSize: 16, bold: true, color: C.text1 } },
      { text: "2 người", options: { fontSize: 30, bold: true, color: C.accent6 } },
    ], { x: 5.65, y: 2.12, w: 2.95, h: 1.05, valign: "middle", paraSpaceAfter: 2, objectName: "Số người còn lại" });
    T(s, "NGUY CƠ THIẾU NHÂN SỰ → ẢNH HƯỞNG:", { x: 4.5, y: 3.38, w: 4.1, h: 0.28, fontSize: 11, bold: true, color: C.accent4, charSpacing: 1, objectName: "Nhãn ảnh hưởng" });
    const bl = (arr) => arr.map((t, i, a) => ({ text: t, options: { bullet: { indent: 12 }, breakLine: i < a.length - 1 } }));
    T(s, bl(["Tư vấn & bán hàng", "Khách giờ cao điểm", "Hàng hóa, vận hành"]), { x: 4.5, y: 3.72, w: 2.15, h: 1.05, fontSize: 13, color: C.text1, paraSpaceAfter: 3, objectName: "Ảnh hưởng 1" });
    T(s, bl(["Chất lượng phục vụ", "Áp lực người ở lại"]), { x: 6.65, y: 3.72, w: 2.0, h: 1.05, fontSize: 13, color: C.text1, paraSpaceAfter: 3, objectName: "Ảnh hưởng 2" });

    // Thông điệp
    tint(s, { x: 0.6, y: 5.25, w: 8.15, h: 1.15, rectRadius: 0.12, fill: { color: C.accent1, transparency: 91 }, objectName: "Khung thông điệp" });
    T(s, [
      { text: "“Bài toán không phải chọn ai nghỉ –", options: { breakLine: true } },
      { text: "mà là cân bằng " },
      { text: "CON NGƯỜI", options: { color: C.accent4 } },
      { text: " và " },
      { text: "VẬN HÀNH", options: { color: C.accent4 } },
      { text: ".”" },
    ], { x: 0.85, y: 5.25, w: 7.7, h: 1.15, fontSize: 21, bold: true, color: C.text2, align: "center", valign: "middle", objectName: "Thông điệp" });

    // Ảnh đề bài
    card(s, { x: 9.05, y: 1.95, w: 3.68, h: 4.45, objectName: "Thẻ đề bài" });
    s.addImage({ path: path.join(__dirname, "de-bai.jpg"), x: 9.24, y: 2.12, w: 3.3, h: 3.32, altText: "Ảnh đề bài: Chủ đề 2 – Quản trị nhân sự, Tình huống 2 được khoanh đỏ", objectName: "Ảnh đề bài" });
    pill(s, "ĐỀ BÀI THỰC TẾ • TRUNG TÂM ĐÀO TẠO", { x: 9.24, y: 5.7, w: 3.3, h: 0.42, fill: { color: C.accent6 }, color: C.background1, fontSize: 9.5, objectName: "Nhãn đề bài" });

    s.addNotes(NOTES[0]);
  }

  // =====================================================================
  // SLIDE 2 – CĂN CỨ QUYẾT ĐỊNH
  // =====================================================================
  pres.addSection({ title: "Phân tích & xử lý" });
  {
    const s = pres.addSlide({ masterName: "LC_LIGHT", sectionTitle: "Phân tích & xử lý" });
    head(s, "BƯỚC 1 • CÓ CĂN CỨ", "Em dựa vào đâu để quyết định?",
      "Công bằng không phải là cho hai người cùng một kết quả – mà là dùng cùng một nguyên tắc cho mọi người.");

    const X1 = 0.6, W1 = 3.7, X2 = 4.45, W2 = 4.05, X3 = 8.65, W3 = 4.08;
    T(s, "5 TIÊU CHÍ • ÁP DỤNG CHUNG", { x: X1, y: 1.95, w: W1, h: 0.4, fontSize: 11, bold: true, color: HEX.muted, valign: "bottom", charSpacing: 1, objectName: "Tiêu đề cột tiêu chí" });
    await iconCircle(s, { x: X2, y: 1.95, d: 0.4, fill: C.accent1, name: "FaUser", objectName: "Cột Dương" });
    T(s, "DƯƠNG", { x: X2 + 0.5, y: 1.95, w: 1.3, h: 0.4, fontSize: 16, bold: true, color: C.accent1, valign: "middle", charSpacing: 1, objectName: "Tiêu đề Dương" });
    pill(s, "ĐỀ NGHỊ GIỮ LỊCH NGHỈ", { x: X2 + 1.85, y: 1.97, w: 2.2, h: 0.34, fill: { color: C.accent5, transparency: 86 }, color: HEX.greenDk, fontSize: 9.5, objectName: "Nhãn Dương" });
    await iconCircle(s, { x: X3, y: 1.95, d: 0.4, fill: C.accent2, name: "FaUser", objectName: "Cột Thảo" });
    T(s, "THẢO", { x: X3 + 0.5, y: 1.95, w: 1.3, h: 0.4, fontSize: 16, bold: true, color: C.accent2, valign: "middle", charSpacing: 1, objectName: "Tiêu đề Thảo" });
    pill(s, "TRAO ĐỔI ĐỂ TÌM ĐỘ LINH ĐỘNG", { x: X3 + 1.43, y: 1.97, w: 2.65, h: 0.34, fill: { color: C.accent3, transparency: 80 }, color: C.text1, fontSize: 9.5, objectName: "Nhãn Thảo" });

    const rows = [
      { c: "Thời điểm đăng ký", i: "FaCalendarCheck", d: "Báo trước khoảng 1 tháng", t: "Phát sinh sau" },
      { c: "Mức độ khẩn cấp", i: "FaStopwatch", d: "Sự kiện gia đình, ngày đã cố định", t: "Việc cá nhân, cần được tôn trọng" },
      { c: "Khả năng linh động", i: "FaShuffle", d: "Khó thay đổi", t: "Sau trao đổi: có thể dời ngày" },
      { c: "Ảnh hưởng vận hành", i: "FaHouseMedical", m: "Nếu cả hai cùng nghỉ → ca chỉ còn ~2 người → cần một bạn hỗ trợ ca" },
      { c: "Quy định & thẩm quyền", i: "FaScaleBalanced", m: "Cùng một bộ tiêu chí cho cả hai • theo quy định nghỉ phép hiện hành của công ty" },
    ];
    const RH = 0.56, GAP = 0.08;
    for (let k = 0; k < rows.length; k++) {
      const r = rows[k];
      const y = 2.45 + k * (RH + GAP);
      card(s, { x: X1, y, w: W1, h: RH, rectRadius: 0.08, shadow: undefined, objectName: `Tiêu chí ${k + 1}` });
      await iconCircle(s, { x: X1 + 0.12, y: y + 0.09, d: 0.38, fill: k === 4 ? C.accent4 : C.accent1, name: r.i, objectName: `Biểu tượng tiêu chí ${k + 1}` });
      T(s, r.c, { x: X1 + 0.62, y, w: W1 - 0.72, h: RH, fontSize: 14, bold: true, color: C.text1, valign: "middle", objectName: `Nhãn tiêu chí ${k + 1}` });
      if (r.m) {
        card(s, { x: X2, y, w: X3 + W3 - X2, h: RH, rectRadius: 0.08, shadow: undefined, objectName: `Chung ${k + 1}` });
        T(s, r.m, { x: X2 + 0.25, y, w: X3 + W3 - X2 - 0.4, h: RH, fontSize: 14, color: C.text1, valign: "middle", objectName: `Nội dung chung ${k + 1}` });
      } else {
        tint(s, { x: X2, y, w: W2, h: RH, rectRadius: 0.08, fill: { color: C.accent1, transparency: 92 }, objectName: `Dương ${k + 1}` });
        s.addImage({ data: await icon("FaCircleCheck", HEX.accent5), x: X2 + 0.17, y: y + 0.15, w: 0.26, h: 0.26, altText: "Đạt", objectName: `Dấu Dương ${k + 1}` });
        T(s, r.d, { x: X2 + 0.55, y, w: W2 - 0.65, h: RH, fontSize: 14, color: C.text1, valign: "middle", objectName: `Nội dung Dương ${k + 1}` });
        tint(s, { x: X3, y, w: W3, h: RH, rectRadius: 0.08, fill: { color: C.accent2, transparency: 90 }, objectName: `Thảo ${k + 1}` });
        s.addShape(S.OVAL, { x: X3 + 0.23, y: y + 0.22, w: 0.12, h: 0.12, fill: { color: C.accent2 }, line: { type: "none" }, objectName: `Chấm Thảo ${k + 1}` });
        T(s, r.t, { x: X3 + 0.55, y, w: W3 - 0.65, h: RH, fontSize: 14, color: C.text1, valign: "middle", objectName: `Nội dung Thảo ${k + 1}` });
      }
    }

    tint(s, { x: 0.6, y: 5.8, w: 8.2, h: 0.9, fill: { color: C.text2 }, objectName: "Đề xuất" });
    T(s, "ĐỀ XUẤT", { x: 0.85, y: 5.8, w: 1.2, h: 0.9, fontSize: 12, bold: true, color: C.accent4, valign: "middle", charSpacing: 2, objectName: "Nhãn đề xuất" });
    T(s, [
      { text: "→  Giữ lịch nghỉ Thứ Bảy cho Dương", options: { breakLine: true } },
      { text: "→  Chủ động bố trí ngày nghỉ khác phù hợp cho Thảo" },
    ], { x: 2.1, y: 5.8, w: 6.55, h: 0.9, fontSize: 16, bold: true, color: C.background1, valign: "middle", objectName: "Nội dung đề xuất" });
    tint(s, { x: 9.0, y: 5.8, w: 3.73, h: 0.9, fill: { color: C.accent3, transparency: 80 }, objectName: "Lưu ý" });
    T(s, "KHÔNG đánh giá việc riêng của ai quan trọng hơn – chỉ xét thời điểm báo & mức độ linh động.", { x: 9.2, y: 5.8, w: 3.4, h: 0.9, fontSize: 13, bold: true, color: C.text1, valign: "middle", objectName: "Nội dung lưu ý" });

    s.addNotes(NOTES[1]);
  }

  // =====================================================================
  // SLIDE 3 – ROLE-PLAY
  // =====================================================================
  {
    const s = pres.addSlide({ masterName: "LC_LIGHT", sectionTitle: "Phân tích & xử lý" });
    head(s, "BƯỚC 2 • GIAO TIẾP", "Nghe trước – đề xuất sau – hỏi lại",
      "Mục tiêu: giải thích rõ – đề xuất thay vì áp đặt – để cả hai bạn đều có tiếng nói.");

    const bubbles = [
      { who: "THÚY • TRƯỞNG CA", side: "L", fill: C.accent5, col: HEX.greenDk, icon: "FaUserTie", y: 1.95, h: 1.0,
        text: "Chị hiểu cả hai em đều có việc riêng. Chị muốn nghe rõ trước khi chốt lịch: việc của bạn nào bắt buộc đúng Thứ Bảy, bạn nào có thể dời sang ngày khác?" },
      { who: "DƯƠNG", side: "R", fill: C.accent1, col: C.accent1, icon: "FaUser", y: 3.33, h: 0.72,
        text: "Dạ đám cưới em của em, em đã báo chị từ tháng trước – ngày đó em không đổi được ạ." },
      { who: "THẢO", side: "R", fill: C.accent2, col: HEX.tealDk, icon: "FaUser", y: 4.43, h: 0.72,
        text: "Dạ em có hẹn với bạn… nhưng nếu cần thì em hẹn bạn lại ngày khác được chị." },
      { who: "THÚY • TRƯỞNG CA", side: "L", fill: C.accent5, col: HEX.greenDk, icon: "FaUserTie", y: 5.53, h: 0.72,
        text: "Chị biết dời hẹn cũng không dễ, cảm ơn Thảo nhiều. Vậy chị đề xuất thế này nhé…" },
    ];
    for (const [k, b] of bubbles.entries()) {
      const L = b.side === "L";
      const bx = L ? 1.3 : 2.0, bw = L ? 6.0 : 5.6;
      await iconCircle(s, { x: L ? 0.6 : 7.75, y: b.y + 0.28, d: 0.55, fill: b.fill, name: b.icon, objectName: `Avatar lời thoại ${k + 1}` });
      T(s, b.who, { x: bx, y: b.y, w: bw, h: 0.26, fontSize: 11, bold: true, color: b.col, align: L ? "left" : "right", charSpacing: 1, objectName: `Người nói ${k + 1}` });
      tint(s, { x: bx, y: b.y + 0.28, w: bw, h: b.h, rectRadius: 0.14, fill: { color: b.fill, transparency: 89 }, objectName: `Bong bóng ${k + 1}` });
      T(s, b.text, { x: bx + 0.2, y: b.y + 0.28, w: bw - 0.4, h: b.h, fontSize: 14, color: C.text1, valign: "middle", objectName: `Lời thoại ${k + 1}` });
    }

    card(s, { x: 8.75, y: 1.95, w: 3.98, h: 4.75, objectName: "Panel đề xuất" });
    T(s, "PHƯƠNG ÁN THÚY ĐỀ XUẤT", { x: 9.0, y: 2.1, w: 3.5, h: 0.35, fontSize: 12, bold: true, color: HEX.greenDk, charSpacing: 1, valign: "middle", objectName: "Tiêu đề panel" });
    const items = [
      { f: C.accent1, i: "FaCalendarCheck", t: "Dương nghỉ Thứ Bảy", d: "Đúng lịch đã báo từ trước" },
      { f: C.accent2, i: "FaHandshake", t: "Thảo hỗ trợ ca Thứ Bảy", d: "Sau khi Thảo đồng ý" },
      { f: C.accent2, i: "FaCalendarDays", t: "Thảo được nghỉ ngày khác", d: "CN hoặc ngày phù hợp, theo quy định" },
      { f: C.accent5, i: "FaPeopleGroup", t: "Team hỗ trợ qua lại", d: "Dương & team đứng ca khi Thảo nghỉ" },
    ];
    for (const [k, it] of items.entries()) {
      const y = 2.58 + k * 0.8;
      await iconCircle(s, { x: 9.0, y, d: 0.5, fill: it.f, name: it.i, objectName: `Đề xuất ${k + 1}` });
      T(s, it.t, { x: 9.65, y: y - 0.02, w: 2.95, h: 0.3, fontSize: 14, bold: true, color: C.text1, objectName: `Đề xuất ${k + 1} tiêu đề` });
      T(s, it.d, { x: 9.65, y: y + 0.28, w: 2.95, h: 0.4, fontSize: 12, color: HEX.slate, objectName: `Đề xuất ${k + 1} chi tiết` });
    }
    tint(s, { x: 9.0, y: 5.8, w: 3.48, h: 0.75, fill: { color: C.text2 }, objectName: "Hỏi lại" });
    T(s, [
      { text: "Và hỏi lại: ", options: { bold: true, color: C.accent3 } },
      { text: "“Thảo thấy phương án này ổn không em?”", options: { italic: true } },
    ], { x: 9.18, y: 5.8, w: 3.15, h: 0.75, fontSize: 14, color: C.background1, valign: "middle", objectName: "Câu hỏi lại" });

    s.addNotes(NOTES[2]);
  }

  // =====================================================================
  // SLIDE 4 – WIN-WIN
  // =====================================================================
  {
    const s = pres.addSlide({ masterName: "LC_LIGHT", sectionTitle: "Phân tích & xử lý" });
    head(s, "BƯỚC 3 • WIN–WIN", "Không ai thắng – không ai thua",
      "Quản lý không chỉ giải quyết ca hôm đó – mà còn phải giữ cảm giác công bằng trong team.");

    const Y = 1.95, H = 3.0, W = 3.85;
    const cols = [
      { x: 0.6, name: "DƯƠNG", fill: { color: C.accent1, transparency: 93 }, border: HEX.chevron, circle: C.accent1, icon: "FaUser", iconCol: "FFFFFF",
        pill: "THỨ BẢY • NGHỈ", pillFill: C.accent1, pillCol: C.background1, check: HEX.accent1,
        lines: ["Đã báo trước khoảng 1 tháng", "Lịch gần như không thể đổi", "Sẵn sàng hỗ trợ lại Thảo & team khi cần"] },
      { x: 4.74, name: "SHOP", fill: { color: C.accent3, transparency: 89 }, border: "F7E1A2", circle: C.accent3, icon: "FaHouseMedical", iconCol: HEX.dk2,
        pill: "THỨ BẢY • ĐỦ NGƯỜI", pillFill: C.accent3, pillCol: C.text1, check: HEX.accent4,
        lines: ["Phục vụ tốt khách giờ cao điểm", "Giảm quá tải cho người ở lại", "Trưởng ca chủ động điều phối"] },
      { x: 8.88, name: "THẢO", fill: { color: C.accent2, transparency: 91 }, border: "BFE6E6", circle: C.accent2, icon: "FaUser", iconCol: "FFFFFF",
        pill: "THỨ BẢY • HỖ TRỢ CA", pillFill: C.accent2, pillCol: C.background1, check: HEX.accent2,
        lines: ["Nghỉ Chủ nhật hoặc ngày phù hợp khác", "Đổi ca theo quy định, có sự đồng ý của Thảo", "Team hỗ trợ lại khi Thảo nghỉ"] },
    ];
    for (const c of cols) {
      tint(s, { x: c.x, y: Y, w: W, h: H, rectRadius: 0.12, fill: c.fill, line: { color: c.border, width: 1 }, objectName: `Thẻ ${c.name}` });
      await iconCircle(s, { x: c.x + 0.22, y: Y + 0.2, d: 0.62, fill: c.circle, name: c.icon, color: c.iconCol, objectName: c.name });
      T(s, c.name, { x: c.x + 0.98, y: Y + 0.14, w: 2.7, h: 0.4, fontSize: 18, bold: true, color: C.text1, valign: "middle", charSpacing: 1, objectName: `Tên ${c.name}` });
      pill(s, c.pill, { x: c.x + 0.98, y: Y + 0.58, w: 2.65, h: 0.36, fill: { color: c.pillFill }, color: c.pillCol, objectName: `Trạng thái ${c.name}` });
      for (const [k, t] of c.lines.entries()) {
        const y = Y + 1.22 + k * 0.56;
        s.addImage({ data: await icon("FaCircleCheck", c.check), x: c.x + 0.25, y: y + 0.03, w: 0.24, h: 0.24, altText: "Đạt", objectName: `Dấu ${c.name} ${k + 1}` });
        T(s, t, { x: c.x + 0.62, y, w: W - 0.82, h: 0.5, fontSize: 13.5, color: C.text1, objectName: `${c.name} ý ${k + 1}` });
      }
    }
    for (const [k, cx] of [4.595, 8.735].entries()) {
      s.addShape(S.OVAL, { x: cx - 0.22, y: Y + H / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: C.background1 }, line: { color: HEX.accent1, width: 1.5 }, objectName: `Dấu cộng ${k + 1}` });
      T(s, "+", { x: cx - 0.22, y: Y + H / 2 - 0.22, w: 0.44, h: 0.44, fontSize: 20, bold: true, color: C.accent1, align: "center", valign: "middle", objectName: `Ký hiệu cộng ${k + 1}` });
    }

    tint(s, { x: 0.6, y: 5.2, w: 8.25, h: 1.5, rectRadius: 0.12, fill: { color: C.accent2, transparency: 90 }, line: { color: "BFE6E6", width: 1 }, objectName: "Khi Thảo hỏi" });
    T(s, [
      { text: "KHI THẢO HỎI", options: { fontSize: 11, bold: true, color: HEX.tealDk, charSpacing: 1, breakLine: true } },
      { text: "“Sao lúc nào người xin trước cũng được ưu tiên?”", options: { fontSize: 15, bold: true, italic: true, color: HEX.tealDk, breakLine: true } },
      { text: "Thúy: ", options: { fontSize: 14, bold: true, color: C.text1 } },
      { text: "“Chị không chọn vì thân ai hơn hay việc của ai đáng giá hơn – chị dựa vào thời điểm báo và mức độ linh động. Nếu hoàn cảnh ngược lại, chị cũng áp dụng đúng nguyên tắc đó cho em.”", options: { fontSize: 14, color: C.text1 } },
    ], { x: 0.85, y: 5.2, w: 7.8, h: 1.5, valign: "middle", paraSpaceAfter: 3, objectName: "Đối thoại Thảo" });
    tint(s, { x: 9.05, y: 5.2, w: 3.68, h: 1.5, rectRadius: 0.12, fill: { color: C.text2 }, objectName: "Nguyên tắc" });
    await iconCircle(s, { x: 9.3, y: 5.36, d: 0.48, fill: C.accent4, name: "FaHandHoldingHeart", objectName: "Nguyên tắc biểu tượng" });
    T(s, "Người hỗ trợ shop không được trở thành người chịu thiệt.", { x: 9.3, y: 5.9, w: 3.25, h: 0.7, fontSize: 15.5, bold: true, color: C.background1, objectName: "Nguyên tắc nội dung" });

    s.addNotes(NOTES[3]);
  }

  // =====================================================================
  // SLIDE 5 – CASE 2
  // =====================================================================
  pres.addSection({ title: "Phương án dự phòng" });
  {
    const s = pres.addSlide({ masterName: "LC_LIGHT", sectionTitle: "Phương án dự phòng" });
    head(s, "CASE 2 • KHÔNG THỂ THỎA THUẬN", "Nếu cả hai đều không thể đổi?",
      "Không ép nhân viên trước khi đã kiểm tra các phương án vận hành và phạm vi thẩm quyền.");

    tint(s, { x: 0.6, y: 1.95, w: 3.55, h: 1.45, rectRadius: 0.12, fill: { color: C.accent6, transparency: 90 }, line: { color: "F5C6C8", width: 1 }, objectName: "Không nên" });
    T(s, [
      { text: "KHÔNG NÊN", options: { fontSize: 12, bold: true, color: C.accent6, charSpacing: 1, breakLine: true } },
      { text: "“Chị là trưởng ca, chị quyết định.”", options: { breakLine: true } },
      { text: "“Thảo phải đi làm vì Dương xin trước.”", options: { breakLine: true } },
      { text: "“Hai em tự thỏa thuận rồi báo chị.”" },
    ], { x: 0.82, y: 1.95, w: 3.2, h: 1.45, fontSize: 13, color: C.text1, valign: "middle", paraSpaceAfter: 3, objectName: "Nội dung không nên" });
    tint(s, { x: 4.3, y: 1.95, w: 3.55, h: 1.45, rectRadius: 0.12, fill: { color: C.accent5, transparency: 89 }, line: { color: "C9EED2", width: 1 }, objectName: "Nên nói" });
    T(s, [
      { text: "NÊN NÓI", options: { fontSize: 12, bold: true, color: HEX.greenDk, charSpacing: 1, breakLine: true } },
      { text: "“Nếu cả hai thực sự không thể đổi, chị sẽ không tranh luận thêm. Chị kiểm tra phương án điều phối và báo ASM trước khi chốt.”" },
    ], { x: 4.52, y: 1.95, w: 3.2, h: 1.45, fontSize: 13, color: C.text1, valign: "middle", paraSpaceAfter: 3, objectName: "Nội dung nên nói" });

    const steps = [
      { t: "Xác nhận lại", d: "Cả hai đều không đổi được? Nói rõ: ca chỉ còn ~2 người", c: C.accent1 },
      { t: "Xem lại lần cuối", d: "Trao đổi riêng từng bạn; đổi giờ ca nếu quy định cho phép", c: C.accent2 },
      { t: "Điều chỉnh ca", d: "Tìm bạn tự nguyện đổi ca, hỗ trợ", c: C.accent5 },
      { t: "Trưởng ca / SM đứng ca", d: "Trực tiếp hỗ trợ nếu phù hợp", c: C.accent4 },
      { t: "Báo ASM", d: "Xin bổ sung, điều phối từ shop khác nếu quy trình cho phép", c: C.accent6 },
    ];
    const BASE = 6.7, SW = 1.78;
    for (const [k, st] of steps.entries()) {
      const x = 0.6 + k * (SW + 0.07);
      const top = 5.0 - k * 0.45;
      card(s, { x, y: top, w: SW, h: BASE - top, rectRadius: 0.08, objectName: `Bậc ${k + 1}` });
      numCircle(s, { x: x + 0.15, y: top + 0.15, d: 0.42, fill: st.c, n: "0" + (k + 1), objectName: `Số bậc ${k + 1}` });
      T(s, [
        { text: st.t, options: { fontSize: 14, bold: true, color: C.text1, breakLine: true } },
        { text: st.d, options: { fontSize: 12, color: HEX.slate } },
      ], { x: x + 0.15, y: top + 0.66, w: SW - 0.27, h: BASE - top - 0.76, paraSpaceAfter: 3, objectName: `Nội dung bậc ${k + 1}` });
    }
    line(s, 9.8, 4.4, 0.22, 0, { color: HEX.muted, endArrowType: "triangle" }, "Mũi tên sang quyết định");

    tint(s, { x: 10.05, y: 1.95, w: 2.68, h: 4.75, rectRadius: 0.12, fill: { color: C.text2 }, objectName: "Quyết định cuối" });
    await iconCircle(s, { x: 10.28, y: 2.15, d: 0.6, fill: C.accent4, name: "FaScaleBalanced", objectName: "Quyết định" });
    T(s, [
      { text: "BƯỚC CUỐI CÙNG", options: { fontSize: 11, bold: true, color: C.accent3, charSpacing: 1, breakLine: true } },
      { text: "Ra quyết định theo SOP + căn cứ + thẩm quyền", options: { fontSize: 15, bold: true, color: C.background1 } },
    ], { x: 10.28, y: 2.88, w: 2.3, h: 1.15, paraSpaceAfter: 3, objectName: "Tiêu đề quyết định" });
    T(s, ["Quy định nghỉ phép hiện hành", "Ai đăng ký & được xác nhận trước", "Tính cấp thiết, hoàn cảnh cụ thể", "Nhân sự tối thiểu để vận hành an toàn", "Vượt thẩm quyền → báo ASM quyết định"].map((t, i, a) => ({
      text: t, options: { bullet: { indent: 12 }, breakLine: i < a.length - 1 },
    })), { x: 10.28, y: 4.15, w: 2.3, h: 2.45, fontSize: 12, color: C.background1, paraSpaceAfter: 4, objectName: "Căn cứ quyết định" });

    s.addNotes(NOTES[4]);
  }

  // =====================================================================
  // SLIDE 6 – TƯ DUY QUẢN LÝ
  // =====================================================================
  pres.addSection({ title: "Kết luận" });
  {
    const s = pres.addSlide({ masterName: "LC_LIGHT", sectionTitle: "Kết luận" });
    head(s, "KẾT LUẬN • TƯ DUY SM", "Dẫn dắt bằng nguyên tắc, không bằng quyền lực",
      "Giải quyết được lịch – nhưng vẫn phải giữ được đội ngũ.");

    const pts = [
      { h: "LẮNG NGHE", d: "Hiểu hoàn cảnh trước khi quyết định", i: "FaEarListen", c: C.accent1 },
      { h: "CÓ CĂN CỨ", d: "Không xử lý theo cảm tính hay thân – sơ", i: "FaClipboardCheck", c: C.accent4 },
      { h: "CÔNG BẰNG", d: "Người hỗ trợ shop không bị thiệt", i: "FaScaleBalanced", c: C.accent2 },
      { h: "CÓ DỰ PHÒNG", d: "Báo sớm • backup • cùng một nguyên tắc", i: "FaShieldHalved", c: C.accent5 },
    ];
    for (const [k, p] of pts.entries()) {
      const x = 0.6 + k * 3.07;
      card(s, { x, y: 1.95, w: 2.92, h: 2.05, objectName: `Tư duy ${k + 1}` });
      await iconCircle(s, { x: x + 0.22, y: 2.15, d: 0.66, fill: p.c, name: p.i, objectName: p.h });
      T(s, p.h, { x: x + 0.22, y: 2.97, w: 2.55, h: 0.38, fontSize: 17, bold: true, color: C.text1, charSpacing: 0.5, objectName: `Tư duy ${k + 1} tiêu đề` });
      T(s, p.d, { x: x + 0.22, y: 3.37, w: 2.55, h: 0.55, fontSize: 13.5, color: HEX.slate, objectName: `Tư duy ${k + 1} mô tả` });
    }

    tint(s, { x: 0.6, y: 4.25, w: 12.13, h: 0.8, rectRadius: 0.12, fill: { color: C.text2 }, objectName: "Khung câu chốt" });
    T(s, "“Em không muốn giải quyết một ngày nghỉ rồi tạo ra một mâu thuẫn mới trong team.”", { x: 0.9, y: 4.25, w: 11.53, h: 0.8, fontSize: 19, bold: true, color: C.background1, align: "center", valign: "middle", objectName: "Câu chốt" });

    T(s, "MỤC TIÊU SAU CUỘC TRAO ĐỔI", { x: 0.6, y: 5.25, w: 6, h: 0.28, fontSize: 12, bold: true, color: C.accent4, charSpacing: 2, objectName: "Nhãn mục tiêu" });
    const goals = [
      { n: "Dương", d: " – nhu cầu chính đáng được tôn trọng", f: C.accent1, i: "FaUser", ic: "FFFFFF" },
      { n: "Thảo", d: " – được đối xử công bằng", f: C.accent2, i: "FaUser", ic: "FFFFFF" },
      { n: "Shop", d: " – đủ người phục vụ khách hàng", f: C.accent3, i: "FaHouseMedical", ic: HEX.dk2 },
    ];
    for (const [k, g] of goals.entries()) {
      const x = 0.6 + k * 4.12;
      card(s, { x, y: 5.62, w: 3.89, h: 0.92, objectName: `Mục tiêu ${g.n}` });
      await iconCircle(s, { x: x + 0.2, y: 5.805, d: 0.55, fill: g.f, name: g.i, color: g.ic, objectName: `Mục tiêu ${g.n} biểu tượng` });
      T(s, [
        { text: g.n, options: { bold: true } },
        { text: g.d },
      ], { x: x + 0.9, y: 5.62, w: 2.85, h: 0.92, fontSize: 15, color: C.text1, valign: "middle", objectName: `Mục tiêu ${g.n} nội dung` });
    }

    s.addNotes(NOTES[5]);
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("Wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
