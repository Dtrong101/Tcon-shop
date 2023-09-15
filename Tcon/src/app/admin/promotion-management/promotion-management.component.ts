import { DataService } from 'src/app/sharepage/services/data.service';
import { AuthService } from './../../sharepage/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Promotion } from './../../sharepage/services/promotion';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-promotion-management',
  templateUrl: './promotion-management.component.html',
  styleUrls: ['./promotion-management.component.css']
})
export class PromotionManagementComponent {
  ItemList: Promotion[] = [];
  ItemObj: Promotion = {
    id: '',
    promotionCode: '',
    itemQuantity: 0,
    discountPercentage: 0,
    // Các thuộc tính khác ở đây
  };
  id: string = '';
  PromotionCode: string = '';
  ItemQuantity: number = 0;
  DiscountPercentage: number = 0;
  // Các thuộc tính khác ở đây

  constructor(private router: Router, private auth: AuthService, private data: DataService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getAllItem();
  }

  getAllItem() {
    this.data.getAllItemPromotion().subscribe(
      (res) => {
        this.ItemList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          
        console.log(data);
          return data;
        });
      },
      (err) => {
        alert('Lỗi khi xử lý dữ liệu sản phẩm');
      }
    );
  }

  resetForm() {
    this.id = '';
    this.PromotionCode = '';
    this.ItemQuantity = 0;
    this.DiscountPercentage = 0;
    // Đặt các thuộc tính khác về giá trị mặc định
  }

  addItem() {
    if (
      this.ItemQuantity <= 0 ||
      this.DiscountPercentage <= 0 
    ) {
      alert('Điền đầy đủ thông tin và giá trị hợp lệ');
      return;
    }

    this.ItemObj.id = '';
    this.ItemObj.promotionCode = this.PromotionCode;
    this.ItemObj.itemQuantity = this.ItemQuantity;
    this.ItemObj.discountPercentage = this.DiscountPercentage;
    // Đặt các thuộc tính khác ở đây

    this.data.addItemPromotion(this.ItemObj);
    this.showSuccessToast('Thêm khuyến mãi thành công');
    this.resetForm();
    this.selectedItem = null;
  }

  updateItem() {
    if (
      this.ItemQuantity <= 0 ||
      this.DiscountPercentage <= 0 
      // Kiểm tra các điều kiện khác ở đây
    ) {
      alert('Điền đầy đủ thông tin và giá trị hợp lệ');
      return;
    }
  
    // Đảm bảo ItemObj có ID của khuyến mãi cần cập nhật
    if (!this.ItemObj.id) {
      alert('Không tìm thấy ID khuyến mãi cần cập nhật');
      return;
    }
  
    // Cập nhật ItemObj với dữ liệu hiện tại từ form
    this.ItemObj.promotionCode = this.PromotionCode;
    this.ItemObj.itemQuantity = this.ItemQuantity;
    this.ItemObj.discountPercentage = this.DiscountPercentage;
    // Cập nhật các thuộc tính khác ở đây
  
    // Gọi phương thức updateItem() từ DataService
    this.data
      .updateItemPromotion(this.ItemObj)
      .then(() => {
        this.showSuccessToast('Cập nhật khuyến mãi thành công');
        this.resetForm();
      })
      .catch((error) => {
        alert('Lỗi khi cập nhật khuyến mãi: ' + error);
      });
    this.selectedItem = null;
  }

  selectedItem: Promotion | null = null;
  selectItem(item: Promotion) {
    this.selectedItem = item;
    this.id = item.id;
    this.ItemObj = { ...item }; // Sao chép thuộc tính của sản phẩm để cập nhật
    this.PromotionCode = item.promotionCode;
    this.ItemQuantity = item.itemQuantity;
    this.DiscountPercentage = item.discountPercentage;
    // Đặt các thuộc tính khác ở đây
  }

  private showSuccessToast(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000, // Thời gian hiển thị toast message (đơn vị: milliseconds)
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['success']
    });
  }

  deleteItem(item: Promotion) {
    if (window.confirm('Bấm xác nhận để xoá mã khuyến mãi: ' + item.promotionCode + '?')) {
      this.data
        .deleteItemPromotion(item)
        .then(() => {
          this.showSuccessToast('Xoá mã khuyến mãi thành công')
          this.resetForm();
          this.selectedItem = null;
        })
        .catch((error) => {
          alert('Lỗi khi xoá mã khuyến mãi: ' + error);
        });
    }
  }
}
