import { User } from 'src/app/sharepage/services/user';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/sharepage/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayName: string = '';
  phone: string = '';
  address: string ='';
  userName: string | null = null;
  userPhone: string | null = null;
  userAddress: string | null = null;
  userInfo: User | any;
  isLoggedIn: boolean = false;
  isEditMode: boolean = false; // Biến để theo dõi trạng thái chỉnh sửa

  constructor(public authService: AuthService, private snackBar: MatSnackBar) {
    if (this.authService.userData && this.authService.userData.uid) {
      this.authService.getUserInfo(this.authService.userData.uid).subscribe(
        (user) => {
          this.userInfo = user;
        },
        (error) => {
          console.log('Lỗi khi lấy thông tin người dùng: ', error);
        }
      );
    } else {
      console.log('Không có thông tin người dùng hoặc uid không hợp lệ');
    }
  }
  
  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        // Lấy thông tin người dùng từ Firestore
        this.authService.getUserInfo(user.uid).subscribe((userInfo) => {
          this.userInfo = userInfo;
          if (this.userInfo) {
            this.displayName = this.userInfo.displayName || '';
            this.address = this.userInfo.address || '';
            this.phone = this.userInfo.phone || '';
          }
        });

        // Lấy thông tin người dùng từ các trường đơn lẻ (tên, địa chỉ, số điện thoại) trong Firestore
        this.authService.getDisplayNameFromFirestore(user.uid).subscribe((displayName) => {
          this.userName = displayName; // Gán giá trị vào biến userName
        });
        this.authService.getPhoneFromFirestore(user.uid).subscribe((phone) => {
          this.userPhone = phone; // Gán giá trị vào biến userPhone
        });
        this.authService.getAddressFromFirestore(user.uid).subscribe((address) => {
          this.userAddress = address; // Gán giá trị vào biến userAddress
        });
      }
    });
  }
  

  toggleEditMode() {
    this.isEditMode = !this.isEditMode; // Đảo ngược giá trị trạng thái chỉnh sửa
    this.userName = null;
      this.userPhone = null;
      this.userAddress = null;
  }

  savePersonalInfo(){
    this.userInfo.displayName = this.userName;
    this.userInfo.address = this.userAddress;
    this.userInfo.phone = this.userPhone;

    this.authService.updateUserInfo(this.userInfo.uid, this.userInfo)
    .then(() => {
      this.isEditMode = false; // Thoát khỏi trạng thái chỉnh sửa sau khi lưu thông tin thành công
      this.showSuccessToast('Thay đổi thông tin thành công')
    })
    .catch((error) => {
      console.error('Lỗi khi lưu thông tin: ', error);
    });
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
