# Rà soát title và description: trang dịch vụ, tuyến và bài viết (2026-10-06)

**Trạng thái:** Ngày 2026-10-06, chủ site duyệt áp dụng mục 1, 2 và 3 trước khi chuyển domain. Riêng title, chủ site chọn sửa ngay thay vì đợi 4–8 tuần như khuyến nghị ban đầu. Các thay đổi nằm trong `src/content/seo-overrides.ts`.

Sau đó, chủ site trả lời các câu hỏi ở mục 4:
- **Ưu đãi:** chỉ còn "giảm 7% cho khách hàng mới". 11 description có mức giảm giá nay đều ghi mức này.
- **"#1", "số 1", "nhất":** đã bỏ khỏi mọi title, description và H1, trừ trang chủ. Riêng trang máy móc thiết bị, H1 cũng đã bỏ "#1 VIỆT NAM".
- **Bài lệnh cấm xe tải "04/2023":** đã viết lại theo quy định hiện hành (QCVN 41:2024, Nghị định 168/2024 sửa đổi bởi Nghị định 238/2026, Nghị định 241/2026, quyết định giờ cấm của từng thành phố), đổi title, description và H1. Nội dung bài nằm trong `src/content/articles/`. Nguồn: `researcher-261006-0828-truck-ban-national-law.md` và `researcher-261006-0828-truck-ban-city-rules.md`.

Đến lúc này có 58 trang dùng bản ghi đè. Việc còn chờ chủ site: các cặp trang trùng chủ đề, description tuyển dụng ghi "2026", và các khẳng định, ưu đãi cũ vẫn còn trong thân bài nhiều trang.

Phạm vi: 93 URL gồm 1 hub tuyến, 65 trang tuyến, 6 trang dịch vụ theo loại hàng, 4 trang thuê xe tải, 9 bài viết, 4 trang thông tin (giới thiệu, liên hệ, FAQ, tuyển dụng) và 4 trang chính sách. Trang chủ giữ nguyên title và description Rank Math theo quyết định của chủ site. Chủ site cũng xác nhận ưu đãi "Kỷ niệm 10 năm — giảm 7% cước" vẫn còn hiệu lực.

Nguồn dữ liệu:
- Title, description, H1 của WordPress đang chạy và của bản build local: `seo-parity-261006-0047-before-cutover/compare.json`.
- Dữ liệu Rank Math: `src/legacy-content/seo-meta.json`.
- Độ rộng title đo bằng canvas, font Arial 20 px, giống cách Google hiển thị trên desktop. Google cắt title khi rộng quá khoảng 600 px.

## Kết luận

- **Chuyển domain không đổi title và description.** Title trùng khớp WordPress trên 93/93 URL. Description trùng khớp trên 88/88 trang có description Rank Math. Riêng `/blog/` là trang lưu trữ: title "Lưu trữ Blog" của WordPress được thay bằng title riêng.
- **Kỹ thuật ổn:**
  - Không có title hay description nào trùng nhau.
  - Title dài trung vị 54 ký tự (528 px); description dài trung vị 140 ký tự.
- **H1:** 75/93 trang giữ nguyên H1 của WordPress, 15 trang WordPress không có H1 thì bản mới đã bổ sung. 3 trang có H1 ngắn hơn bản WordPress (giới thiệu, thuê xe tải, tuyển dụng); title của các trang này vẫn giữ từ khóa.
- **Điểm yếu nằm ở câu chữ của dữ liệu Rank Math gốc:**
  - 5 trang không có description.
  - 11 description có lỗi chính tả.
  - 27 title có chữ in hoa: 4 title in hoa toàn bộ và 23 title chứa cụm in hoa như "TRONG NGÀY", "SIÊU RẺ".
  - 5 title chứa "#1" hoặc "nhất".
  - 13 title rộng hơn 600 px.

## 1. Năm trang chưa có description — nên làm trước khi chuyển domain

WordPress không xuất thẻ description cho 5 trang này nên Google tự trích một đoạn trong bài. Bản mới hiện lấy đoạn mở đầu bài viết, nhưng đoạn này dài hơn 160 ký tự, bị cắt, và có lỗi chính tả ("Vận tại", "cá nhận"). Viết description cho các trang này không đụng đến dữ liệu Rank Math, vì dữ liệu đó không có.

| Trang | Bản mới đang dùng (đoạn mở đầu) | Đề xuất (137–146 ký tự) |
|---|---|---|
| `/faq/` | "Vận tại hay còn gọi là giao thông vận tải, là một hình thức chuyên chở…" (196 ký tự) | Giải đáp câu hỏi thường gặp về vận tải hàng hóa: vận tải là gì, các hình thức kinh doanh vận tải, giấy vận tải, POD và điều kiện cấp phép. |
| `/blog/van-chuyen-hang-hoa-nguy-hiem/` | "Khi vận chuyển hàng hóa, các đơn vị hoặc cá nhận thực hiện…" | Hàng nguy hiểm được chia thành 9 loại. Bài viết tổng hợp yêu cầu về bao bì, phương tiện và cách đóng gói khi vận chuyển hàng hóa nguy hiểm. |
| `/blog/giay-to-van-chuyen-hang-hoa/` | "Bạn đang có ý định vận chuyển những kiện hàng hóa của mình đi xa…" (193 ký tự) | Gửi hàng đi xa cần giấy tờ gì? Danh sách giấy tờ nhà xe phải có và giấy tờ khách hàng cần chuẩn bị khi vận chuyển hàng hóa bằng đường bộ. |
| `/van-chuyen-hang-hoa/dak-lak/` | "Chành xe vận tải hàng đi Đắk Lắk hai chiều đang là tuyến đường…" (195 ký tự) | Chành xe gửi hàng hai chiều TPHCM, Hà Nội, Đà Nẵng – Đắk Lắk (Buôn Ma Thuột): máy móc, nội thất, hàng cồng kềnh. Miễn phí bốc dỡ, lưu kho. |
| `/van-chuyen-hang-hoa/ha-tinh/` | "Vận tải Phương Vy nhận vận chuyển hàng hóa đi Hà Tĩnh… Bạn được miễn phí…" (197 ký tự) | Chành xe gửi hàng đi Hà Tĩnh từ TPHCM, Hà Nội. Tuyến Hà Nội giao trong 9–18 tiếng, cước từ 800đ/kg hàng nguyên xe, miễn phí bốc xếp, giao tận nơi. |

Mọi chi tiết trong phần đề xuất đều lấy từ nội dung của chính trang đó.

## 2. Lỗi chính tả trong description Rank Math — nên sửa trước khi chuyển domain

Description không phải yếu tố xếp hạng. Sửa lỗi chính tả chỉ thay đổi đoạn mô tả hiển thị trên Google. Câu chữ còn lại giữ nguyên.

| Trang | Đang hiển thị | Sửa thành |
|---|---|---|
| `/van-chuyen-hang-hoa/yen-bai/` | Vận chuyển hàng óa | Vận chuyển hàng hóa |
| `/blog/quy-dinh-van-chuyen-hang-hoa-nguy-hiem/` | Tộng hợp | Tổng hợp |
| `/gioi-thieu/` | chứng minh mìn là | chứng minh mình là |
| `/van-chuyen-hang-hoa/quang-binh/` | giá thành cà tốc độ | giá thành và tốc độ |
| `/van-chuyen-hang-hoa/thai-nguyen/` | thới gian | thời gian |
| `/van-chuyen-hang-hoa/long-an/` | Long An di Hà Nội | Long An đi Hà Nội |
| `/van-chuyen-hang-hoa/sieu-truong-sieu-trong/` | sieu trọng, quá khổ quả tải | siêu trọng, quá khổ quá tải |
| `/thue-xe-tai/da-nang/` | cho thuê tải chở hàng | cho thuê xe tải chở hàng |
| `/thue-xe-tai/` | vận tải Phuong Vy | vận tải Phương Vy |
| `/van-chuyen-hang-hoa/phan-thiet/` | Phan thiết, Mũi Né Lagi | Phan Thiết, Mũi Né, La Gi |
| `/van-chuyen-hang-hoa/chanh-xe-chuyen-hang-di-buon-me-thuot/` | Buôn Ma Thuột, daklak | Buôn Ma Thuột, Đắk Lắk |

## 3. Title in hoa, có "#1" hoặc bị cắt — nên sửa 4–8 tuần sau khi chuyển domain

Title là tín hiệu xếp hạng. Khi chuyển domain nên giữ nguyên title để Google chỉ phải xử lý một thay đổi là hạ tầng. Sau khi thứ hạng ổn định:
- Sửa theo đợt, mỗi đợt 10–15 trang.
- So sánh CTR và vị trí trong Search Console trong 2–4 tuần trước và sau mỗi đợt.

Nguyên tắc của các đề xuất bên dưới:
- Giữ nguyên từ khóa và thứ tự từ.
- Bỏ chữ in hoa, bỏ "#1" và "nhất".
- Thêm dấu phân cách còn thiếu.
- Rút độ rộng về tối đa 580 px.

Google vẫn hiển thị tên site riêng phía trên title, nên những title đề xuất không có đuôi thương hiệu vẫn được nhận diện.

| Trang | Hiện tại | Đề xuất | px |
|---|---|---|---|
| `/van-chuyen-hang-hoa/` | #1 Dịch vụ vận chuyển hàng hóa bắc nam \| Vận Tải Phương Vy | Dịch vụ vận chuyển hàng hóa Bắc Nam \| Vận Tải Phương Vy | 566→543 |
| `/van-chuyen-hang-hoa/an-giang/` | Dịch Vụ Chành xe gửi hàng đi An Giang TRONG NGÀY | Chành xe gửi hàng đi An Giang trong ngày - Vận Tải Phương Vy | 496→574 |
| `/van-chuyen-hang-hoa/bac-lieu/` | Chành xe gửi hàng đi Bạc Liêu TRONG NGÀY - Vận Tải Phương Vy | Chành xe gửi hàng đi Bạc Liêu trong ngày - Vận Tải Phương Vy | 608→568 |
| `/van-chuyen-hang-hoa/ca-mau/` | Chành xe gửi hàng đi Cà Mau TRONG NGÀY - Vận Tải Phương Vy | Chành xe gửi hàng đi Cà Mau trong ngày - Vận Tải Phương Vy | 601→561 |
| `/van-chuyen-hang-hoa/cao-bang/` | Chành xe gửi hàng hóa đi Cao Bằng nhanh chóng CƯỚC RẺ | Chành xe gửi hàng hóa đi Cao Bằng nhanh chóng, cước rẻ | 548→527 |
| `/van-chuyen-hang-hoa/chanh-xe-phu-quoc/` | #1 Chành xe gửi hàng đi Phú Quốc TRONG NGÀY | Chành xe gửi hàng đi Phú Quốc trong ngày - Vận Tải Phương Vy | 454→579 |
| `/van-chuyen-hang-hoa/dak-lak/` | DỊCH VỤ VẬN CHUYỂN HÀNG HOÁ TPHCM – ĐẮK LẮK - Vận Tải Phương Vy | Dịch vụ vận chuyển hàng hóa TPHCM – Đắk Lắk \| Phương Vy | 708→553 |
| `/van-chuyen-hang-hoa/dak-nong/` | Chành xe gửi hàng hóa đi Đắk Nông TRONG NGÀY | Chành xe gửi hàng hóa đi Đắk Nông trong ngày - Phương Vy | 465→544 |
| `/van-chuyen-hang-hoa/dong-nai/` | Chành xe gửi hàng hóa đi Đồng Nai GIÁ RẺ \| Vận Tải Phương Vy | Chành xe gửi hàng hóa đi Đồng Nai giá rẻ \| Vận Tải Phương Vy | 585→567 |
| `/van-chuyen-hang-hoa/dong-thap/` | Chành xe gửi hàng đi Đồng Tháp SIÊU RẺ - Vận Tải Phương Vy | Chành xe gửi hàng đi Đồng Tháp giá rẻ - Vận Tải Phương Vy | 575→545 |
| `/van-chuyen-hang-hoa/hau-giang/` | Chành xe gửi hàng đi Hậu Giang CƯỚC RẺ - Vận Tải Phương Vy | Chành xe gửi hàng đi Hậu Giang cước rẻ - Vận Tải Phương Vy | 588→561 |
| `/van-chuyen-hang-hoa/hoa-binh/` | Dịch Vụ Chành xe gửi hàng đi Hòa Bình nhanh chóng CƯỚC RẺ | Chành xe gửi hàng đi Hòa Bình nhanh chóng, cước rẻ | 579→482 |
| `/van-chuyen-hang-hoa/may-moc-thiet-bi/` | Dịch vụ vận chuyển máy móc thiết bị #1 VIỆT NAM - Vận Tải Phương Vy | Dịch vụ vận chuyển máy móc thiết bị - Vận Tải Phương Vy | 647→519 |
| `/van-chuyen-hang-hoa/nam-dinh/` | #1 Dịch Vụ Chành xe gửi hàng đi Nam Định NHANH NHẤT VN | Dịch vụ chành xe gửi hàng đi Nam Định - Vận Tải Phương Vy | 559→547 |
| `/van-chuyen-hang-hoa/nha-trang/` | Chành xe gửi hàng đi Nha Trang SIÊU RẺ \| Vận Tải Phương Vy | Chành xe gửi hàng đi Nha Trang giá rẻ \| Vận Tải Phương Vy | 568→538 |
| `/van-chuyen-hang-hoa/phu-yen/` | Chành xe gửi hàng từ TPHCM Hà Nội đi Phú Yên Vận Tải Phương Vy | Chành xe gửi hàng từ TPHCM, Hà Nội đi Phú Yên \| Phương Vy | 623→565 |
| `/van-chuyen-hang-hoa/soc-trang/` | Chành xe gửi hàng đi Sóc Trăng NHANH CHÓNG TRONG NGÀY | Chành xe gửi hàng đi Sóc Trăng nhanh chóng trong ngày | 585→510 |
| `/van-chuyen-hang-hoa/son-la/` | Dịch vụ gửi hàng đi Sơn La giá TỐT NHẤT- Vận Tải Phương Vy | Dịch vụ gửi hàng đi Sơn La giá tốt - Vận Tải Phương Vy | 568→497 |
| `/van-chuyen-hang-hoa/thai-binh/` | Vận chuyển gửi hàng hóa từ TPHCM đi Thái Bình TRONG 40H | Vận chuyển gửi hàng hóa từ TPHCM đi Thái Bình trong 40h | 563→533 |
| `/van-chuyen-hang-hoa/thanh-hoa/` | Vận chuyển hàng chành xe Sài Gòn đi Thanh Hóa NHANH RẺ | Vận chuyển hàng, chành xe Sài Gòn đi Thanh Hóa nhanh, rẻ | 556→541 |
| `/van-chuyen-hang-hoa/tien-giang/` | Chành xe gửi hàng đi Tiền Giang NHANH CHÓNG TRONG NGÀY | Chành xe gửi hàng đi Tiền Giang nhanh chóng trong ngày | 591→515 |
| `/van-chuyen-hang-hoa/tra-vinh/` | Chành xe gửi hàng đi Trà Vinh TRONG NGÀY CƯỚC RẺ | Chành xe gửi hàng đi Trà Vinh trong ngày, cước rẻ | 513→451 |
| `/van-chuyen-hang-hoa/vinh-long/` | Chành xe gửi hàng đi Vĩnh Long SIÊU RẺ \| Vận Tải Phương Vy | Chành xe gửi hàng đi Vĩnh Long giá rẻ \| Vận Tải Phương Vy | 566→536 |
| `/thue-xe-tai/` | Bảng báo giá cho thuê xe tải chở hàng SIÊU RẺ \| Vận Tải Phương Vy | Bảng báo giá cho thuê xe tải chở hàng \| Vận Tải Phương Vy | 621→536 |
| `/thue-xe-tai/ha-noi/` | Cho thuê xe tải chở hàng GIÁ RẺ Tại Hà Nội \| Vận Tải Phương Vy | Cho thuê xe tải chở hàng giá rẻ tại Hà Nội \| Phương Vy | 590→491 |
| `/blog/giay-to-van-chuyen-hang-hoa/` | KHI VẬN CHUYỂN HÀNG HÓA CẦN LƯU Ý NHỮNG LOẠI GIẤY TỜ GÌ? - Vận Tải Phương Vy | Vận chuyển hàng hóa cần lưu ý những loại giấy tờ gì? | 849→482 |
| `/blog/van-chuyen-hang-hoa-nguy-hiem/` | VẬN CHUYỂN HÀNG HÓA NGUY HIỂM BẠN CẦN BIẾT GÌ? - Vận Tải Phương Vy | Vận chuyển hàng hóa nguy hiểm: bạn cần biết gì? \| Phương Vy | 738→564 |
| `/thu-ngo/` | THƯ NGỎ - Vận Tải Phương Vy | Thư ngỏ - Vận Tải Phương Vy | 288→269 |

Có 5 title khác rộng hơn 600 px nhưng không cần sửa, vì khi bị cắt chúng chỉ mất đuôi "Vận Tải Phương Vy": `/van-chuyen-hang-hoa/tay-nguyen/`, `/van-chuyen-hang-hoa/sieu-truong-sieu-trong/`, `/van-chuyen-hang-hoa/binh-duong/`, `/van-chuyen-hang-hoa/duong-hang-khong/` và `/blog/hang-hoa-thuong-gap-trong-nganh-van-tai/`.

## 4. Cần chủ site quyết định

- **Mức giảm giá ghi trong description.** 11 trang hứa các mức giảm khác nhau. Nếu mức nào đã hết hiệu lực thì Google đang hiển thị một lời hứa sai.
  - Giảm 10% trong tháng: An Giang, Hòa Bình, Nam Định, Long An.
  - Giảm 7–10%: Bắc Giang, Bình Định, Hải Phòng, Vĩnh Phúc.
  - Giảm 10%: Bình Phước, Đồng Nai.
  - Giảm 7% cho khách mới: Điện Biên – Lai Châu.
  - Các mức này khác với ưu đãi toàn site là giảm 7%.
- **"#1", "số 1", "nhất".** Các từ này xuất hiện trong 5 title và 18 description.
  - Luật Quảng cáo (Điều 8) cấm dùng "nhất", "tốt nhất", "số một" khi không có tài liệu hợp pháp chứng minh.
  - Phần đề xuất ở mục 3 đã bỏ các từ này khỏi title. Với description, cần quyết định bỏ hay giữ.
- **Bài `/blog/bien-bao-cam-xe-tai-va-muc-phat/`.** Title "[UPDATE] … mới 04/2023" phản ánh nội dung viết năm 2023. Nên cập nhật nội dung trước rồi mới đổi title, không đổi riêng title.
- **Description trang tuyển dụng.** Câu "chế độ tốt 2026" sẽ thành năm cũ từ năm 2027. Cần cập nhật hằng năm hoặc bỏ năm khỏi câu.
- **Các cặp trang trùng chủ đề:**
  - 2 bài về vận chuyển hàng hóa nguy hiểm (`/blog/quy-dinh-van-chuyen-hang-hoa-nguy-hiem/` và `/blog/van-chuyen-hang-hoa-nguy-hiem/`).
  - Đắk Lắk và Buôn Ma Thuột.
  - Bình Thuận và Phan Thiết.

  Sau khi chuyển domain, nên xem trong Search Console truy vấn nào đang dẫn vào trang nào, rồi mới quyết định gộp trang hay phân vai cho từng trang.

## 5. Cách áp dụng khi được duyệt

`src/legacy-content/seo-meta.json` là bản chụp Rank Math và không được sửa. Các thay đổi được duyệt sẽ nằm trong một danh sách ghi đè riêng, theo đường dẫn trang, và `scripts/build-legacy.ts` áp dụng danh sách đó khi build. Nhờ vậy title và description mới được cập nhật đồng bộ ở mọi nơi dùng chúng:
- Thẻ meta.
- Open Graph.
- Bản `.md` của trang.
- `llms.txt`.

Test sẽ kiểm tra hai điều: mọi trang không có trong danh sách ghi đè vẫn giữ đúng dữ liệu Rank Math, và danh sách ghi đè chỉ chứa các trang có thật.
