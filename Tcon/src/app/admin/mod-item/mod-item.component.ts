import { DataService } from 'src/app/sharepage/services/data.service';
import { AuthService } from './../../sharepage/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Item } from './../../sharepage/services/item';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mod-item',
  templateUrl: './mod-item.component.html',
  styleUrls: ['./mod-item.component.css'],
})
export class ModItemComponent implements OnInit {
  ItemList: Item[] = [];
  ItemObj: Item = {
    id: '',
    image: '',
    name: '',
    type: '',
    color: '',
    storage: '',
    price: 0,
    quantity: 0,
  };
  id: string = '';
  ItemImage: string ='';
  ItemName: string = '';
  ItemQuantity: string = '';
  ItemPrice: string = '';
  ItemType: string = '';
  ItemColor: string = '';
  ItemStorage: string = '';
  ItemImgUrl: string = '';
  selectedImage: File | null = null;

  constructor(private router: Router, private auth: AuthService, private data: DataService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getAllItem();
  }

  getAllItem() {
    this.data.getAllItem().subscribe(
      (res) => {
        this.ItemList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err) => {
        alert('Lỗi khi xử lý dữ liệu sản phẩm');
      }
    );
  }

  onFileSelected(event: any) {
    // const file = event.target.files[0];
    // if (file) {
    //   this.selectedImage = file;

    //   // Tạo tên duy nhất cho tệp hình ảnh sử dụng timestamp
    //   const fileName = `${Date.now()}_${file.name}`;

    //   // Thư mục trong Firebase Storage để lưu trữ hình ảnh (tuỳ chọn)
    //   const storageRef = this.storage.ref('product_images/' + fileName);

    //   // Tải tệp lên Firebase Storage
    //   const uploadTask = this.storage.upload('product_images/' + fileName, file);

    //   // Lắng nghe sự kiện khi tải lên hoàn tất và lấy URL
    //   uploadTask
    //     .snapshotChanges()
    //     .pipe(
    //       finalize(() => {
    //         storageRef.getDownloadURL().subscribe((downloadURL) => {
    //           this.ItemImgUrl = downloadURL;
    //         });
    //       })
    //     )
    //     .subscribe();
    // }
  }

  resetForm() {
    this.id = '';
    this.ItemName = '';
    this.ItemQuantity = '';
    this.ItemPrice = '';
    this.ItemType = '';
    this.ItemColor = '';
    this.ItemStorage = '';
    this.ItemImage = '';
  }

  viewItemDetails(item: any) {
    // Chuyển đến trang chi tiết với id của mục
    this.router.navigate(['/phone', item.id]);
  }

  addItem() {
    if (
      this.ItemName === '' ||
      this.ItemPrice === '' ||
      this.ItemType === '' ||
      this.ItemQuantity === '' ||
      (this.ItemType !== 'Phụ kiện' && this.ItemColor === '') ||
      (this.ItemType !== 'Phụ kiện' && this.ItemStorage === '') ||
      this.ItemImage === '' // Check if the image field is empty
    ) {
      alert('Điền đẩy đủ thông tin');
      return;
    }

    this.ItemObj.id = '';
    this.ItemObj.name = this.ItemName;
    this.ItemObj.type = this.ItemType;
    this.ItemObj.quantity = parseInt(this.ItemQuantity);
    this.ItemObj.price = parseFloat(this.ItemPrice);
    this.ItemObj.color = this.ItemColor;
    this.ItemObj.storage = this.ItemStorage;
    this.ItemObj.image = this.ItemImage;

    this.data.addItem(this.ItemObj);
    this.showSuccessToast('Thêm sản phẩm thành công')
    this.resetForm();
    this.selectedItem = null;
  }

  deleteItem(item: Item) {
    if (window.confirm('Bấm xác nhận để xoá sản phẩm: ' + item.name + '?')) {
      this.data
        .deleteItem(item)
        .then(() => {
          this.showSuccessToast('Xoá sản phẩm thành công')
          this.resetForm();
          this.selectedItem = null;
        })
        .catch((error) => {
          alert('Lỗi khi xoá sản phẩm: ' + error);
        });
    }
  }

  updateItem() {
    if (
      this.ItemName === '' ||
      this.ItemPrice === '' ||
      this.ItemType === '' ||
      this.ItemQuantity === '' ||
      (this.ItemType !== 'Phụ kiện' && this.ItemColor === '') ||
      (this.ItemType !== 'Phụ kiện' && this.ItemStorage === '') ||
      this.ItemImage === '' // Check if the image field is empty
    ) {
      alert('Điền đầy đủ thông tin');
      return;
    }

    // Đảm bảo ItemObj có ID của sản phẩm cần cập nhật
    if (!this.ItemObj.id) {
      alert('Không tìm thấy ID sản phẩm cần cập nhật');
      return;
    }

    // Cập nhật ItemObj với dữ liệu hiện tại từ form
    this.ItemObj.name = this.ItemName;
    this.ItemObj.type = this.ItemType;
    this.ItemObj.quantity = parseInt(this.ItemQuantity);
    this.ItemObj.price = parseFloat(this.ItemPrice);
    this.ItemObj.color = this.ItemColor;
    this.ItemObj.storage = this.ItemStorage;
    this.ItemObj.image = this.ItemImage;

    // Gọi phương thức updateItem() từ DataService
    this.data
      .updateItem(this.ItemObj)
      .then(() => {
        this.showSuccessToast('Cập nhật sản phẩm thành công');
        this.resetForm();
      })
      .catch((error) => {
        alert('Lỗi khi cập nhật sản phẩm: ' + error);
      });
    this.selectedItem = null;
  }

  selectedItem: Item | null = null;
  selectItem(item: Item) {
    this.selectedItem = item;
    this.id = item.id;
    this.ItemObj = { ...item }; // Sao chép thuộc tính của sản phẩm để cập nhật
    this.ItemName = item.name;
    this.ItemType = item.type;
    this.ItemQuantity = item.quantity.toString();
    this.ItemPrice = item.price.toString();
    this.ItemColor = item.color;
    this.ItemStorage = item.storage;
    this.ItemImage = item.image;
  }

  private showSuccessToast(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000, // Thời gian hiển thị toast message (đơn vị: milliseconds)
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass:['success']
    });
  }
}
