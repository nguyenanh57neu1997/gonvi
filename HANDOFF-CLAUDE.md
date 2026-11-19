# Gọn Ví — Bàn giao mã nguồn cho Claude

Ngày xuất: 19/11/2026 (Việt Nam).
Nguồn: phiên bản 4 đang phát hành của Gọn Ví.
Commit: 1354b3e8d1899f34195ccc51dab4382882524b2b
Website: https://gon-vi-van-anh-x7k3.almondtune8192.chatgpt.site

## Trạng thái chính xác

Đây là mã nguồn phiên bản đang chạy, không phải bản đã hoàn thành tính năng mới.
Trang Nhập dữ liệu Excel / Google Sheets còn là yêu cầu cần triển khai. Bản nháp
chưa phát hành không có trong gói này. Không suy diễn rằng tính năng nhập XLSX,
chọn sheet, ghép cột hoặc tự đồng bộ Google Sheets đã tồn tại.

ZIP chứa toàn bộ 133 tệp được Git theo dõi ở commit trên, cùng tài liệu bàn giao
này. File TXT đi kèm chứa mã các phần nghiệp vụ, giao diện, API, cấu hình, cơ sở
dữ liệu và kiểm thử. Các UI component dùng chung, công cụ build và lockfile đầy
đủ nằm trong ZIP; TXT là bản để đọc, không phải một chương trình chạy trực tiếp.
Không kèm node_modules, thư mục .git, bí mật môi trường, dữ liệu D1 thật hoặc
workbook budget 2026.xlsx. Dữ liệu mẫu trong mã là dữ liệu dùng thử.

## Mục tiêu sản phẩm

Ứng dụng tiếng Việt trả lời: “Tháng tới tôi có thể chi bao nhiêu tiền?”
Nguồn tiền gồm lương, thu nhập khác và tiền còn từ tháng trước; trừ nợ/chi phí
bắt buộc, tiền để dành, dự trù. Nếu thiếu, hạn mức chi thêm bằng 0 và hiển thị
khoản thiếu. Có tư vấn phân bổ, điều phối giữa các tháng/quỹ, tổng kết cả năm,
và dự phóng năm sau. Giữ giao diện xanh đậm/xanh lá cùng thương hiệu gọnví.

## Yêu cầu mới của người dùng — cần thực hiện

“Cần có 1 page có chức năng input các số tiền thuộc các hạng mục mình có /
mở rộng tính năng input từ google sheet/excel nhé.”

Đề xuất triển khai tiếp:
- Trang /nhap-du-lieu và mục điều hướng Nhập dữ liệu.
- Nhập tay theo tháng: lương, thu nhập khác, nợ/trả góp, chi phí cố định,
  chi dự kiến, trích quỹ, tiết kiệm, dự trù và tiền chuyển sang.
- Đọc XLSX, CSV, TSV; cho chọn sheet, dòng tiêu đề, ghép cột và tháng.
- Hỗ trợ bảng có nhiều tháng nằm ngang: chọn cột tháng rồi chuyển thành
  từng khoản theo tháng. Không mặc định tất cả sheet đều cùng cấu trúc.
- Google Sheets có thể bắt đầu bằng sao chép/dán vùng ô (TSV). Kết nối tài khoản
  hoặc tự đồng bộ qua liên kết là hạng mục riêng, cần quyền tích hợp phù hợp.
  Không gọi dán bảng là đồng bộ tự động, không yêu cầu công khai bảng riêng tư.
- Trước khi lưu: xem trước, sửa phân loại/tháng, chọn bỏ dòng, hiển thị lỗi và
  tác động lên hạn mức. Cho xác nhận các thay đổi ghi đè số tiền đã có.
- Nhập lại cùng tháng + cùng khoản + cùng giá trị phải không cộng trùng.
  Thay đổi số tiền cùng khoản nên cập nhật giá trị tổng tháng sau xác nhận.
  Đây là tổng ngân sách theo hạng mục, chưa phải sổ từng giao dịch.
- Giữ dữ liệu tháng khác, ghi chú, điều phối, dự phóng và lịch quỹ đã có.
- Ghi nguồn và lịch sử nhập. Tôn trọng lưu dữ liệu theo user và kiểm tra revision.
- Giới hạn kích thước file/số dòng; chỉ đọc số đã tính trong XLSX, không chạy
  công thức hay macro. Ô trống không phải số 0; số âm/lỗi công thức phải báo lỗi.
- Hiểu tiền Việt: 250k = 250000, 12,5tr = 12500000, 12.500.000 = 12500000.
- Tiền vay không phải thu nhập. Số dư ngân hàng thực tế không được tự động cộng
  thành lương/thu nhập hoặc tiền chuyển tháng sau. Thu nhập khác chưa xác nhận
  mặc định chưa tính, trừ khi người dùng chủ động bật tính thu dự kiến.
- Các khoản goal-* và essential-living do bộ tư vấn sinh ra: chỉnh qua cấu hình
  quỹ/sinh hoạt, tránh nhập chồng rồi bị tính hai lần hoặc bị ghi đè.

## Kiến trúc cần giữ

- React 19 + TypeScript; Vinext/Vite; Cloudflare Worker và D1.
- app/finance-app.tsx: khung ứng dụng, điều hướng, trạng thái thật/dùng thử,
  chỉnh kế hoạch, gọi API và lưu theo revision.
- lib/finance.ts: Zod schema, công thức ngân sách, phân bổ quỹ, điều phối.
- lib/projection.ts + app/year-projection.tsx: dự phóng năm sau.
- app/annual-summary.tsx: tổng kết năm.
- app/allocation-advisor.tsx + app/reallocation-planner.tsx: tư vấn/điều phối.
- app/api/plans/route.ts: GET/PUT theo người đăng nhập; xác thực, Origin và
  optimistic concurrency. Không biến thành API công khai khi thêm nhập file.
- lib/budget-import.ts: nhập dữ liệu dịch vụ, giữ các tháng người dùng đã có.
- app/api/source-sync/route.ts: kênh nhập dữ liệu dịch vụ có bí mật máy chủ;
  không phải bộ đọc Excel cho trình duyệt. Không đưa khóa này ra frontend.
- app/chatgpt-auth.ts + worker/index.ts: xác thực/context của Sites.
- drizzle/: các migration D1; không xóa hay sửa lịch sử migration đã áp dụng.
- .openai/hosting.json: định danh Site hiện tại và D1 binding DB. Bản xuất giữ
  định danh để sửa đúng dự án. Triển khai một app độc lập cần đăng ký/cấu hình
  đích mới và cơ chế xác thực phù hợp; không coi header tùy ý là danh tính tin cậy.

## Chạy trên máy phát triển

1. Giải nén ZIP, mở terminal trong thư mục gon-vi-source-v4.
2. Dùng Node.js >= 22.13.0 và pnpm đúng packageManager trong package.json.
3. Chạy `pnpm install --frozen-lockfile`, rồi `pnpm dev`.
4. Dùng địa chỉ được terminal in ra. Bản dùng thử có thể xem ngay.
5. `pnpm build` để build. README.md gốc mô tả môi trường Sites, D1 và đăng nhập
   mô phỏng ở portable local. Dữ liệu cá nhân đang chạy trên Sites không tự
   xuất hiện trong local clone; dùng file sao lưu của chủ tài khoản nếu cần.

Lệnh kiểm tra của dự án:
```
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test tests/finance.test.mjs tests/projection.test.mjs
pnpm build
node --experimental-vm-modules --experimental-strip-types --import ./scripts/sites-env.mjs --test tests/plans-api.test.mjs
```
API test dùng D1 tạm và cần dist/server/wrangler.json do build tạo ra.
Lần xuất này xác minh nội dung tệp khớp commit đã phát hành; không tuyên bố
chạy lại build/kiểm thử cho tính năng nhập dữ liệu chưa có trong bản xuất.

## Prompt để gửi Claude

“Hãy đọc tài liệu bàn giao và mã nguồn Gọn Ví trong file đính kèm. Trước hết
nêu kiến trúc và những phần đã có. Sau đó triển khai trang Nhập dữ liệu theo
mục Yêu cầu mới: nhập tay, đọc Excel/CSV, dán bảng Google Sheets, xem trước,
kiểm tra trùng và lưu đúng tháng. Giữ các chức năng phân bổ, tổng kết năm và
dự phóng. Đừng tự bịa số tiền hoặc nói đã kết nối Google khi chưa có tích hợp.
Nếu thiếu file cần sửa, nêu chính xác đường dẫn. Trả lại các file hoàn chỉnh
đã thay đổi, hướng dẫn chạy và kết quả kiểm thử thực tế.”
