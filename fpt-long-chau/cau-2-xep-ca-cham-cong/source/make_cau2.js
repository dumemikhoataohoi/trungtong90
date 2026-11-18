// Câu 2 – Sắp xếp ca và chấm công: trích nội dung 6 slide + bổ sung chấm công chi tiết
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, TabStopType, Footer, PageNumber, HeadingLevel, LevelFormat, VerticalAlign,
} = require("docx");

const OUT = process.argv[2];
const COL = { navy: "0E2F7A", blue: "163F9F", orange: "F58220", green: "1E7B34", teal: "0F7C7C", red: "C62828", slate: "40516B", muted: "6B7890", border: "D9E2F1", text: "122033" };
const W = 9638;

// ---------- helpers ----------
const r = (text, o = {}) => new TextRun({ text, ...o });
const P = (runs, o = {}) => new Paragraph({ children: (Array.isArray(runs) ? runs : [runs]).map((x) => (typeof x === "string" ? r(x) : x)), spacing: { after: 120 }, ...o });
const H1 = (num, title) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [r(num, { color: COL.orange }), r(title)] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [r(t)] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [r(t)] });
const label = (t, color = COL.orange) => P(r(t, { size: 18, bold: true, color, characterSpacing: 20 }), { spacing: { before: 160, after: 60 }, keepNext: true });
const bullet = (runs, level = 0) => new Paragraph({ numbering: { reference: "bullets", level }, spacing: { after: 60 }, children: (Array.isArray(runs) ? runs : [runs]).map((x) => (typeof x === "string" ? r(x) : x)) });
const bl = (head, rest) => bullet([r(head, { bold: true }), r(rest)]);
// lời thuyết trình: đoạn có nền xanh nhạt
const speech = (paras) => {
  const nb = { style: BorderStyle.SINGLE, size: 4, color: "EEF3FC" };
  return [
    label("LỜI THUYẾT TRÌNH", COL.blue),
    new Table({
      width: { size: W, type: WidthType.DXA }, columnWidths: [W],
      rows: [new TableRow({ cantSplit: true, children: [new TableCell({
        width: { size: W, type: WidthType.DXA }, borders: { top: nb, bottom: nb, left: nb, right: nb },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: "EEF3FC" },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        children: paras.map((t, i) => new Paragraph({ children: [r(t)], spacing: { after: i < paras.length - 1 ? 120 : 0, line: 312 } })),
      })] })],
    }),
    new Paragraph({ children: [], spacing: { after: 120 } }),
  ];
};
const quote = (t) => P(r(t, { bold: true, italics: true, color: COL.navy }), { alignment: AlignmentType.CENTER, spacing: { before: 120, after: 160 } });

const cb = { style: BorderStyle.SINGLE, size: 4, color: COL.border };
const borders = { top: cb, bottom: cb, left: cb, right: cb };
function cell(content, w, o = {}) {
  const runs = Array.isArray(content) ? content : [r(String(content), { bold: !!o.bold, color: o.color || COL.text, size: o.size || 20 })];
  return new TableCell({
    width: { size: w, type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.CENTER,
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    children: [new Paragraph({ children: runs, alignment: o.align })],
  });
}
function table(widths, header, rows, o = {}) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: header.map((h, i) => cell(h, widths[i], { bold: true, color: "FFFFFF", fill: COL.navy, size: o.headSize || 20, align: o.center && o.center.includes(i) ? AlignmentType.CENTER : undefined })) }),
      ...rows.map((row) => new TableRow({ cantSplit: true, children: row.map((c, i) => (c instanceof TableCell ? c : cell(c, widths[i], { size: o.size, align: o.center && o.center.includes(i) ? AlignmentType.CENTER : undefined, bold: o.boldFirst && i === 0 }))) })),
    ],
  });
}
const gap = () => P("", { spacing: { after: 80 } });

// ---------- dữ liệu lịch slide 4 ----------
const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const STAFF = [
  ["NV1", "Chuyên môn tốt · Hỗ trợ người mới", ["Sáng", "OFF", "Sáng", "Sáng", "Chiều", "Sáng", "Sáng"]],
  ["NV2", "Bán hàng tốt · Xử lý nhanh", ["Chiều", "Sáng", "Chiều", "OFF", "Sáng", "Chiều", "Chiều"]],
  ["NV3", "Kinh nghiệm trung bình · Ổn định", ["Chiều", "Chiều", "Sáng", "Chiều", "Chiều", "OFF", "Gãy"]],
  ["NV4", "Người mới · Cần được hỗ trợ", ["Sáng", "Sáng", "Chiều", "Chiều", "Sáng", "Chiều", "OFF"]],
  ["NV5", "Linh hoạt · Hỗ trợ ca gãy", ["Gãy", "Gãy", "Chiều", "Gãy", "OFF", "Gãy", "Chiều"]],
  ["NV6", "Cần coaching · Tránh ca phức tạp", ["Chiều", "Chiều", "OFF", "Chiều", "Chiều", "Chiều", "Chiều"]],
  ["NV7", "Ổn định · Nhân sự dự phòng", ["OFF", "Chiều", "Gãy", "Sáng", "Gãy", "Sáng", "Sáng"]],
];
const SHIFT = { "Sáng": { s: 7, e: 15, fill: "EAF1FF", color: COL.blue }, "Chiều": { s: 15, e: 22, fill: "EAF8EE", color: COL.green }, "Gãy": { s: 8, e: 20, fill: "FFF4E8", color: "B85C00" }, "OFF": { fill: "FDEBEC", color: COL.red } };
// tìm các lần chuyển ca nghỉ < 12 giờ
const short = [];
for (const [nv, , days] of STAFF) {
  for (let d = 0; d < 6; d++) {
    const a = SHIFT[days[d]], b = SHIFT[days[d + 1]];
    if (a.e === undefined || b.s === undefined) continue;
    const rest = 24 - a.e + b.s;
    if (rest < 12) short.push([nv, `${DAYS[d]} ${days[d]} → ${DAYS[d + 1]} ${days[d + 1]}`, `${rest} giờ`]);
  }
}
const scheduleTable = () => {
  const widths = [700, 2420, 931, 931, 931, 931, 931, 931, 932];
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: ["NV", "Năng lực", ...DAYS].map((h, i) => cell(h, widths[i], { bold: true, color: "FFFFFF", fill: COL.navy, size: 17, align: i > 1 ? AlignmentType.CENTER : undefined })) }),
      ...STAFF.map(([nv, cap, days]) => new TableRow({ cantSplit: true, children: [
        cell(nv, widths[0], { bold: true, size: 17 }),
        cell(cap, widths[1], { size: 16, color: COL.slate }),
        ...days.map((d, i) => cell(d, widths[i + 2], { size: 17, fill: SHIFT[d].fill, color: SHIFT[d].color, bold: true, align: AlignmentType.CENTER })),
      ] })),
    ],
  });
};

// ---------- nội dung ----------
const body = [];

// Trang đầu
body.push(
  P(r("BÀI THI THĂNG CẤP QUẢN LÝ NHÀ THUỐC (SM) • FPT LONG CHÂU • CHỦ ĐỀ 2: QUẢN TRỊ NHÂN SỰ", { size: 18, bold: true, color: COL.orange, characterSpacing: 20 }), { spacing: { after: 80 } }),
  new Paragraph({ heading: HeadingLevel.TITLE, children: [r("Câu 2 – Sắp xếp ca và chấm công cho nhân viên")] }),
  P([r("Đề bài: ", { bold: true }), r("“Em hãy trình bày việc sắp xếp ca và chấm công cho nhân viên?”", { italics: true })]),
  P(r("Tài liệu gồm 3 phần:", { bold: true }), { spacing: { after: 60 } }),
  bl("Phần A – ", "Nội dung 6 slide hiện có: chữ trên slide và lời thuyết trình, chép nguyên văn."),
  bl("Phần B – ", "Bổ sung chấm công chi tiết, gồm 2 slide đề xuất thêm (slide 7–8) kèm lời thuyết trình, và câu hỏi giảng viên có thể hỏi."),
  bl("Phần C – ", "Lưu ý khi rà lịch mô phỏng ở slide 4 (nghỉ chuyển ca)."),
  gap(),
  P([r("Vì sao cần bổ sung: ", { bold: true, color: COL.red }), r("đề hỏi cả xếp ca và chấm công, nhưng bộ slide hiện tại mới nhắc chấm công ở một câu trong slide 1 (“Chấm công phải chính xác, minh bạch”). Nếu không có phần chấm công riêng, giảng viên dễ đánh giá là bài trả lời chưa đủ ý.")]),
);

// ---------- PHẦN A ----------
body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 200 }, children: [r("PHẦN A · ", { color: COL.orange }), r("Nội dung 6 slide hiện có")] }));

body.push(H2("Slide 1 · Mở đầu"));
body.push(label("TRÊN SLIDE"));
body.push(bl("4 tiêu chí: ", "Đúng nhu cầu · Đúng năng lực · Đúng thời điểm · Đúng tải."));
body.push(bl("Câu chốt: ", "“Em không xếp ca chỉ để đủ người. Em xếp ca để shop vận hành tốt.”"));
body.push(...speech(["Với em, xếp ca là bài toán vận hành chứ không chỉ chia đủ người. Ngoài tư vấn khách còn có nhận hàng, kiểm kê, trưng bày, học quy trình mới và hoạt động nhà thuốc. Chấm công phải chính xác, minh bạch."]));

body.push(H2("Slide 2 · Bước 0 – Hiểu nhu cầu: Trước khi xếp ca, SM cần nhìn những gì?"));
body.push(label("TRÊN SLIDE"));
body.push(bl("Phụ đề: ", "Không mở bảng lịch trước khi hiểu nhu cầu vận hành."));
body.push(bl("8 yếu tố: ", "01 Lưu lượng khách · 02 Giờ cao / thấp điểm · 03 Nhân sự thực tế · 04 Năng lực từng người · 05 Mới / có kinh nghiệm · 06 Nghỉ / phép / đào tạo · 07 Công việc / chương trình · 08 Bàn giao giữa ca."));
body.push(bl("Giờ đông: ", "Ưu tiên người xử lý khách tốt, vững chuyên môn và phối hợp hiệu quả."));
body.push(bl("Lưu ý: ", "Người mới nên làm cùng người có thể hỗ trợ."));
body.push(...speech(["Em không bắt đầu từ việc có bao nhiêu người rồi chia đều. Em nhìn lưu lượng khách, cao điểm, công việc, bàn giao, đào tạo và cơ cấu năng lực. Đủ người chưa chắc đủ năng lực; người mới cần được ghép với người có khả năng hỗ trợ."]));

body.push(H2("Slide 3 · Khung ra quyết định: Nguyên tắc xếp ca của em – “5 ĐÚNG”"));
body.push(label("TRÊN SLIDE"));
body.push(table([2400, 7238], ["5 ĐÚNG trong xếp ca", "Ý nghĩa"], [
  ["01 Đúng nhu cầu", "Đảm bảo đủ người theo dự báo lưu lượng khách và doanh số."],
  ["02 Đúng năng lực", "Phân ca theo kỹ năng, kinh nghiệm và vai trò phù hợp."],
  ["03 Đúng thời điểm", "Bố trí nhân sự đúng khung giờ cao điểm và đặc thù khu vực."],
  ["04 Đúng tải", "Cân đối khối lượng công việc, tránh quá tải hoặc nhàn rỗi."],
  ["05 Đúng nguyên tắc", "Tuân thủ quy định, công bằng, minh bạch và linh hoạt."],
], { boldFirst: true }));
body.push(gap());
body.push(bl("Thông điệp ở giữa: ", "Đủ người chưa chắc đủ năng lực."));
body.push(...speech(["Năm đúng là cách em tự kiểm trước khi chốt lịch. Công bằng không phải chia ca y hệt nhau, mà sử dụng cùng nguyên tắc, có căn cứ và giải thích được."]));

body.push(H2("Slide 4 · Mô phỏng năng lực + lịch ca: 7 nhân viên × 7 ngày – không chỉ nhìn đủ đầu người"));
body.push(label("TRÊN SLIDE"));
body.push(bl("Ca: ", "Sáng 07:00–15:00 · Chiều 15:00–22:00 · Gãy 08:00–12:00 + 17:00–20:00 · OFF nghỉ cả ngày."));
body.push(scheduleTable());
body.push(gap());
body.push(bl("Mục tiêu: ", "Giờ cao điểm có người mạnh • NV4 có người hỗ trợ • Ca gãy không dồn hoàn toàn vào một người."));
body.push(bl("Ghi chú: ", "Giờ ca và lịch chỉ để mô phỏng; áp dụng theo SOP/chính sách công ty."));
body.push(P([r("⚠ Xem Phần C: ", { bold: true, color: COL.red }), r(`có ${short.length} chỗ chuyển ca nghỉ dưới 12 giờ.`, { color: COL.red })]));
body.push(...speech(["Ghép năng lực khi xếp ca: nhân viên có kinh nghiệm nên được phân bổ để hỗ trợ nhân viên mới, ca cao điểm có người vững chuyên môn. Lịch 7 nhân viên x 7 ngày là mô phỏng, không phải cơ cấu thực tế chính thức của Long Châu. Lịch áp dụng thực tế theo SOP và chính sách hiện hành."]));

body.push(H2("Slide 5 · Xử lý tình huống: NV3 xin nghỉ – Khôi phục năng lực của ca"));
body.push(label("TRÊN SLIDE"));
body.push(bl("Ca trước phát sinh (giả định): ", "NV1 Sáng · NV2 Chiều · NV3 Chiều (xin nghỉ) · NV4 Sáng · NV5 Gãy · NV6 Chiều · NV7 OFF."));
body.push(bl("SM kiểm tra trước khi quyết định: ", "Lý do nghỉ • Mức khẩn cấp • Ca mất năng lực gì • Phương án hỗ trợ phù hợp."));
body.push(table([2400, 7238], ["Phương án", "Điều kiện"], [
  ["01 NV7 hỗ trợ thay", "Chỉ khi phù hợp, có đồng thuận và đúng quy định."],
  ["02 Điều chỉnh ca gãy", "Dịch khung hỗ trợ trong giới hạn giờ làm/nghỉ và SOP."],
  ["03 SM trực tiếp hỗ trợ", "Ưu tiên khách hàng, dời việc chưa cấp thiết, giảm tải team."],
], { boldFirst: true }));
body.push(gap());
body.push(bl("Thông điệp: ", "Không chỉ thay 1 người – phải khôi phục năng lực cả ca."));
body.push(...speech(["Tình huống mô phỏng NV3 xin nghỉ: SM xác minh tình trạng và ca đang mất năng lực gì, xem phương án backup theo quy trình. Phương án NV7 chỉ khi phù hợp, được đồng thuận, đúng quy định. Có thể điều chỉnh ca gãy hoặc SM trực tiếp hỗ trợ. Mục tiêu là khôi phục năng lực của ca, không chỉ điền tên người vào ô trống."]));

body.push(H2("Slide 6 · Điều phối theo nhu cầu: Ca gãy – Nguồn lực đi theo điểm nghẽn"));
body.push(label("TRÊN SLIDE"));
body.push(bl("Phụ đề: ", "Ca gãy không phải giải pháp mặc định; trước hết cần hiểu nhu cầu hỗ trợ của từng khung giờ."));
body.push(bl("Timeline minh họa NV5: ", "08:00–12:00 Hỗ trợ · 12:00–17:00 Nghỉ / không làm · 17:00–20:00 Hỗ trợ (nhu cầu mô phỏng: thấp – cao – thấp – cao)."));
body.push(table([2400, 7238], ["Tình huống", "Cách xử lý"], [
  ["1. NV5 ca gãy xin nghỉ", "Xác định ca gãy phục vụ nhu cầu gì; không nhất thiết thay bằng ca gãy khác."],
  ["2. NV1 ↔ NV4 muốn đổi ca", "Soát lại năng lực, hỗ trợ người mới và thời giờ làm/nghỉ."],
  ["3. Cao điểm bất ngờ", "Điều phối người mạnh, dời việc chưa cấp thiết; SM tham gia hỗ trợ."],
], { boldFirst: true }));
body.push(gap());
body.push(bl("Câu chốt: ", "“Em không đứng ngoài chỉ huy khi shop đang nghẽn.” Ca gãy là công cụ điều phối nguồn lực, không phải giải pháp mặc định."));
body.push(...speech(["Với ca gãy em không mặc định thiếu là thay bằng ca gãy khác, mà xem khung giờ đó giải quyết nhu cầu gì. Nếu NV5 xin nghỉ, cần đánh giá lại nhu cầu trước khi điều chỉnh. Đổi ca NV1 và NV4 phải đảm bảo năng lực và hỗ trợ người mới. Khi cao điểm bất ngờ, ưu tiên khách hàng và việc cốt lõi; SM hỗ trợ trực tiếp nếu cần."]));

// ---------- PHẦN B ----------
body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [r("PHẦN B · ", { color: COL.orange }), r("Bổ sung: Chấm công chi tiết")] }));
body.push(quote("“Lịch ca là kế hoạch, chấm công là thực tế. SM phải làm cho hai thứ này khớp nhau.”"));

body.push(H2("B1. Vì sao chấm công quan trọng"));
body.push(bl("Quyền lợi nhân viên: ", "công là căn cứ tính lương, phụ cấp, làm thêm giờ, phép năm. Chấm sai một ngày là ảnh hưởng thu nhập và niềm tin của nhân viên."));
body.push(bl("Dữ liệu vận hành: ", "so lịch ca (kế hoạch) với giờ làm thực tế giúp SM thấy ca nào thiếu người, ai bị dồn việc, giờ làm thêm có bất thường không."));
body.push(bl("Tuân thủ: ", "giờ làm, giờ nghỉ, làm thêm phải đúng quy định công ty và Bộ luật Lao động. Dữ liệu chấm công là bằng chứng khi cần đối chiếu."));

body.push(H2("B2. Nguyên tắc “4 ĐÚNG” trong chấm công"));
body.push(table([1900, 3700, 4038], ["Nguyên tắc", "Nghĩa là", "SM làm gì"], [
  ["Đúng người", "Ai làm người đó chấm, bằng tài khoản/thiết bị của chính mình.", "Không chấm hộ, không nhờ chấm. Nhắc cả team đây là quy định, và chính SM cũng chấm như mọi người."],
  ["Đúng giờ thực tế", "Chấm vào ca và ra ca theo giờ làm thật. Ca gãy chấm đủ 2 khung (4 lần).", "Không “làm tròn” cho đẹp. Đi trễ, về sớm ghi đúng thực tế rồi xử lý theo nội quy."],
  ["Đúng loại công", "Ca thường, ca gãy, làm thêm giờ, nghỉ phép, nghỉ ốm, nghỉ không lương, đi đào tạo, hỗ trợ shop khác… được ghi đúng loại.", "Mỗi thay đổi (đổi ca, nghỉ, làm thêm) đều có đề xuất và phê duyệt trên hệ thống hoặc biểu mẫu theo quy trình, không thỏa thuận miệng."],
  ["Đúng hạn", "Giải trình, điều chỉnh, phê duyệt trong thời hạn công ty quy định.", "Rà công hằng ngày, đối soát hằng tuần, không dồn sai lệch đến cuối tháng."],
], { boldFirst: true, size: 19 }));
body.push(gap());

body.push(H2("B3. Quy trình chấm công của SM theo thời điểm"));
body.push(table([1900, 7738], ["Thời điểm", "Việc SM làm"], [
  ["Đầu ca", "Kiểm tra nhân sự có mặt so với lịch ca. Phát hiện vắng hoặc đi trễ thì liên hệ ngay, ghi nhận đúng thực tế và bố trí hỗ trợ ca (liên hệ slide 5)."],
  ["Trong ca", "Phát sinh đổi ca, về sớm, làm thêm thì làm đề xuất và phê duyệt ngay theo quy trình, cập nhật lịch ca để công ghi đúng người, đúng ca."],
  ["Cuối ca", "Bàn giao xong mới chấm ra. Nhắc ca gãy chấm đủ khung thứ hai."],
  ["Hằng ngày", "Rà dữ liệu chấm công: thiếu công, quên chấm, trễ hoặc sớm bất thường. Nhắc nhân viên giải trình trong ngày."],
  ["Hằng tuần", "Đối chiếu ba nguồn: lịch ca, dữ liệu chấm công, các phiếu đổi ca / nghỉ phép / làm thêm. Xử lý sai lệch ngay trong tuần. Xem lại ai đang bị dồn ca gãy hoặc làm thêm nhiều để chỉnh lịch tuần sau."],
  ["Cuối kỳ công", "Nhân viên tự kiểm tra bảng công của mình trước khi chốt. SM tổng hợp, xác nhận và gửi đúng hạn, lưu chứng từ theo quy định."],
], { boldFirst: true, size: 19 }));
body.push(gap());

body.push(H2("B4. Xử lý sai lệch thường gặp"));
body.push(table([2200, 4800, 2638], ["Tình huống", "Cách xử lý đúng", "Không nên"], [
  ["Quên chấm công vào/ra", "Nhân viên làm giải trình theo quy trình. SM đối chiếu lịch ca, sổ bàn giao, hoạt động trên hệ thống rồi mới duyệt. Quên một lần thì nhắc; lặp lại thì trao đổi riêng để tìm nguyên nhân.", "Duyệt cho qua vì “chắc là có đi làm”."],
  ["Đi trễ / về sớm", "Ghi đúng giờ thực tế, hỏi nguyên nhân, xử lý theo nội quy. Nếu lặp lại thì tìm cách hỗ trợ (giờ giấc, đường đi, lịch cá nhân).", "Bỏ qua cho người thân, gắt với người khác."],
  ["Đổi ca giữa 2 nhân viên", "Phải được SM duyệt trước. Kiểm tra năng lực ca và giờ nghỉ chuyển ca, rồi cập nhật lịch và hệ thống.", "Hai bạn tự đổi, SM biết sau."],
  ["Ca gãy", "Chấm đủ 2 khung (4 lần). Khoảng nghỉ giữa 2 khung không tính công. Theo dõi để ca gãy không dồn vào một người.", "Chỉ chấm vào đầu và ra cuối."],
  ["Làm thêm giờ", "Chỉ khi có đề xuất, được duyệt, nhân viên đồng ý và trong giới hạn luật cùng quy định công ty. Ghi đúng loại công.", "Giữ người lại không ghi nhận, hoặc “bù” bằng thỏa thuận miệng."],
  ["Nghỉ đột xuất / ốm", "Ghi đúng loại nghỉ (phép, ốm, không lương) theo giấy tờ và quy định. Bố trí hỗ trợ ca.", "Để trống, cuối tháng mới hỏi."],
  ["Đi đào tạo / hỗ trợ shop khác", "Ghi nhận theo quy trình điều động để nhân viên không bị mất công.", "Để nhân viên tự lo."],
  ["Lỗi thiết bị / hệ thống chấm công", "Báo bộ phận phụ trách, ghi nhận tạm có xác nhận, cập nhật lại theo hướng dẫn.", "Tự ghi tay rồi bỏ quên."],
], { boldFirst: true, size: 18 }));
body.push(gap());

body.push(H2("B5. Minh bạch và phòng ngừa gian lận"));
body.push(bl("Không chấm hộ, không sửa công khi không có căn cứ. ", "Mọi điều chỉnh đều có lý do, chứng từ, người duyệt và lưu vết."));
body.push(bl("SM gương mẫu: ", "SM chấm công và tuân thủ giờ giấc như mọi người."));
body.push(bl("Nhân viên được kiểm tra công của mình ", "trước khi chốt, và có kênh phản hồi rõ ràng khi thấy sai."));
body.push(bl("Bảo mật: ", "công và lương là thông tin cá nhân; mỗi người xem phần của mình, không công khai bảng công của người khác."));
body.push(bl("Dùng dữ liệu để hỗ trợ, không để bắt lỗi: ", "thấy một bạn đi trễ liên tục thì tìm hiểu nguyên nhân trước khi nhắc nhở hay kỷ luật."));
body.push(bl("Đúng thẩm quyền: ", "việc vượt thẩm quyền SM (sửa công quá hạn, tranh chấp) thì báo ASM / bộ phận nhân sự."));

body.push(H2("B6. Liên kết xếp ca ↔ chấm công"));
body.push(P("Xếp ca và chấm công là một vòng khép kín: lịch ca là kế hoạch, chấm công cho biết thực tế. Đối chiếu hằng tuần giúp SM thấy ca nào thường thiếu người, ai đang bị dồn ca gãy hay làm thêm nhiều, giờ nào khách đông hơn dự kiến. Từ đó SM điều chỉnh lịch tuần sau cho đúng nhu cầu, đúng tải và công bằng hơn (quay lại nguyên tắc “5 ĐÚNG” ở slide 3)."));

// đề xuất slide 7–8
body.push(H2("B7. Đề xuất thêm 2 slide vào bộ hiện có"));
body.push(H3("Slide 7 · Chấm công: Chính xác – Minh bạch – Kịp thời"));
body.push(label("NỘI DUNG GỢI Ý TRÊN SLIDE"));
body.push(bl("Nhãn: ", "CHẤM CÔNG • 4 ĐÚNG"));
body.push(bl("4 ô: ", "Đúng người (không chấm hộ) · Đúng giờ thực tế (ca gãy chấm đủ 2 khung) · Đúng loại công (ca, làm thêm, phép, đào tạo) · Đúng hạn (giải trình, duyệt trong thời hạn)."));
body.push(bl("Dải thời gian: ", "Đầu ca → Trong ca → Cuối ca → Hằng ngày → Hằng tuần → Cuối kỳ công."));
body.push(bl("Câu chốt: ", "“Lịch ca là kế hoạch, chấm công là thực tế – SM phải làm cho hai thứ khớp nhau.”"));
body.push(...speech([
  "Phần thứ hai của câu hỏi là chấm công. Với em, lịch ca là kế hoạch, còn chấm công là thực tế, và SM phải làm cho hai thứ này khớp nhau.",
  "Em chấm công theo bốn đúng. Đúng người: ai làm người đó chấm, không chấm hộ. Đúng giờ thực tế: vào ca, ra ca, ca gãy chấm đủ hai khung. Đúng loại công: ca thường, ca gãy, làm thêm, nghỉ phép, đi đào tạo đều phải ghi đúng loại để tính lương đúng. Và đúng hạn: giải trình, điều chỉnh, duyệt trong thời hạn công ty quy định.",
  "Mỗi ngày em rà thiếu công, quên chấm, trễ sớm bất thường. Mỗi tuần em đối chiếu lịch ca với dữ liệu chấm công và các phiếu đổi ca, nghỉ phép, làm thêm, để sai lệch được xử lý ngay trong tuần chứ không dồn đến cuối tháng. Trước khi chốt công, nhân viên được tự kiểm tra công của mình.",
]));
body.push(H3("Slide 8 · Khi lịch ca và công không khớp"));
body.push(label("NỘI DUNG GỢI Ý TRÊN SLIDE"));
body.push(bl("Nhãn: ", "CHẤM CÔNG • XỬ LÝ SAI LỆCH"));
body.push(bl("4 tình huống: ", "Quên chấm công · Đổi ca phát sinh · Làm thêm giờ · Ca gãy."));
body.push(bl("Hai ô đối lập: ", "KHÔNG NÊN: “Chấm giùm bạn đi.” / “Cuối tháng tính sau.” — NÊN: “Có căn cứ thì chị duyệt, chưa có thì mình bổ sung theo quy trình.”"));
body.push(bl("Câu chốt: ", "“Chấm công đúng là bảo vệ quyền lợi nhân viên – và bảo vệ shop.”"));
body.push(...speech([
  "Khi lịch và công không khớp, em xử lý theo một nguyên tắc: có căn cứ mới điều chỉnh.",
  "Nhân viên quên chấm công thì làm giải trình theo quy trình. Em đối chiếu với lịch ca, sổ bàn giao, hoạt động trên hệ thống rồi mới duyệt. Quên một lần em nhắc, lặp lại nhiều lần em trao đổi riêng để tìm nguyên nhân.",
  "Đổi ca phải được duyệt trước và cập nhật lên hệ thống, để công ghi đúng người, đúng ca. Làm thêm giờ chỉ khi có đề xuất, có sự đồng ý của nhân viên và trong giới hạn quy định.",
  "Em không chấm hộ và không sửa công khi không có căn cứ, kể cả với người thân trong team, kể cả với chính em. Chấm công đúng là bảo vệ quyền lợi của nhân viên, và cũng là bảo vệ shop.",
]));

body.push(H2("B8. Câu hỏi giảng viên có thể hỏi về chấm công"));
const qa = (q, a) => [P([r("Hỏi: ", { bold: true, color: COL.orange }), r(q, { bold: true })], { spacing: { before: 120, after: 40 }, keepNext: true }), P([r("Đáp: ", { bold: true, color: COL.blue }), r(a)])];
body.push(...qa("Nhân viên nhắn nhờ chấm công hộ vì kẹt xe, sắp tới nơi?", "Em không chấm hộ. Bạn chấm khi đến, giờ trễ ghi đúng thực tế; nếu lý do khách quan thì giải trình theo quy trình. Em cũng nhắc lại với cả team: chấm hộ là vi phạm nội quy, ảnh hưởng cả người nhờ lẫn người chấm."));
body.push(...qa("Cuối kỳ phát hiện một bạn thiếu công vài ngày?", "Em không tự sửa. Em yêu cầu bạn giải trình kèm căn cứ, xác minh với lịch ca và bàn giao, rồi điều chỉnh theo quy trình và thời hạn. Nếu quá hạn hoặc vượt thẩm quyền thì báo ASM / bộ phận nhân sự. Sau đó em rút kinh nghiệm: rà công hằng tuần để không dồn đến cuối kỳ."));
body.push(...qa("Ca gãy chấm công thế nào?", "Chấm đủ hai khung, tức bốn lần vào – ra. Thời gian nghỉ giữa hai khung không tính công. Em theo dõi để ca gãy không dồn vào một người, đúng như mục tiêu ở slide 4."));
body.push(...qa("SM có được sửa công cho nhân viên không?", "Chỉ điều chỉnh hoặc phê duyệt trong phạm vi thẩm quyền, khi có lý do, có chứng từ và lưu vết trên hệ thống. Việc nào vượt thẩm quyền thì em chuyển lên cấp trên."));

// ---------- PHẦN C ----------
body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [r("PHẦN C · ", { color: COL.orange }), r("Lưu ý khi rà lịch mô phỏng (slide 4)")] }));
body.push(P([r("Bộ luật Lao động 2019, Điều 110 (nghỉ chuyển ca): ", { bold: true }), r("người lao động làm việc theo ca được nghỉ ít nhất 12 giờ trước khi chuyển sang ca làm việc khác.")]));
body.push(P("Với giờ ca trên slide, các cặp ca liền nhau sau đây chỉ có dưới 12 giờ nghỉ:"));
body.push(bl("Chiều (kết thúc 22:00) → Sáng hôm sau (07:00): ", "nghỉ 9 giờ."));
body.push(bl("Chiều (22:00) → Gãy hôm sau (08:00): ", "nghỉ 10 giờ."));
body.push(bl("Gãy (kết thúc 20:00) → Sáng hôm sau (07:00): ", "nghỉ 11 giờ."));
body.push(P(`Theo bảng lịch đọc được từ ảnh chụp, có ${short.length} chỗ như vậy:`, { spacing: { before: 120, after: 80 } }));
body.push(table([1200, 6038, 2400], ["Nhân viên", "Chuyển ca", "Thời gian nghỉ"], short, { center: [0, 2] }));
body.push(gap());
body.push(P([r("Gợi ý chỉnh: ", { bold: true }), r("sau ca Chiều chỉ nên xếp Chiều hoặc OFF; sau ca Gãy không xếp Sáng ngay hôm sau. Nếu không kịp sửa lịch, nên thêm một câu khi thuyết trình slide 4: “Khi xếp lịch thật, em đảm bảo nhân viên nghỉ ít nhất 12 giờ trước khi chuyển ca, ví dụ không xếp ca Chiều kết thúc 22 giờ rồi ca Sáng 7 giờ hôm sau.”")]));
body.push(P([r("Nên kiểm tra lại: ", { bold: true, color: COL.red }), r("bảng trên được đọc từ ảnh chụp màn hình. Bạn đối chiếu lại với file gốc, đồng thời xác nhận cách áp dụng cụ thể với SOP và bộ phận nhân sự của công ty.")]));

// ---------- tài liệu ----------
const doc = new Document({
  creator: "Bài thi thăng cấp SM",
  title: "Câu 2 – Sắp xếp ca và chấm công",
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] }] },
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: COL.text }, paragraph: { spacing: { line: 288 } } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { font: "Arial", size: 38, bold: true, color: COL.navy }, paragraph: { spacing: { before: 0, after: 160 }, keepNext: true } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 32, bold: true, color: COL.navy }, paragraph: { spacing: { before: 0, after: 200 }, keepNext: true, outlineLevel: 0, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: COL.border, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 26, bold: true, color: COL.blue }, paragraph: { spacing: { before: 360, after: 100 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 23, bold: true, color: COL.teal }, paragraph: { spacing: { before: 240, after: 80 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: W }], children: [
      r("Câu 2 – Sắp xếp ca và chấm công", { size: 16, color: COL.muted }), r("\tTrang ", { size: 16, color: COL.muted }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COL.muted }),
    ] })] }) },
    children: body,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("Wrote", OUT, "| short rests:", short.length); });
