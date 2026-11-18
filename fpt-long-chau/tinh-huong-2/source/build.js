// Tình huống 2 – Hai nhân viên cùng xin nghỉ (Chủ đề 2: Quản trị nhân sự)
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

const SKILL = "/root/.claude/skills/synced/3e0d2e55-6f8d-4264-95c2-c52768f99e24_9443f717-091e-4d94-a272-b45cf398594d/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");
const OUT = process.argv[2] || path.join(__dirname, "deck.pptx");

const THEME = {
  name: "Long Chau Care",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "13293D", lt1: "FFFFFF", dk2: "0B3B4F", lt2: "EDF6F5",
    accent1: "0F8F8A", // teal – shop / trưởng ca
    accent2: "2563C9", // blue – Dương
    accent3: "7B4FC9", // violet – Thảo
    accent4: "F0A030", // amber – cảnh báo / điểm nhấn
    accent5: "6FD8CB", // mint – nhấn trên nền tối
    accent6: "5B6B7F", // slate – chữ phụ
    hlink: "2563C9", folHlink: "7B4FC9",
  },
};
const HEX = THEME.colors;

// ---------- icons ----------
const iconCache = {};
async function icon(name, color = "FFFFFF", size = 256) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(fa[name], { color: "#" + color, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg))
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.title = "Tình huống 2 – Hai nhân viên cùng xin nghỉ";
  pres.subject = "Chủ đề 2: Quản trị nhân sự";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const S = pres.shapes;

  // ---------- helpers ----------
  const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
  const box = (slide, o) => slide.addShape(S.ROUNDED_RECTANGLE, { rectRadius: 0.1, line: { type: "none" }, ...o });
  const shadow = () => ({ type: "outer", color: HEX.dk1, opacity: 0.1, blur: 10, offset: 2, angle: 90 });
  async function iconCircle(slide, { x, y, d, fill, name, color = "FFFFFF", pad = 0.24, objectName }) {
    slide.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: objectName ? objectName + " circle" : undefined });
    const p = d * pad;
    slide.addImage({ data: await icon(name, color), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, altText: objectName || name, objectName: objectName ? objectName + " icon" : undefined });
  }
  const arrow = (slide, x, y, w, color, name) =>
    slide.addShape(S.LINE, { x, y, w, h: 0, line: { color, width: 2, endArrowType: "triangle" }, objectName: name });
  const vline = (slide, x, y, h, color, name) =>
    slide.addShape(S.LINE, { x, y, w: 0, h, line: { color, width: 2 }, objectName: name });
  const hline = (slide, x, y, w, color, name) =>
    slide.addShape(S.LINE, { x, y, w, h: 0, line: { color, width: 2 }, objectName: name });

  const FOOTER = "Trung tâm Đào tạo FPT Long Châu  ·  Chủ đề 2 – Quản trị nhân sự  ·  Tình huống 2";

  // ---------- layouts ----------
  pres.defineSlideMaster({
    title: "LC_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.45, w: 12.1, h: 0.36, fontSize: 13, bold: true, color: C.accent5, charSpacing: 2, margin: 0, valign: "middle", bullet: false }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.85, w: 12.1, h: 1.45, fontSize: 38, bold: true, color: C.background1, margin: 0, valign: "top", align: "left" }, text: "" } },
      { text: { text: FOOTER, options: { x: 0.6, y: 7.02, w: 10, h: 0.28, fontSize: 10, color: C.accent5, margin: 0, valign: "middle" } } },
    ],
    slideNumber: { x: 12.23, y: 7.02, w: 0.5, h: 0.28, fontSize: 10, color: C.accent5, align: "right" },
  });
  pres.defineSlideMaster({
    title: "LC_CONTENT",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.36, w: 12.1, h: 0.32, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2, margin: 0, valign: "middle", bullet: false }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.7, w: 12.1, h: 0.72, fontSize: 32, bold: true, color: C.text1, margin: 0, valign: "top", align: "left" }, text: "" } },
      { text: { text: FOOTER, options: { x: 0.6, y: 7.02, w: 10, h: 0.28, fontSize: 10, color: C.accent6, margin: 0, valign: "middle" } } },
    ],
    slideNumber: { x: 12.23, y: 7.02, w: 0.5, h: 0.28, fontSize: 10, color: C.accent6, align: "right" },
  });

  // =====================================================================
  // SLIDE 1 – ĐỀ BÀI
  // =====================================================================
  pres.addSection({ title: "Đặt vấn đề" });
  {
    const s = pres.addSlide({ masterName: "LC_DARK", sectionTitle: "Đặt vấn đề" });
    s.addText("CHỦ ĐỀ 2 · QUẢN TRỊ NHÂN SỰ", { placeholder: "kicker" });
    s.addText([
      { text: "TÌNH HUỐNG 2", options: { color: C.accent5, breakLine: true } },
      { text: "Hai nhân viên cùng xin nghỉ" },
    ], { placeholder: "title" });

    // Hai nhân viên
    const people = [
      { name: "Dương", y: 2.6, fill: C.accent2 },
      { name: "Thảo", y: 4.2, fill: C.accent3 },
    ];
    for (const p of people) {
      box(s, { x: 0.6, y: p.y, w: 3.75, h: 1.35, fill: { color: C.background1, transparency: 90 }, objectName: `Thẻ ${p.name}` });
      await iconCircle(s, { x: 0.85, y: p.y + 0.25, d: 0.85, fill: p.fill, name: "FaUser", objectName: `Avatar ${p.name}` });
      T(s, p.name, { x: 1.95, y: p.y + 0.22, w: 2.25, h: 0.45, fontSize: 20, bold: true, color: C.background1, objectName: `Tên ${p.name}` });
      T(s, [
        { text: "Nhân viên bán hàng", options: { fontSize: 13, color: C.accent5, breakLine: true } },
        { text: "Xin nghỉ: THỨ BẢY", options: { fontSize: 15, bold: true, color: C.background1 } },
      ], { x: 1.95, y: p.y + 0.66, w: 2.3, h: 0.6, objectName: `Mô tả ${p.name}` });
    }
    // bracket → giữa
    hline(s, 4.35, 3.275, 0.35, HEX.accent5, "Nối Dương");
    hline(s, 4.35, 4.875, 0.35, HEX.accent5, "Nối Thảo");
    vline(s, 4.7, 3.275, 1.6, HEX.accent5, "Gộp");
    arrow(s, 4.7, 4.075, 0.45, HEX.accent5, "Mũi tên vào cảnh báo");

    // Cảnh báo ở giữa
    await iconCircle(s, { x: 6.15, y: 2.7, d: 1.1, fill: C.accent4, name: "FaTriangleExclamation", color: HEX.dk2, pad: 0.22, objectName: "Cảnh báo" });
    T(s, "NẾU CẢ HAI CÙNG NGHỈ", { x: 5.2, y: 3.95, w: 3.0, h: 0.32, fontSize: 12, bold: true, color: C.accent5, align: "center", charSpacing: 1, objectName: "Nhãn cảnh báo" });
    T(s, "Ca chỉ còn 2 người", { x: 5.2, y: 4.27, w: 3.0, h: 0.6, fontSize: 28, bold: true, color: C.accent4, align: "center", objectName: "Số người còn lại" });
    T(s, "→ nguy cơ thiếu nhân sự", { x: 5.2, y: 4.9, w: 3.0, h: 0.4, fontSize: 15, color: C.background1, align: "center", objectName: "Hệ quả" });
    arrow(s, 8.3, 4.075, 0.55, HEX.accent5, "Mũi tên vào shop");

    // Shop
    box(s, { x: 9.0, y: 2.6, w: 3.73, h: 2.95, fill: { color: C.background1, transparency: 90 }, objectName: "Thẻ Shop" });
    await iconCircle(s, { x: 9.25, y: 2.85, d: 0.85, fill: C.accent1, name: "FaHouseMedical", objectName: "Shop" });
    T(s, [
      { text: "Shop", options: { fontSize: 20, bold: true, color: C.background1, breakLine: true } },
      { text: "ca Thứ Bảy bị ảnh hưởng", options: { fontSize: 13, color: C.accent5 } },
    ], { x: 10.3, y: 2.92, w: 2.3, h: 0.75, objectName: "Tiêu đề Shop" });
    T(s, ["Tư vấn & bán hàng", "Khách giờ cao điểm", "Hàng hóa, vận hành", "Chất lượng phục vụ", "Áp lực người ở lại"].map((t, i, a) => ({
      text: t, options: { bullet: { indent: 14 }, breakLine: i < a.length - 1 },
    })), { x: 9.3, y: 3.9, w: 3.3, h: 1.55, fontSize: 14, color: C.background1, paraSpaceAfter: 2, objectName: "Ảnh hưởng" });

    // Thông điệp
    T(s, [
      { text: "“Bài toán không phải chọn ai nghỉ – mà là cân bằng " },
      { text: "CON NGƯỜI", options: { bold: true, color: C.accent5 } },
      { text: " và " },
      { text: "VẬN HÀNH", options: { bold: true, color: C.accent5 } },
      { text: ".”" },
    ], { x: 0.6, y: 6.0, w: 12.13, h: 0.6, fontSize: 21, italic: true, color: C.background1, align: "center", valign: "middle", objectName: "Thông điệp" });

    s.addNotes(
`[~60 giây]

Dạ em chào thầy và các anh chị. Em xin trình bày Tình huống 2: có hai bạn nhân viên bán hàng cùng xin nghỉ một ngày, nếu cho nghỉ cả hai thì shop không đủ người cho ca làm việc.

Để dễ hình dung, em đặt tình huống vào một bối cảnh cụ thể: hai bạn là Dương và Thảo, cùng xin nghỉ Thứ Bảy. Người xử lý là Thúy – trưởng ca.

Nếu cả hai cùng nghỉ thì ca hôm đó chỉ còn khoảng hai người. Lúc khách đông, hai người vừa phải tư vấn, bán hàng, vừa lo hàng hóa và các việc vận hành khác. Chất lượng phục vụ sẽ bị ảnh hưởng, và hai bạn ở lại sẽ chịu áp lực rất lớn.

Ở tình huống này em sẽ chưa vội nói ai được nghỉ, ai phải đi làm. Vì theo em, nếu quản lý quyết định quá nhanh mà nhân viên không hiểu căn cứ, thì dù giải quyết được lịch hôm đó, mình vẫn có thể để lại cảm giác thiên vị trong team.

Nên với em, bài toán ở đây không phải là chọn ai nghỉ, mà là cân bằng giữa con người và vận hành.`);
  }

  // =====================================================================
  // SLIDE 2 – CĂN CỨ QUYẾT ĐỊNH
  // =====================================================================
  pres.addSection({ title: "Phân tích & xử lý" });
  {
    const s = pres.addSlide({ masterName: "LC_CONTENT", sectionTitle: "Phân tích & xử lý" });
    s.addText("02 · CĂN CỨ QUYẾT ĐỊNH", { placeholder: "kicker" });
    s.addText("Em dựa vào đâu để quyết định?", { placeholder: "title" });

    const X1 = 0.6, W1 = 3.7, X2 = 4.45, W2 = 4.05, X3 = 8.65, W3 = 4.08;
    T(s, "5 TIÊU CHÍ · ÁP DỤNG CHUNG CHO CẢ HAI", { x: X1, y: 1.6, w: W1, h: 0.45, fontSize: 11, bold: true, color: C.accent6, valign: "bottom", charSpacing: 1, objectName: "Tiêu đề cột tiêu chí" });
    await iconCircle(s, { x: X2, y: 1.62, d: 0.42, fill: C.accent2, name: "FaUser", objectName: "Cột Dương" });
    T(s, "DƯƠNG", { x: X2 + 0.55, y: 1.6, w: 2.5, h: 0.45, fontSize: 16, bold: true, color: C.accent2, valign: "middle", charSpacing: 1, objectName: "Tiêu đề Dương" });
    await iconCircle(s, { x: X3, y: 1.62, d: 0.42, fill: C.accent3, name: "FaUser", objectName: "Cột Thảo" });
    T(s, "THẢO", { x: X3 + 0.55, y: 1.6, w: 2.5, h: 0.45, fontSize: 16, bold: true, color: C.accent3, valign: "middle", charSpacing: 1, objectName: "Tiêu đề Thảo" });

    const rows = [
      { c: "Thời điểm đăng ký", i: "FaCalendarCheck", d: "Báo trước khoảng 1 tháng", t: "Phát sinh sau" },
      { c: "Mức độ khẩn cấp", i: "FaStopwatch", d: "Sự kiện gia đình, ngày đã cố định", t: "Việc cá nhân, có hẹn gặp bạn" },
      { c: "Khả năng linh động", i: "FaShuffle", d: "Khó thay đổi", t: "Sau trao đổi: có thể dời ngày" },
      { c: "Ảnh hưởng vận hành", i: "FaHouseMedical", m: "Nếu cả hai cùng nghỉ → ca chỉ còn ~2 người → cần một bạn hỗ trợ ca" },
      { c: "Quy định & công bằng", i: "FaScaleBalanced", m: "Cùng một bộ tiêu chí cho cả hai · theo quy định nghỉ phép hiện hành của công ty" },
    ];
    const RH = 0.62, GAP = 0.09;
    for (let k = 0; k < rows.length; k++) {
      const r = rows[k];
      const y = 2.17 + k * (RH + GAP);
      box(s, { x: X1, y, w: W1, h: RH, rectRadius: 0.08, fill: { color: C.background2 }, objectName: `Tiêu chí ${k + 1}` });
      await iconCircle(s, { x: X1 + 0.12, y: y + 0.1, d: 0.42, fill: C.accent1, name: r.i, objectName: `Biểu tượng tiêu chí ${k + 1}` });
      T(s, r.c, { x: X1 + 0.68, y, w: W1 - 0.8, h: RH, fontSize: 14, bold: true, color: C.text1, valign: "middle", objectName: `Nhãn tiêu chí ${k + 1}` });
      if (r.m) {
        box(s, { x: X2, y, w: X3 + W3 - X2, h: RH, rectRadius: 0.08, fill: { color: C.accent1, transparency: 90 }, objectName: `Chung ${k + 1}` });
        T(s, r.m, { x: X2 + 0.25, y, w: X3 + W3 - X2 - 0.4, h: RH, fontSize: 14, color: C.text1, valign: "middle", objectName: `Nội dung chung ${k + 1}` });
      } else {
        box(s, { x: X2, y, w: W2, h: RH, rectRadius: 0.08, fill: { color: C.accent2, transparency: 90 }, objectName: `Dương ${k + 1}` });
        s.addImage({ data: await icon("FaCheck", HEX.accent2), x: X2 + 0.18, y: y + 0.19, w: 0.24, h: 0.24, altText: "Đạt", objectName: `Dấu Dương ${k + 1}` });
        T(s, r.d, { x: X2 + 0.55, y, w: W2 - 0.65, h: RH, fontSize: 14, color: C.text1, valign: "middle", objectName: `Nội dung Dương ${k + 1}` });
        box(s, { x: X3, y, w: W3, h: RH, rectRadius: 0.08, fill: { color: C.accent3, transparency: 90 }, objectName: `Thảo ${k + 1}` });
        s.addShape(S.OVAL, { x: X3 + 0.24, y: y + 0.25, w: 0.12, h: 0.12, fill: { color: C.accent3 }, line: { type: "none" }, objectName: `Chấm Thảo ${k + 1}` });
        T(s, r.t, { x: X3 + 0.55, y, w: W3 - 0.65, h: RH, fontSize: 14, color: C.text1, valign: "middle", objectName: `Nội dung Thảo ${k + 1}` });
      }
    }

    // Kết luận
    box(s, { x: 0.6, y: 5.85, w: 8.2, h: 0.9, fill: { color: C.accent1 }, objectName: "Đề xuất" });
    T(s, "ĐỀ XUẤT", { x: 0.85, y: 5.85, w: 1.2, h: 0.9, fontSize: 12, bold: true, color: C.background1, valign: "middle", charSpacing: 2, objectName: "Nhãn đề xuất" });
    T(s, [
      { text: "→  Giữ lịch nghỉ Thứ Bảy cho Dương", options: { breakLine: true } },
      { text: "→  Chủ động bố trí ngày nghỉ khác phù hợp cho Thảo" },
    ], { x: 2.1, y: 5.85, w: 6.55, h: 0.9, fontSize: 16, bold: true, color: C.background1, valign: "middle", objectName: "Nội dung đề xuất" });
    box(s, { x: 9.0, y: 5.85, w: 3.73, h: 0.9, fill: { color: C.accent4, transparency: 80 }, objectName: "Lưu ý" });
    T(s, "Không chấm điểm việc riêng của ai quan trọng hơn – chỉ xét thời điểm báo & mức độ linh động.", { x: 9.2, y: 5.85, w: 3.4, h: 0.9, fontSize: 13, bold: true, color: C.text1, valign: "middle", objectName: "Nội dung lưu ý" });

    s.addNotes(
`[~65 giây]

Trước khi đưa ra phương án, em cần có căn cứ. Em dùng năm tiêu chí, và áp dụng y hệt cho cả hai bạn: thời điểm đăng ký, mức độ khẩn cấp, khả năng linh động, ảnh hưởng tới vận hành, và quy định nghỉ phép hiện hành.

Đặt hai bạn cạnh nhau: Dương đã báo từ khoảng một tháng trước, ngày cưới của em Dương đã cố định nên gần như không thể đổi. Thảo thì nhu cầu phát sinh sau, và khi được hỏi thêm, Thảo cho biết lịch của mình vẫn có thể dời được.

Em muốn nói rõ một điểm: em giữ ngày nghỉ cho Dương không phải vì em cho rằng đám cưới quan trọng hơn việc riêng của Thảo. Quản lý không có quyền chấm điểm việc riêng của ai đáng hơn ai. Em chỉ dựa vào hai điều: Dương báo trước và lịch không đổi được, còn Thảo xác nhận mình linh động được.

Thật ra xét thứ tự đăng ký thì em đã có cơ sở để giữ lịch cho Dương. Nhưng em vẫn chọn ngồi lại với cả hai bạn, để cả hai cùng nghe một lời giải thích, tránh sau này trong team nói qua nói lại là chị bênh ai.

Với em, công bằng không phải lúc nào cũng là cho hai người cùng một kết quả. Công bằng là cùng một nguyên tắc được áp dụng cho tất cả mọi người, và mình giải thích được vì sao mình quyết định như vậy.`);
  }

  // =====================================================================
  // SLIDE 3 – ROLE-PLAY
  // =====================================================================
  {
    const s = pres.addSlide({ masterName: "LC_CONTENT", sectionTitle: "Phân tích & xử lý" });
    s.addText("03 · ROLE-PLAY: TRƯỞNG CA XỬ LÝ", { placeholder: "kicker" });
    s.addText("Nghe trước – đề xuất sau – hỏi lại", { placeholder: "title" });

    const bubbles = [
      { who: "THÚY · TRƯỞNG CA", side: "L", fill: C.accent1, col: C.accent1, icon: "FaUserTie", y: 1.6, h: 1.0,
        text: "Chị hiểu cả hai em đều có việc riêng. Chị muốn nghe rõ trước khi chốt lịch: việc của bạn nào bắt buộc đúng Thứ Bảy, bạn nào có thể dời sang ngày khác?" },
      { who: "DƯƠNG", side: "R", fill: C.accent2, col: C.accent2, icon: "FaUser", y: 3.0, h: 0.72,
        text: "Dạ đám cưới em của em, em đã báo chị từ tháng trước – ngày đó em không đổi được ạ." },
      { who: "THẢO", side: "R", fill: C.accent3, col: C.accent3, icon: "FaUser", y: 4.15, h: 0.72,
        text: "Dạ em có hẹn với bạn… nhưng nếu cần thì em hẹn bạn lại ngày khác được chị." },
      { who: "THÚY · TRƯỞNG CA", side: "L", fill: C.accent1, col: C.accent1, icon: "FaUserTie", y: 5.3, h: 0.72,
        text: "Chị biết dời hẹn cũng không dễ, cảm ơn Thảo nhiều. Vậy chị đề xuất thế này nhé…" },
    ];
    for (const [k, b] of bubbles.entries()) {
      const L = b.side === "L";
      const bx = L ? 1.3 : 2.0, bw = L ? 6.0 : 5.6;
      await iconCircle(s, { x: L ? 0.6 : 7.75, y: b.y + 0.28, d: 0.55, fill: b.fill, name: b.icon, objectName: `Avatar lời thoại ${k + 1}` });
      T(s, b.who, { x: bx, y: b.y, w: bw, h: 0.26, fontSize: 11, bold: true, color: b.col, align: L ? "left" : "right", charSpacing: 1, objectName: `Người nói ${k + 1}` });
      box(s, { x: bx, y: b.y + 0.28, w: bw, h: b.h, rectRadius: 0.14, fill: { color: b.fill, transparency: 88 }, objectName: `Bong bóng ${k + 1}` });
      T(s, b.text, { x: bx + 0.2, y: b.y + 0.28, w: bw - 0.4, h: b.h, fontSize: 14, color: C.text1, valign: "middle", objectName: `Lời thoại ${k + 1}` });
    }

    // Panel đề xuất
    box(s, { x: 8.75, y: 1.6, w: 3.98, h: 4.95, fill: { color: C.background2 }, objectName: "Panel đề xuất" });
    T(s, "PHƯƠNG ÁN THÚY ĐỀ XUẤT", { x: 9.0, y: 1.75, w: 3.5, h: 0.35, fontSize: 12, bold: true, color: C.accent1, charSpacing: 1, valign: "middle", objectName: "Tiêu đề panel" });
    const items = [
      { f: C.accent2, i: "FaCalendarCheck", t: "Dương nghỉ Thứ Bảy", d: "Đúng lịch đã báo từ trước" },
      { f: C.accent3, i: "FaHandshake", t: "Thảo hỗ trợ ca Thứ Bảy", d: "Sau khi Thảo đồng ý" },
      { f: C.accent3, i: "FaCalendarDays", t: "Thảo được nghỉ ngày khác", d: "CN hoặc ngày phù hợp, theo quy định" },
      { f: C.accent1, i: "FaPeopleGroup", t: "Team hỗ trợ qua lại", d: "Dương & team đứng ca khi Thảo nghỉ" },
    ];
    for (const [k, it] of items.entries()) {
      const y = 2.22 + k * 0.82;
      await iconCircle(s, { x: 9.0, y, d: 0.5, fill: it.f, name: it.i, objectName: `Đề xuất ${k + 1}` });
      T(s, it.t, { x: 9.65, y: y - 0.02, w: 2.95, h: 0.3, fontSize: 14, bold: true, color: C.text1, objectName: `Đề xuất ${k + 1} tiêu đề` });
      T(s, it.d, { x: 9.65, y: y + 0.28, w: 2.95, h: 0.42, fontSize: 12, color: C.accent6, objectName: `Đề xuất ${k + 1} chi tiết` });
    }
    box(s, { x: 9.0, y: 5.58, w: 3.48, h: 0.8, fill: { color: C.accent4, transparency: 78 }, objectName: "Hỏi lại" });
    T(s, [
      { text: "Và hỏi lại: ", options: { bold: true } },
      { text: "“Thảo thấy phương án này ổn không em?”", options: { italic: true } },
    ], { x: 9.18, y: 5.58, w: 3.15, h: 0.8, fontSize: 14, color: C.text1, valign: "middle", objectName: "Câu hỏi lại" });

    s.addNotes(
`[Phần nói ~55 giây – sau đó diễn role-play theo kịch bản bên dưới]

Phần này em xin minh họa bằng một đoạn hội thoại, Thúy là trưởng ca.

Thúy không mở đầu bằng câu "ai được nghỉ". Thúy gặp cả hai bạn cùng lúc, ghi nhận nhu cầu của cả hai, nói rõ vì sao phải trao đổi – là vì ca sẽ thiếu người – rồi hỏi đúng một câu then chốt: việc của bạn nào bắt buộc đúng Thứ Bảy, việc của bạn nào có thể dời được.

Em cũng không để hai bạn tự thương lượng với nhau rồi báo lại, vì như vậy là đẩy áp lực sang nhân viên, và người dễ tính hơn sẽ luôn là người chịu thiệt. Trưởng ca phải là người điều phối.

Khi đã nghe đủ, Thúy mới đề xuất – và luôn kết thúc bằng một câu hỏi lại, để Thảo có tiếng nói, chứ không phải nhận một mệnh lệnh.

==============================
KỊCH BẢN ROLE-PLAY – CASE 1: THẢO ĐỒNG Ý ĐỔI NGÀY
==============================
[Bối cảnh: Dương và Thảo cùng xin nghỉ Thứ Bảy. Thúy mời hai bạn ra trao đổi riêng, ngoài giờ cao điểm.]

DƯƠNG: Chị ơi, Thứ Bảy này em có việc gia đình, em xin nghỉ từ tháng trước rồi đó chị.
THẢO: Dạ Thứ Bảy em cũng có việc riêng, em muốn đăng ký nghỉ ngày đó luôn chị.

THÚY: Chị hiểu là cả Dương và Thảo đều có việc riêng và đều muốn nghỉ Thứ Bảy này. Chị muốn nói chuyện với hai em trước khi chốt lịch, vì nếu cả hai cùng nghỉ thì ca hôm đó chỉ còn khoảng hai người, các bạn ở lại sẽ rất áp lực, khách đông là không xoay kịp.
Chị không muốn tự quyết luôn ai nghỉ, ai đi làm khi chưa nghe rõ hoàn cảnh của hai em. Nếu sắp xếp được, chị muốn cả hai đều giải quyết được việc riêng mà shop vẫn đủ người.
Chị hỏi thêm một chút nhé: việc của bạn nào bắt buộc phải đúng Thứ Bảy, còn bạn nào có thể linh động sang ngày khác được?

DƯƠNG: Dạ hôm đó là đám cưới em của em chị. Em đã đăng ký nghỉ từ trước rồi, ngày đó em không đổi được ạ.

THẢO: Dạ hôm đó em cũng có việc cá nhân, có hẹn với bạn nên em muốn nghỉ ngày đó.

THÚY: Ừ, chị hiểu. Chị hỏi thêm để chị cân đối cho công bằng thôi nha. Lịch của em có bắt buộc phải đúng Thứ Bảy không, hay mình có thể đổi sang Chủ nhật hoặc một ngày khác?

THẢO: Dạ… nếu cần thì em có thể hẹn bạn lại ngày khác.

THÚY: Chị biết dời hẹn cũng không dễ, nên cảm ơn Thảo nhiều. Vậy chị đề xuất thế này nhé.
Dương đã đăng ký ngày này từ khá lâu, đây lại là việc gia đình khó đổi ngày, nên chị giữ lịch nghỉ Thứ Bảy cho Dương.
Thảo hỗ trợ chị ca Thứ Bảy này. Chị sẽ chủ động xếp cho em nghỉ Chủ nhật; nếu Chủ nhật shop cũng thiếu người thì em chọn giúp chị một ngày khác trong tuần mà em thấy tiện. Chị sắp xếp theo đúng quy định đổi ca, đổi ngày nghỉ hiện hành của công ty.
Chị cũng sẽ nói với Dương và mọi người, để hôm Thảo nghỉ thì team đứng ca hỗ trợ lại cho em.
Chị không muốn hiểu theo kiểu Dương được ưu tiên còn Thảo phải chịu thiệt. Chị đang cố để cả hai bạn đều giải quyết được việc riêng, chỉ là ở hai thời điểm khác nhau, để shop vẫn đủ người làm.
Thảo thấy phương án này có ổn với em không?

THẢO: Dạ, vậy cũng được chị.

THÚY (nói với Dương): Dương thì chị giữ lịch nghỉ Thứ Bảy như em đã đăng ký. Nhưng chị cũng mong là sau đó, nếu Thảo có ngày cần đổi, hoặc team thiếu người mà em hỗ trợ được, thì mình hỗ trợ lại cho bạn nha. Chị muốn trong team mình mọi người đỡ nhau qua lại, chứ không để việc nghỉ của một người trở thành áp lực cho người khác.

DƯƠNG: Dạ chị. Hôm nào Thảo nghỉ mà ca cần người thì chị xếp em vào nha. Cảm ơn Thảo nhiều nha.

THÚY (chốt): Vậy mình thống nhất như vậy. Chị cập nhật lịch ca và báo lại cả team.
Sau trường hợp này, chị cũng sẽ thống nhất lại với mọi người cách đăng ký ngày nghỉ: ngày nào đã biết trước thì báo càng sớm càng tốt, theo đúng quy trình hiện hành. Nếu bị trùng ngày, chị sẽ trao đổi dựa trên cùng một nguyên tắc như hôm nay, chứ không xử lý theo cảm tính.

(Nhánh "Thảo cảm thấy chị bênh Dương" – xem ghi chú slide 4.)`);
  }

  // =====================================================================
  // SLIDE 4 – WIN-WIN
  // =====================================================================
  {
    const s = pres.addSlide({ masterName: "LC_CONTENT", sectionTitle: "Phân tích & xử lý" });
    s.addText("04 · GIẢI PHÁP WIN-WIN", { placeholder: "kicker" });
    s.addText("Không ai thắng – không ai thua", { placeholder: "title" });

    const Y = 1.6, H = 3.3, W = 3.85;
    // Dương
    box(s, { x: 0.6, y: Y, w: W, h: H, fill: { color: C.accent2, transparency: 91 }, objectName: "Thẻ Dương" });
    await iconCircle(s, { x: 0.85, y: Y + 0.22, d: 0.65, fill: C.accent2, name: "FaUser", objectName: "Dương" });
    T(s, "DƯƠNG", { x: 1.65, y: Y + 0.22, w: 2.6, h: 0.65, fontSize: 18, bold: true, color: C.accent2, valign: "middle", charSpacing: 1, objectName: "Tên Dương" });
    T(s, "THỨ BẢY → NGHỈ", { x: 0.85, y: Y + 1.05, w: 3.4, h: 0.45, fontSize: 20, bold: true, color: C.text1, objectName: "Kết quả Dương" });
    T(s, [
      { text: "CĂN CỨ", options: { fontSize: 11, bold: true, color: C.accent6, charSpacing: 1, breakLine: true } },
      { text: "Báo trước ~1 tháng + lịch khó thay đổi", options: { fontSize: 14, color: C.text1, breakLine: true } },
      { text: " ", options: { fontSize: 6, breakLine: true } },
      { text: "ĐỒNG THỜI", options: { fontSize: 11, bold: true, color: C.accent6, charSpacing: 1, breakLine: true } },
      { text: "Sẵn sàng hỗ trợ lại Thảo & team khi cần", options: { fontSize: 14, color: C.text1 } },
    ], { x: 0.85, y: Y + 1.6, w: 3.4, h: 1.55, objectName: "Chi tiết Dương" });

    // Shop
    box(s, { x: 4.74, y: Y, w: W, h: H, fill: { color: C.accent1 }, shadow: shadow(), objectName: "Thẻ Shop" });
    await iconCircle(s, { x: 4.99, y: Y + 0.22, d: 0.65, fill: C.text2, name: "FaHouseMedical", objectName: "Shop" });
    T(s, "SHOP", { x: 5.79, y: Y + 0.22, w: 2.6, h: 0.65, fontSize: 18, bold: true, color: C.background1, valign: "middle", charSpacing: 1, objectName: "Tên Shop" });
    T(s, "THỨ BẢY → ĐỦ NGƯỜI", { x: 4.99, y: Y + 1.05, w: 3.45, h: 0.45, fontSize: 20, bold: true, color: C.background1, objectName: "Kết quả Shop" });
    const shopPts = ["Phục vụ tốt khách giờ cao điểm", "Giảm quá tải cho người ở lại", "Trưởng ca chủ động điều phối"];
    for (const [k, t] of shopPts.entries()) {
      const y = Y + 1.68 + k * 0.48;
      s.addImage({ data: await icon("FaCheck", "FFFFFF"), x: 4.99, y: y + 0.06, w: 0.22, h: 0.22, altText: "Đạt", objectName: `Dấu shop ${k + 1}` });
      T(s, t, { x: 5.35, y, w: 3.1, h: 0.36, fontSize: 14, color: C.background1, valign: "middle", objectName: `Lợi ích shop ${k + 1}` });
    }

    // Thảo
    box(s, { x: 8.88, y: Y, w: W, h: H, fill: { color: C.accent3, transparency: 91 }, objectName: "Thẻ Thảo" });
    await iconCircle(s, { x: 9.13, y: Y + 0.22, d: 0.65, fill: C.accent3, name: "FaUser", objectName: "Thảo" });
    T(s, "THẢO", { x: 9.93, y: Y + 0.22, w: 2.6, h: 0.65, fontSize: 18, bold: true, color: C.accent3, valign: "middle", charSpacing: 1, objectName: "Tên Thảo" });
    T(s, [
      { text: "THỨ BẢY → HỖ TRỢ CA", options: { fontSize: 20, bold: true, color: C.text1, breakLine: true } },
      { text: "CN / ngày phù hợp → NGHỈ", options: { fontSize: 17, bold: true, color: C.accent3 } },
    ], { x: 9.13, y: Y + 1.05, w: 3.45, h: 0.8, objectName: "Kết quả Thảo" });
    T(s, [
      { text: "THEO QUY ĐỊNH", options: { fontSize: 11, bold: true, color: C.accent6, charSpacing: 1, breakLine: true } },
      { text: "Đổi ca, ngày nghỉ theo quy định hiện hành của công ty · có sự đồng ý của Thảo", options: { fontSize: 14, color: C.text1 } },
    ], { x: 9.13, y: Y + 2.05, w: 3.4, h: 1.1, objectName: "Chi tiết Thảo" });

    // Dấu cộng
    for (const [k, cx] of [4.595, 8.735].entries()) {
      s.addShape(S.OVAL, { x: cx - 0.22, y: Y + H / 2 - 0.22, w: 0.44, h: 0.44, fill: { color: C.background1 }, line: { color: HEX.accent1, width: 1.5 }, objectName: `Dấu cộng ${k + 1}` });
      T(s, "+", { x: cx - 0.22, y: Y + H / 2 - 0.22, w: 0.44, h: 0.44, fontSize: 20, bold: true, color: C.accent1, align: "center", valign: "middle", objectName: `Ký hiệu cộng ${k + 1}` });
    }

    // Khi Thảo hỏi
    box(s, { x: 0.6, y: 5.12, w: 8.25, h: 1.6, fill: { color: C.accent3, transparency: 91 }, objectName: "Khi Thảo hỏi" });
    T(s, [
      { text: "KHI THẢO HỎI", options: { fontSize: 11, bold: true, color: C.accent3, charSpacing: 1, breakLine: true } },
      { text: "“Sao lúc nào người xin trước cũng được ưu tiên?”", options: { fontSize: 15, bold: true, italic: true, color: C.accent3, breakLine: true } },
      { text: "Thúy: ", options: { fontSize: 14, bold: true, color: C.text1 } },
      { text: "“Chị không chọn vì thân ai hơn hay việc của ai đáng giá hơn – chị dựa vào thời điểm báo và mức độ linh động. Nếu hoàn cảnh ngược lại, chị cũng áp dụng đúng nguyên tắc đó cho em.”", options: { fontSize: 14, color: C.text1 } },
    ], { x: 0.85, y: 5.12, w: 7.8, h: 1.6, valign: "middle", paraSpaceAfter: 3, objectName: "Đối thoại Thảo" });
    box(s, { x: 9.05, y: 5.12, w: 3.68, h: 1.6, fill: { color: C.text2 }, objectName: "Nguyên tắc" });
    await iconCircle(s, { x: 9.3, y: 5.3, d: 0.5, fill: C.accent4, name: "FaHandHoldingHeart", color: HEX.dk2, objectName: "Nguyên tắc biểu tượng" });
    T(s, "Người hỗ trợ shop không được trở thành người chịu thiệt.", { x: 9.3, y: 5.88, w: 3.25, h: 0.75, fontSize: 16, bold: true, color: C.background1, objectName: "Nguyên tắc nội dung" });

    s.addNotes(
`[~65 giây]

Kết quả của cuộc trao đổi là một phương án mà em gọi là không ai thắng, không ai thua.

Dương nghỉ Thứ Bảy đúng như đã đăng ký. Nhưng được team hỗ trợ lần này thì Dương cũng có trách nhiệm hỗ trợ lại khi phù hợp.

Thảo đi làm Thứ Bảy, và được bố trí nghỉ Chủ nhật hoặc một ngày khác phù hợp. Ở đây em phải xem luôn lịch Chủ nhật, vì nếu Chủ nhật cũng thiếu người thì em chỉ đang dời vấn đề sang ngày khác. Việc đổi ca, đổi ngày nghỉ em làm theo quy định hiện hành của công ty và có sự đồng ý của Thảo – em không tự áp đặt hình thức tăng ca.

Còn shop thì Thứ Bảy đủ người, khách được phục vụ tốt hơn, các bạn ở lại không bị quá tải.

Nếu Thảo vẫn chưa thoải mái và hỏi "sao người xin trước luôn được ưu tiên", em sẽ không phản ứng kiểu "chị là trưởng ca, chị quyết". Em thừa nhận cảm giác của bạn, nói lại hai căn cứ, và cam kết: hoàn cảnh ngược lại thì em cũng áp dụng đúng nguyên tắc đó cho Thảo.

Khi nhân viên chịu hỗ trợ shop, em không xem đó là điều hiển nhiên. Người hỗ trợ shop không được trở thành người chịu thiệt.

==============================
KỊCH BẢN NHÁNH: NẾU THẢO CẢM THẤY "CHỊ BÊNH DƯƠNG"
==============================
THẢO: Nhưng em cũng xin nghỉ mà chị. Sao lúc nào người xin trước cũng được ưu tiên?

THÚY: Chị hiểu, nếu đứng ở vị trí của em thì chị cũng có thể thấy như vậy. Nên chị nói rõ để em hiểu: chị không chọn Dương vì thân ai hơn, hay vì việc của ai đáng giá hơn.
Chị dựa vào hai điều. Một là Dương đã báo lịch này từ khá lâu, nên shop đã có cơ sở để ghi nhận. Hai là khi chị hỏi cả hai, thì lịch của Dương gần như không đổi được, còn em nói với chị là mình vẫn có thể linh động.
Nếu hôm nay hoàn cảnh ngược lại – em là người báo trước và việc của em không thể thay đổi – chị cũng sẽ áp dụng đúng nguyên tắc đó cho em.
Còn nếu việc của em thật ra là việc gấp mà em ngại nói trước mọi người, em cứ nói riêng với chị, chị sẽ cân nhắc lại.
Và vì em hỗ trợ shop lần này, chị có trách nhiệm cân đối lại ngày nghỉ phù hợp cho em, chứ chị không xem việc em hỗ trợ là đương nhiên.`);
  }

  // =====================================================================
  // SLIDE 5 – CASE 2
  // =====================================================================
  pres.addSection({ title: "Phương án dự phòng" });
  {
    const s = pres.addSlide({ masterName: "LC_CONTENT", sectionTitle: "Phương án dự phòng" });
    s.addText("05 · CASE 2: CẢ HAI ĐỀU KHÔNG ĐỒNG Ý ĐỔI", { placeholder: "kicker" });
    s.addText("Nếu cả hai đều không thể đổi?", { placeholder: "title" });

    box(s, { x: 0.6, y: 1.58, w: 7.25, h: 1.45, fill: { color: C.background2 }, objectName: "Nguyên tắc case 2" });
    T(s, [
      { text: "Không ép nhân viên trước khi đã kiểm tra các phương án vận hành.", options: { fontSize: 16, bold: true, color: C.accent1, breakLine: true } },
      { text: "“Nếu cả hai thực sự không thể thay đổi, chị sẽ không tranh luận thêm ở đây. Chị sẽ báo ASM và kiểm tra phương án bổ sung, điều phối nhân sự theo quy trình.”", options: { fontSize: 14, italic: true, color: C.text1 } },
    ], { x: 0.85, y: 1.58, w: 6.8, h: 1.45, valign: "middle", paraSpaceAfter: 4, objectName: "Nội dung nguyên tắc" });

    const steps = [
      { t: "Xác nhận lại", d: "Cả hai đều không đổi được? Nói rõ: ca chỉ còn ~2 người" },
      { t: "Xem lại lần cuối", d: "Trao đổi riêng từng bạn; đổi giờ ca nếu quy định cho phép" },
      { t: "Điều chỉnh ca", d: "Tìm bạn tự nguyện đổi ca, hỗ trợ" },
      { t: "Trưởng ca / SM đứng ca", d: "Trực tiếp hỗ trợ nếu phù hợp" },
      { t: "Báo ASM", d: "Xin bổ sung, điều phối từ shop khác nếu quy trình cho phép" },
    ];
    const BASE = 6.6, SW = 1.78;
    for (const [k, st] of steps.entries()) {
      const x = 0.6 + k * (SW + 0.07);
      const top = 4.7 - k * 0.45;
      const solid = k >= 3;
      const fill = k === 4 ? { color: C.text2 } : k === 3 ? { color: C.accent1 } : { color: C.accent1, transparency: [86, 76, 64][k] };
      const txt = solid ? C.background1 : C.text1;
      box(s, { x, y: top, w: SW, h: BASE - top, rectRadius: 0.08, fill, objectName: `Bậc ${k + 1}` });
      s.addShape(S.OVAL, { x: x + 0.15, y: top + 0.15, w: 0.42, h: 0.42, fill: { color: solid ? C.background1 : C.accent1 }, line: { type: "none" }, objectName: `Số bậc ${k + 1}` });
      T(s, String(k + 1), { x: x + 0.15, y: top + 0.15, w: 0.42, h: 0.42, fontSize: 15, bold: true, color: solid ? (k === 4 ? C.text2 : C.accent1) : C.background1, align: "center", valign: "middle", objectName: `Chữ số bậc ${k + 1}` });
      T(s, [
        { text: st.t, options: { fontSize: 14, bold: true, color: txt, breakLine: true } },
        { text: st.d, options: { fontSize: 12, color: txt } },
      ], { x: x + 0.15, y: top + 0.68, w: SW - 0.27, h: BASE - top - 0.8, paraSpaceAfter: 3, objectName: `Nội dung bậc ${k + 1}` });
    }
    arrow(s, 9.8, 4.0, 0.22, HEX.accent6, "Mũi tên sang quyết định");

    // Quyết định cuối
    box(s, { x: 10.05, y: 1.58, w: 2.68, h: 5.02, fill: { color: C.accent4 }, objectName: "Quyết định cuối" });
    await iconCircle(s, { x: 10.28, y: 1.78, d: 0.6, fill: C.text2, name: "FaScaleBalanced", objectName: "Quyết định" });
    T(s, [
      { text: "NẾU VẪN KHÔNG GIẢI QUYẾT", options: { fontSize: 11, bold: true, color: C.text1, charSpacing: 1, breakLine: true } },
      { text: "Ra quyết định theo SOP + căn cứ + thẩm quyền", options: { fontSize: 16, bold: true, color: C.text1 } },
    ], { x: 10.28, y: 2.5, w: 2.3, h: 1.05, paraSpaceAfter: 3, objectName: "Tiêu đề quyết định" });
    T(s, ["Quy định nghỉ phép hiện hành", "Ai đăng ký & được xác nhận trước", "Tính cấp thiết, hoàn cảnh cụ thể", "Nhân sự tối thiểu để vận hành an toàn", "Vượt thẩm quyền → báo ASM quyết định"].map((t, i, a) => ({
      text: t, options: { bullet: { indent: 12 }, breakLine: i < a.length - 1 },
    })), { x: 10.28, y: 3.7, w: 2.3, h: 2.75, fontSize: 13, color: C.text1, paraSpaceAfter: 6, objectName: "Căn cứ quyết định" });

    s.addNotes(
`[~70 giây]

Bây giờ là trường hợp khó hơn: cả Dương và Thảo đều nói không thể đổi.

Em sẽ không lập tức nói "vậy Thảo đi làm". Em đi theo từng nấc: giải quyết trong team trước, rồi mới leo thang.

Một, em xác nhận lại với cả hai, và nói rõ hệ quả: ca chỉ còn khoảng hai người, khách đông sẽ ảnh hưởng tư vấn, bán hàng và tạo áp lực rất lớn cho các bạn còn lại.

Hai, em mời hai bạn xem lại một lần cuối. Em sẽ trao đổi riêng với từng bạn, vì có những việc nhân viên ngại nói trước đồng nghiệp. Và xem có thể đổi giờ ca không, nếu quy định cho phép.

Ba, em kiểm tra điều chỉnh ca, hỏi xem có bạn nào tự nguyện đổi ca hoặc hỗ trợ.

Bốn, trưởng ca hoặc SM trực tiếp đứng ca nếu phù hợp.

Năm, nếu vẫn thiếu, em báo ASM để xin bổ sung hoặc điều phối nhân sự từ shop khác, nếu cơ chế hiện hành cho phép.

Chỉ khi tất cả đều không được, em mới ra quyết định – dựa trên quy định nghỉ phép, ai đăng ký và được xác nhận trước, tính cấp thiết, hoàn cảnh cụ thể, nhân sự tối thiểu để shop vận hành an toàn, và đúng thẩm quyền của mình. Việc gì vượt thẩm quyền thì em báo ASM quyết định. Phương án làm thêm giờ chỉ xem xét sau cùng, đúng quy định công ty, đúng giới hạn pháp luật và có sự đồng thuận của nhân viên.

Nguyên tắc của em là: không ép nhân viên trước khi đã kiểm tra hết các phương án vận hành.

==============================
KỊCH BẢN ROLE-PLAY – CASE 2: CẢ HAI ĐỀU KHÔNG ĐỒNG Ý ĐỔI
==============================
DƯƠNG: Em không đổi được chị ơi.
THẢO: Em cũng không đổi được ạ.

[Bước 1 – Xác nhận lại]
THÚY: Chị hiểu. Vậy hiện tại cả hai em đều xác nhận việc của mình không thể đổi, đúng không?

[Bước 2 – Nhắc lại vấn đề vận hành]
THÚY: Chị tôn trọng nhu cầu của cả hai em. Nhưng với vai trò trưởng ca, chị cũng phải đảm bảo shop đủ người. Nếu cả hai cùng nghỉ thì ca chỉ còn khoảng hai người. Khi khách đông sẽ ảnh hưởng tới tư vấn, bán hàng và các công việc khác, đồng thời tạo áp lực rất lớn cho những bạn còn lại.

[Bước 3 – Chưa vội ép]
THÚY: Chị vẫn muốn hai em xem lại một lần cuối xem có phương án nào linh động được không – ví dụ đổi giờ ca, nếu quy định cho phép. Chị ưu tiên tìm giải pháp trong team trước. Lát nữa chị nói chuyện riêng với từng em một chút nhé, có gì chưa tiện nói thì em cứ nói riêng với chị.

[Bước 4 – Tìm backup, nếu vẫn không được]
THÚY: Nếu cả hai thực sự đều không thể thay đổi, chị sẽ không tranh luận thêm ở đây. Chị sẽ xem lại lịch ca, hỏi xem có bạn nào tự nguyện hỗ trợ được không, bản thân chị cũng có thể đứng ca. Đồng thời chị báo ASM và kiểm tra phương án bổ sung hoặc điều phối nhân sự theo quy trình, để xem có cách nào đảm bảo cả nhu cầu cá nhân lẫn hoạt động shop. Có kết quả chị báo lại hai em sớm nhất có thể để hai em còn chủ động sắp xếp.

[Bước 5 – Nếu không có nguồn hỗ trợ, phải ra quyết định]
THÚY: Chị đã kiểm tra hết các phương án rồi, và shop không thể vận hành an toàn nếu cả hai cùng nghỉ. Nên chị phải quyết định theo quy định nghỉ phép hiện hành và đúng những căn cứ chị đã nói với hai em: thời điểm đăng ký, mức độ cấp thiết và hoàn cảnh cụ thể. Theo các căn cứ đó, chị giữ lịch nghỉ của Dương vì đã được ghi nhận từ trước.
Thảo, chị biết điều này không dễ với em. Chị sẽ ưu tiên sắp xếp cho em một ngày nghỉ phù hợp sớm nhất có thể. Nếu việc của em là việc khẩn cấp, em báo chị ngay để chị trao đổi với ASM.`);
  }

  // =====================================================================
  // SLIDE 6 – TƯ DUY QUẢN LÝ
  // =====================================================================
  pres.addSection({ title: "Kết luận" });
  {
    const s = pres.addSlide({ masterName: "LC_DARK", sectionTitle: "Kết luận" });
    s.addText("06 · TƯ DUY QUẢN LÝ", { placeholder: "kicker" });
    s.addText([
      { text: "Dẫn dắt bằng nguyên tắc,", options: { color: C.accent5, breakLine: true } },
      { text: "không bằng quyền lực" },
    ], { placeholder: "title" });

    const pts = [
      { h: "LẮNG NGHE", d: "→ hiểu hoàn cảnh", i: "FaEarListen" },
      { h: "CÓ CĂN CỨ", d: "→ không xử lý cảm tính", i: "FaClipboardCheck" },
      { h: "CÔNG BẰNG", d: "→ người hỗ trợ không bị thiệt", i: "FaScaleBalanced" },
      { h: "CÓ DỰ PHÒNG", d: "→ shop không bị động", i: "FaShieldHalved" },
    ];
    for (const [k, p] of pts.entries()) {
      const x = 0.6 + k * 3.07;
      box(s, { x, y: 2.5, w: 2.92, h: 2.0, fill: { color: C.background1, transparency: 90 }, objectName: `Tư duy ${k + 1}` });
      await iconCircle(s, { x: x + 0.25, y: 2.7, d: 0.68, fill: C.accent5, name: p.i, color: HEX.dk2, objectName: p.h });
      T(s, p.h, { x: x + 0.25, y: 3.5, w: 2.5, h: 0.4, fontSize: 19, bold: true, color: C.background1, charSpacing: 1, objectName: `Tư duy ${k + 1} tiêu đề` });
      T(s, p.d, { x: x + 0.25, y: 3.9, w: 2.5, h: 0.55, fontSize: 15, color: C.accent5, objectName: `Tư duy ${k + 1} mô tả` });
    }

    T(s, "“Em không muốn giải quyết một ngày nghỉ rồi tạo ra một mâu thuẫn mới trong team.”", { x: 0.6, y: 4.66, w: 12.13, h: 0.52, fontSize: 21, italic: true, color: C.background1, align: "center", valign: "middle", objectName: "Câu chốt" });

    T(s, "MỤC TIÊU SAU CUỘC TRAO ĐỔI", { x: 0.6, y: 5.32, w: 6, h: 0.28, fontSize: 12, bold: true, color: C.accent5, charSpacing: 2, objectName: "Nhãn mục tiêu" });
    const goals = [
      { n: "Dương", d: " – nhu cầu chính đáng được tôn trọng", f: C.accent2, i: "FaUser" },
      { n: "Thảo", d: " – được đối xử công bằng", f: C.accent3, i: "FaUser" },
      { n: "Shop", d: " – đủ người phục vụ khách hàng", f: C.accent1, i: "FaHouseMedical" },
    ];
    for (const [k, g] of goals.entries()) {
      const x = 0.6 + k * 4.12;
      box(s, { x, y: 5.68, w: 3.89, h: 0.9, fill: { color: C.background1, transparency: 90 }, objectName: `Mục tiêu ${g.n}` });
      await iconCircle(s, { x: x + 0.2, y: 5.855, d: 0.55, fill: g.f, name: g.i, objectName: `Mục tiêu ${g.n} biểu tượng` });
      T(s, [
        { text: g.n, options: { bold: true } },
        { text: g.d },
      ], { x: x + 0.9, y: 5.68, w: 2.85, h: 0.9, fontSize: 15, color: C.background1, valign: "middle", objectName: `Mục tiêu ${g.n} nội dung` });
    }

    s.addNotes(
`[~60 giây]

Để tổng kết, em muốn thể hiện bốn điều trong cách xử lý.

Lắng nghe – để hiểu hoàn cảnh của từng bạn trước khi quyết.

Có căn cứ – em đánh giá dựa trên thời điểm đăng ký, mức độ linh động, quy định và ảnh hưởng vận hành, chứ không đánh giá việc riêng của ai quan trọng hơn ai.

Công bằng – cùng một nguyên tắc cho mọi người, và người hỗ trợ shop không bị thiệt.

Có dự phòng – sau tình huống này em thống nhất lại với team cách đăng ký ngày nghỉ theo quy trình hiện hành, nắm trước những bạn sẵn sàng tự nguyện đổi ca khi cần, để lần sau shop không bị động.

Quan điểm của em là khi hai nhân viên cùng xin nghỉ, em không muốn biến nó thành câu chuyện ai thắng – ai thua. Em không muốn giải quyết được một ngày nghỉ mà lại tạo ra một mâu thuẫn mới trong team.

Mục tiêu của em là sau cuộc trao đổi, Dương cảm thấy nhu cầu chính đáng của mình được tôn trọng, Thảo cảm thấy mình được đối xử công bằng, còn shop vẫn đủ người để phục vụ khách hàng.

Em xin cảm ơn thầy và mọi người đã lắng nghe.`);
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("Wrote", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
