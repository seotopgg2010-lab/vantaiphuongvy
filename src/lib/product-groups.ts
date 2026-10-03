export const PRODUCT_GROUPS = [
  { id: 'bang-hieu', title: 'Bảng hiệu', en: 'Signage', subtitle: 'Chữ nổi, LED, hộp đèn', category: 'bang-hieu-nhan-dien', slugs: [] },
  { id: 'the-phieu', title: 'Thẻ & Phiếu quà tặng', en: 'Cards & Vouchers', subtitle: 'Business Card, Gift Card, Loyalty Card', category: 'an-pham-bao-bi', slugs: ['business-card', 'gift-card', 'loyalty-card', 'appointment-card'] },
  { id: 'flyer-brochure', title: 'Flyer, Poster & Brochure', en: 'Flyers, Posters & Brochures', subtitle: 'Ấn phẩm quảng cáo', category: 'an-pham-bao-bi', slugs: ['flyer', 'poster', 'brochure'] },
  { id: 'menu', title: 'Menu in ấn', en: 'Printed Menus', subtitle: 'Menu chính, mang đi và để bàn', category: 'an-pham-bao-bi', slugs: ['menu', 'menu-mang-di', 'menu-de-ban'] },
  { id: 'sticker', title: 'Sticker, Tem nhãn & Decal', en: 'Stickers & Labels', subtitle: 'Tem logo và nhãn bao bì', category: 'an-pham-bao-bi', slugs: ['sticker-label'] },
  { id: 'bo-an-pham', title: 'Bộ ấn phẩm thương hiệu', en: 'Brand Print Sets', subtitle: 'Bộ cơ bản, bộ khai trương', category: 'an-pham-bao-bi', slugs: ['bo-an-pham-thuong-hieu'] },
  { id: 'bao-bi', title: 'Bao bì', en: 'Packaging', subtitle: 'Túi giấy, hộp giấy, giấy gói', category: 'an-pham-bao-bi', slugs: ['packaging'] },
  { id: 'thiep-su-kien', title: 'Thiệp & Ấn phẩm sự kiện', en: 'Invitations & Event Prints', subtitle: 'Thiệp mời và bộ ấn phẩm sự kiện', category: 'an-pham-bao-bi', slugs: ['thiep-cuoi-an-pham-su-kien'] },
];

export function getProductGroup(id: string | undefined, category: string) {
  return PRODUCT_GROUPS.find(group => group.id === id && group.category === category);
}
