import type { ShippingRouteContent } from '@/types/database';

type Guide = { description: string; service_types: ShippingRouteContent };
const shared = {
  air: 'Trao đổi phương án đường hàng không theo lịch cần nhận và đặc điểm hàng.',
  sea: 'Trao đổi phương án đường biển cho lô phù hợp; cần kích thước kiện, điểm đi và địa chỉ nhận.',
  price_notes: 'Báo giá cần xác nhận số kiện, trọng lượng, kích thước sau đóng gói, địa chỉ nhận và phạm vi dịch vụ. Anh/chị nên làm rõ các khoản đã bao gồm và các khoản người nhận có thể phải thanh toán trước khi chốt.',
  time_notes: 'Lịch nhận dự kiến được xác nhận theo từng lô, sau khi có quy cách đóng gói và phương án vận chuyển. Thời gian tham khảo không thay thế lịch xác nhận cho đơn hàng.',
  process: ['Gửi danh sách hàng, ảnh và địa chỉ nhận', 'Đối chiếu kích thước, trọng lượng và quy cách', 'Thống nhất phương án, chi phí và lịch dự kiến', 'Kiểm đếm, bảo vệ và đóng gói', 'Hoàn thiện thông tin lô hàng và bàn giao vận chuyển', 'Theo dõi và đối chiếu khi nhận hàng'],
};

export const shippingGuides: Record<string, Guide> = {
  'gui-bang-hieu-di-my': {
    description: 'Bảng hiệu cần được chuẩn bị theo vật liệu, kết cấu và kích thước thực tế. Anh/chị gửi ảnh mặt trước, mặt sau, bản vẽ kích thước và địa chỉ nhận tại Mỹ để Hamburg Connect tư vấn phương án đóng gói và vận chuyển. Với logo wall, chữ nổi hoặc hộp đèn, cần xác nhận các chi tiết có thể tháo rời, phụ kiện và cách đối chiếu khi nhận. Mục tiêu là bảo vệ bề mặt hoàn thiện, góc cạnh và các bộ phận nhạy cảm trong suốt quá trình giao nhận.',
    service_types: { ...shared,
      goods: ['Chữ nổi, bộ chữ và logo theo nhận diện', 'Bảng hiệu mặt tiền và logo wall', 'Hộp đèn, bảng hiệu có bộ phận chiếu sáng — xác nhận cấu hình trước khi gửi', 'Phụ kiện lắp đặt đi kèm đã được kiểm đếm'],
      packing: 'Tách các chi tiết có thể tháo rời theo phương án đã duyệt; đánh dấu vị trí lắp ghép và lập danh sách phụ kiện. Bảo vệ bề mặt, chèn cố định và gia cố góc cạnh để tránh các phần cọ vào nhau. Với hạng mục lớn, cần thống nhất khung hoặc kiện phù hợp, đồng thời đo lại kích thước sau đóng gói để tư vấn cước.',
      related_product_slugs: ['bang-hieu-mat-tien', 'logo-wall', 'lightbox'],
      faqs: [
        { question: 'Cần gửi thông tin gì để tư vấn?', answer: 'Ảnh hai mặt, vật liệu, kích thước từng phần, trọng lượng dự kiến, chi tiết điện/phụ kiện nếu có và địa chỉ nhận. Với bộ chữ rời, gửi thêm sơ đồ bố trí và số lượng chi tiết.' },
        { question: 'Có nên tháo rời bảng hiệu?', answer: 'Chỉ tháo các phần phù hợp với kết cấu và hướng dẫn lắp đặt. Cần thống nhất trước khi đóng gói để tránh làm hỏng bề mặt, đầu nối hoặc mất phụ kiện.' },
        { question: 'Chi phí phụ thuộc những gì?', answer: 'Kích thước và trọng lượng sau đóng kiện, vật liệu, cách bảo vệ, phương án vận chuyển và địa chỉ nhận. Không nên tính chỉ từ kích thước mặt bảng khi chưa có bao bì bảo vệ.' },
        { question: 'Khi nhận cần kiểm tra gì?', answer: 'Đối chiếu số kiện và danh sách chi tiết; ghi nhận tình trạng bao bì trước khi mở. Giữ lại ảnh và bao bì nếu phát hiện vấn đề để thuận tiện trao đổi cách xử lý.' },
      ],
    },
  },
  'gui-an-pham-in-an-di-my': {
    description: 'Menu, business card, brochure, thẻ quà tặng và bộ ấn phẩm thương hiệu có thể được gom theo cùng đơn hàng gửi đến Mỹ. Anh/chị cung cấp loại ấn phẩm, số lượng, quy cách giấy, kích thước và địa chỉ nhận. Hamburg Connect trao đổi cách chia bó, chia thùng và sắp xếp bộ sản phẩm để thuận tiện kiểm đếm. Với đơn khai trương hoặc sự kiện, nên gửi cả ngày cần sử dụng để thống nhất lịch hoàn thiện trước khi lựa chọn vận chuyển.',
    service_types: { ...shared,
      goods: ['Business card, gift card và loyalty card', 'Flyer, poster, brochure và menu', 'Sticker, tem nhãn và ấn phẩm đóng bộ', 'Thiệp mời, tag và ấn phẩm sự kiện'],
      packing: 'Chia ấn phẩm theo mẫu và số lượng, bọc bảo vệ bề mặt và chống xô lệch trong thùng. Chèn cạnh và góc cho sản phẩm giấy; tách riêng phụ kiện hoặc vật nặng có thể làm gãy nếp. Với bộ nhiều loại, ghi rõ danh mục trong từng thùng và đối chiếu đủ số lượng trước bàn giao.',
      related_product_slugs: ['business-card', 'brochure', 'menu', 'bo-an-pham-thuong-hieu'],
      faqs: [
        { question: 'Có thể gửi nhiều loại ấn phẩm cùng nhau?', answer: 'Có thể trao đổi phương án gom các loại trong một lô. Cần cung cấp quy cách, số lượng từng loại và cách chia theo tiệm hoặc chi nhánh để đóng gói dễ kiểm đếm.' },
        { question: 'Trước khi in cần kiểm tra nội dung gì?', answer: 'Logo, tên thương hiệu, số điện thoại, địa chỉ, bảng giá, điều kiện ưu đãi và mã QR. Mẫu in cần được duyệt trước khi sản xuất để tránh phải làm lại sau vận chuyển.' },
        { question: 'Cần gửi ngày khai trương khi nào?', answer: 'Ngay ở bước trao đổi nhu cầu. Lịch sản xuất, hoàn thiện và vận chuyển cần được tính cùng nhau; chỉ chốt lịch nhận sau khi xác nhận quy cách và phương án.' },
      ],
    },
  },
};

const destinations = [
  ['gui-hang-di-my', 'Mỹ', 'Đơn hàng có thể gồm bảng hiệu, ấn phẩm hoặc vật dụng cho tiệm. Với nhiều chi nhánh, nên tách danh sách và địa chỉ nhận từng nơi để tránh nhầm số lượng khi giao.'],
  ['gui-hang-di-canada', 'Canada', 'Anh/chị cung cấp thành phố, tỉnh bang và mã bưu chính đầy đủ. Nếu người nhận là cửa hàng, nên xác nhận giờ nhận hàng, người liên hệ và khả năng tiếp nhận kiện lớn.'],
  ['gui-hang-di-chau-au', 'Châu Âu', 'Cần xác định quốc gia đích cụ thể, thay vì chỉ ghi khu vực Châu Âu. Thông tin nước nhận, mã bưu chính và người nhận là cơ sở để kiểm tra phương án và phạm vi giao hàng.'],
  ['gui-hang-di-duc', 'Đức', 'Địa chỉ cần có tên người nhận hoặc doanh nghiệp, đường và số nhà, mã bưu chính, thành phố và số liên hệ. Với hàng cho tiệm, nên xác nhận khả năng dỡ kiện và khung giờ nhận.'],
  ['gui-hang-di-uc', 'Úc', 'Anh/chị liệt kê rõ vật liệu, thành phần và tình trạng hàng. Các mặt hàng có nguồn gốc thực vật, động vật hoặc bao bì đặc thù cần được kiểm tra điều kiện nhận gửi trước khi đóng gói.'],
];
for (const [slug, country, destinationNote] of destinations) {
  shippingGuides[slug] = {
    description: `Gửi hàng đi ${country} được tư vấn theo từng lô hàng và nhu cầu của người nhận. ${destinationNote} Anh/chị gửi ảnh, tên hàng, số lượng, kích thước và trọng lượng dự kiến để đối chiếu trước khi chọn phương án. Với hàng sản xuất theo yêu cầu, nên trao đổi cả lịch hoàn thiện và lịch sử dụng để thống nhất tiến độ từ đầu.`,
    service_types: { ...shared,
      goods: ['Ấn phẩm và bao bì thương hiệu', 'Bảng hiệu và vật phẩm trưng bày sau khi xác nhận quy cách', 'Nội thất, thiết bị và vật dụng theo danh sách được kiểm tra trước'],
      packing: 'Phân loại theo độ dễ vỡ, bề mặt hoàn thiện và trọng lượng. Chèn cố định, bảo vệ góc cạnh và tách phụ kiện để thuận tiện kiểm đếm. Loại thùng hoặc kiện được thống nhất theo hàng thực tế; kích thước sau đóng gói là thông tin cần có khi xác nhận phương án.',
      related_product_slugs: ['packaging', 'bo-an-pham-thuong-hieu'],
      faqs: [
        { question: `Để tư vấn tuyến ${country}, cần thông tin nào?`, answer: `Danh sách và ảnh hàng, số lượng, kích thước/trọng lượng, địa chỉ nhận tại ${country} và thời điểm dự kiến sử dụng. ${destinationNote}` },
        { question: 'Có thể xác nhận chi phí trước khi có kích thước kiện?', answer: 'Có thể trao đổi phương án ban đầu, nhưng báo giá cần được đối chiếu lại theo kiện thực tế, địa chỉ nhận và các dịch vụ đi kèm trước khi chốt.' },
        { question: 'Hàng nào cần kiểm tra thêm trước khi gửi?', answer: 'Các mặt hàng có điều kiện vận chuyển, thành phần đặc thù, thiết bị hoặc bao bì đặc biệt cần được rà soát riêng. Hãy gửi đầy đủ thông tin để xác nhận khả năng nhận gửi cho lô cụ thể.' },
      ],
    },
  };
}
