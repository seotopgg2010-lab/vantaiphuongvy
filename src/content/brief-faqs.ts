// Master Brief FINAL v17, section F. Keep answers with their service context.
export const BRIEF_FAQS = {
  shipping: [
    { question: 'Gửi hàng từ Việt Nam sang Đức và châu Âu mất bao lâu?', answer: 'Chuyển phát nhanh khoảng 4–6 ngày; đường biển khoảng 45–55 ngày (nguyên container khoảng 40 ngày, hàng lẻ ghép container thêm 1–2 tuần).' },
    { question: 'Bao trọn thuế phí (DDP) là gì?', answer: 'Hamburg Connect nhận hàng tại Việt Nam, vận chuyển, làm thủ tục và thanh toán thuế phí nhập khẩu thay anh chị, rồi giao đến tận cửa. Gói áp dụng cho hàng không (cargo DDP) và đường biển trọn gói; anh chị nhận hàng kèm đầy đủ hóa đơn, chứng từ.' },
    { question: 'Chuyển phát nhanh có bao gồm thuế không?', answer: 'Không. Khi hàng đến nước nhận, hãng chuyển phát gửi thông báo thuế kèm đường dẫn thanh toán. Anh chị tự thanh toán, hoặc ủy thác để Hamburg Connect thanh toán hộ qua hệ thống đại lý. Thuế được cập nhật xong, hãng lên lịch giao hàng.' },
    { question: 'Cước vận chuyển tính thế nào?', answer: 'Chuyển phát nhanh và đường hàng không: so sánh trọng lượng thực với trọng lượng quy đổi (Dài × Rộng × Cao cm / 5000), lấy số lớn hơn. Đường biển hàng lẻ tính theo số khối (CBM) hoặc số ký. Nguyên container tính theo loại container.' },
    { question: 'Hàng cồng kềnh như bảng hiệu, nội thất có gửi được không?', answer: 'Có, hàng được đóng kiện gỗ riêng theo kích thước, trọng lượng, hun trùng đạt chuẩn ISPM 15.' },
  ],
  signage: [
    { question: 'Khi hàng đến nơi, tôi có tự lắp đặt được không?', answer: 'Được, bảng hiệu làm dạng module, kèm bản vẽ và hướng dẫn lắp đặt; anh chị tự lắp hoặc nhờ thợ tại địa phương.' },
    { question: 'Bảng hiệu LED có dùng được với điện ở nước ngoài không?', answer: 'Thông số điện được điều chỉnh theo tiêu chuẩn của thị trường nhận hàng.' },
    { question: 'Làm một bảng hiệu mất bao lâu?', answer: 'Tùy kích thước, chất liệu và hiệu ứng đèn; tiến độ cụ thể được báo theo từng dự án.' },
  ],
  printing: [
    { question: 'Tôi có cần gửi file thiết kế sẵn không?', answer: 'Anh chị gửi file sẵn, hoặc để Hamburg Connect thiết kế mới từ ý tưởng của mình.' },
    { question: 'Có duyệt mẫu trước khi in số lượng lớn không?', answer: 'Có, anh chị duyệt hình ảnh hoặc mẫu thực tế trước khi sản xuất.' },
    { question: 'Tôi thích một mẫu trên web, đặt thế nào?', answer: 'Anh chị ghi mã mẫu (ví dụ TC-03) vào ô Mô tả nhu cầu trong Form Liên hệ.' },
  ],
  supply: [
    { question: 'Tôi chưa có bản vẽ hay ý tưởng rõ ràng, có bắt đầu được không?', answer: 'Được, chỉ cần mô tả mong muốn và gửi vài hình ảnh tham khảo.' },
    { question: 'Tôi có thể đặt một vài hạng mục thay vì trọn gói không?', answer: 'Được, anh chị chọn đúng phần mình cần.' },
    { question: 'Hamburg Connect có lắp đặt, thi công tại nước ngoài không?', answer: 'Hamburg Connect tập trung vào cung ứng và logistics quốc tế; hàng được ghi rõ thông số, kèm hướng dẫn để anh chị phối hợp với đơn vị lắp đặt tại địa phương.' },
    { question: 'Từ lúc đặt đến khi nhận đủ hàng khai trương mất bao lâu?', answer: 'Tùy số lượng hạng mục; Hamburg Connect lập kế hoạch tính ngược từ ngày khai trương.' },
  ],
};

const ENGLISH_FAQS: typeof BRIEF_FAQS = {
  shipping: [
    { question: 'How long does shipping from Vietnam to Germany and Europe take?', answer: 'Express delivery takes approximately 4–6 days; sea freight takes approximately 45–55 days. Full containers take around 40 days; consolidated shipments may require an additional 1–2 weeks.' },
    { question: 'What is duty and tax inclusive shipping (DDP)?', answer: 'Hamburg Connect receives goods in Vietnam, transports them, handles customs and pays import duties and taxes on your behalf before doorstep delivery. Available for air cargo DDP and all-inclusive sea freight, with invoices and shipping documents.' },
    { question: 'Does express shipping include import taxes?', answer: 'No. The courier sends a tax notification and payment link at destination. You can pay directly or authorize Hamburg Connect to arrange payment through its agent network. Delivery is scheduled after payment is recorded.' },
    { question: 'How is shipping charged?', answer: 'For express and air freight, the larger of actual weight and volumetric weight is used: length × width × height in centimetres / 5000. Consolidated sea freight is charged by volume (CBM) or weight; full containers by container type.' },
    { question: 'Can bulky items such as signs and furniture be shipped?', answer: 'Yes. Wooden crates are prepared to suit the dimensions and weight, with ISPM 15 treatment.' },
  ],
  signage: [
    { question: 'Can I install the sign when it arrives?', answer: 'Yes. Signs are supplied in modules with drawings and installation guidance, for installation by you or a local contractor.' },
    { question: 'Will LED signs work with the electricity supply abroad?', answer: 'Electrical specifications are adjusted to the destination market.' },
    { question: 'How long does sign production take?', answer: 'Timing depends on dimensions, materials and lighting effects. A schedule is quoted for each project.' },
  ],
  printing: [
    { question: 'Do I need to provide a finished design file?', answer: 'You can provide your file or ask Hamburg Connect to create a design from your ideas.' },
    { question: 'Can I approve a sample before a large print run?', answer: 'Yes. Images or a physical sample are approved before production.' },
    { question: 'How do I order a design shown on the website?', answer: 'Enter its reference code, such as TC-03, in the Needs description field on the contact form.' },
  ],
  supply: [
    { question: 'Can I start without drawings or a clear concept?', answer: 'Yes. Describe your wishes and send a few sample photos.' },
    { question: 'Can I order selected items instead of a complete package?', answer: 'Yes. Choose the items you need.' },
    { question: 'Does Hamburg Connect install or build on site abroad?', answer: 'Hamburg Connect focuses on supply and international logistics. Goods include specifications and guidance so you can coordinate installation with a local contractor.' },
    { question: 'How long until all goods arrive for opening?', answer: 'Timing depends on the number of items. Hamburg Connect plans backwards from your opening date.' },
  ],
};

export function getBriefFaqs(lang: string) {
  return lang.toLowerCase().startsWith('en') ? ENGLISH_FAQS : BRIEF_FAQS;
}
