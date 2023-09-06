export interface Item {
    id: string,
    image: string,
    name: string,
    type: string,
    color: string,
    storage: string,
    price: number,
    quantity: number,
    comments?: Comment[]; // Mảng chứa các bình luận của sản phẩm (thêm dấu '?' để cho phép trường này có thể không có)
}

export interface Comment {
    id: string;      // Mã duy nhất của bình luận
    username: string; // Tên người bình luận
    text: string;    // Nội dung bình luận
  }

export interface ShoppingCartItem extends Item {
    addedToCartQuantity: number;
}