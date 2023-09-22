import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Item } from './item';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Khai báo biến userData để lưu trữ thông tin người dùng đã đăng nhập
  userData: any;

  // Khai báo biến userInfo để lưu thông tin người dùng dưới dạng đối tượng User (đã định nghĩa trước đó)
  userInfo: User | null = null;

  // Constructor của AuthService, tiêm vào các dependency cần thiết
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service để loại bỏ cảnh báo ngoài phạm vi (outside scope)
  ) {
    /* Đăng ký lắng nghe sự kiện thay đổi trạng thái đăng nhập của người dùng.
    Khi đăng nhập hoặc đăng xuất, thông tin người dùng sẽ được lưu vào localStorage. */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Hàm đăng nhập bằng email/password
  SignIn(email: string, password: string) {
    // Sử dụng AngularFireAuth để thực hiện đăng nhập bằng email và mật khẩu
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // Nếu đăng nhập thành công, lưu thông tin người dùng vào Firestore và điều hướng đến trang dashboard

        this.afAuth.authState.subscribe(async (user) => {
          if (user && (await this.isAdmin())) {
            this.router.navigate(['admin-dashboard']);
          } else {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        // Nếu có lỗi, hiển thị thông báo lỗi
        window.alert(error.message);
      });
  }

  // Hàm đăng ký bằng email/password
  SignUp(email: string, password: string) {
    // Sử dụng AngularFireAuth để thực hiện đăng ký bằng email và mật khẩu
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Gọi hàm SendVerificationMail() để gửi email xác thực đến người dùng mới đăng ký.
        Sau đó lưu thông tin người dùng vào Firestore. */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        // Nếu có lỗi, hiển thị thông báo lỗi
        window.alert(error.message);
      });
  }

  // Gửi email xác thực khi người dùng đăng ký
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Hàm đặt lại mật khẩu khi người dùng quên mật khẩu
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Nhấn vào đường link trong email để đổi mật khẩu');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Phương thức trả về true nếu người dùng đã đăng nhập và email đã xác thực
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }


  /* Hàm đặt dữ liệu người dùng khi đăng nhập bằng tên người dùng/mật khẩu,
  đăng ký bằng tên người dùng/mật khẩu
  vào cơ sở dữ liệu Firestore bằng AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    console.log(userRef);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
    };


    return userRef.set(userData, {
      merge: true,
    });
  }

  // Hàm kiểm tra xem người dùng có quyền truy cập 'admin' không
  async isAdmin(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userRef = this.afs.doc(`users/${user.uid}`);
      const userSnapshot = await userRef.get().toPromise();
      const userData = userSnapshot?.data() as User;
      return userData!.role === 'admin';
    }
    return false;
  }

  // Hàm đăng xuất
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
    });
  }

  // Hàm lấy thông tin người dùng dựa trên UID
  getUserInfo(uid: string): Observable<User | null> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(
      `users/${uid}`
    );
    return userRef.valueChanges().pipe(
      map((user) => {
        return user || null;
      })
    );
  }

  // Hàm cập nhật thông tin người dùng
  updateUserInfo(uid: string, data: Partial<User>): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc<User>(
      `users/${uid}`
    );
    return userRef.update(data);
  }

  // Phương thức để lưu thông tin đơn hàng của khách vãng lai vào Firestore
  saveGuestOrder(cartItems: Item[], guestInfo: any): Promise<void> {
    const guestOrderRef: AngularFirestoreDocument<any> = this.afs
      .collection('guest_orders')
      .doc();
    const guestOrderData = {
      cartItems: cartItems,
      guestInfo: guestInfo,
      orderTime: new Date(),
    };
    return guestOrderRef.set(guestOrderData);
  }

  // Phương thức để lưu thông tin đơn hàng vào Firestore
  saveOrder(orderData: any): Promise<void> {
    const orderRef: AngularFirestoreDocument<any> = this.afs
      .collection('orders')
      .doc();
    return orderRef.set(orderData);
  }

  saveNotification(orderData: any): Promise<void> {
    const orderRef: AngularFirestoreDocument<any> = this.afs
      .collection('notification')
      .doc();
    return orderRef.set(orderData);
  }

  getFieldFromFirestore(uid: string, field: string): Observable<string> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    return userRef.valueChanges().pipe(
      map((userData: any) => {
        return userData[field] || ''; // Trả về giá trị của trường field nếu có hoặc trả về chuỗi rỗng nếu không có
      })
    );
  }

  getDisplayNameFromFirestore(uid: string): Observable<string> {
    return this.getFieldFromFirestore(uid, 'displayName');
  }

  getPhoneFromFirestore(uid: string): Observable<string> {
    return this.getFieldFromFirestore(uid, 'phone');
  }

  getAddressFromFirestore(uid: string): Observable<string> {
    return this.getFieldFromFirestore(uid, 'address');
  }


}
