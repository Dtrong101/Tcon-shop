import { DataService } from 'src/app/sharepage/services/data.service';
import { AuthService } from './../../sharepage/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Users } from './../../sharepage/services/users';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  ItemList: Users[] = [];
  ItemObj: Users = {
    uid: '',
    address: '',
    displayName: '',
    email: '',
    emailVerified: '',
    phone: '',
    role: '0',
  };
  uid: string = '';
  address: string ='';
  displayName: string = '';
  email: string = '';
  emailVerified: string = '';
  phone: string = '';
  role: string = '';
  selectedImage: File | null = null;

  constructor(private router: Router, private auth: AuthService, private data: DataService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getAllItem();
  }

  getAllItem() {
    this.data.getAllItemUser().subscribe(
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

  resetForm() {
    this.uid = '';
    this.email = '';
    this.emailVerified = '';
    this.displayName = '';
    this.role = '';
    this.phone = '';
  }

  viewItemDetails(item: any) {
    // Chuyển đến trang chi tiết với id của mục
    this.router.navigate(['/phone', item.id]);
  }

  updateItem() {
    if (
      this.email === '' ||
      this.displayName === '' ||
      this.role === '' ||
      this.phone === '' 
    ) {
      alert('Điền đầy đủ thông tin');
      return;
    }

    // Đảm bảo ItemObj có ID của sản phẩm cần cập nhật
    if (!this.ItemObj.uid) {
      alert('Không tìm thấy ID sản phẩm cần cập nhật');
      return;
    }


    // Cập nhật ItemObj với dữ liệu hiện tại từ form
    this.ItemObj.uid = this.uid;
    this.ItemObj.address = this.address;
    this.ItemObj.displayName = this.displayName;
    this.ItemObj.email = this.email;
    this.ItemObj.phone = this.phone;
    this.ItemObj.role = this.role;

    // Gọi phương thức updateItem() từ DataService
    this.data
      .updateItemUser(this.ItemObj)
      .then(() => {
        this.showSuccessToast('Cập nhật thành viên thành công');
        this.resetForm();
      })
      .catch((error) => {
        alert('Lỗi khi cập nhật thành viên: ' + error);
      });
    this.selectedItem = null;
  }

  selectedItem: Users | null = null;
  selectItem(item: Users) {
    this.selectedItem = item;
    this.ItemObj = { ...item }; // Sao chép thuộc tính của sản phẩm để cập nhật
    this.uid = item.uid;
    this.address = item.address;
    this.displayName = item.displayName;
    this.email = item.email;
    this.phone = item.phone; // This line may need adjustment if 'ItemColor' is not the correct property
    this.role = item.role;
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
