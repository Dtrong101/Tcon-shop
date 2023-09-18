import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { CartService } from 'src/app/sharepage/services/cart.service';
import { Item } from 'src/app/sharepage/services/item';
import { AuthService } from 'src/app/sharepage/services/auth.service';
import { User } from 'src/app/sharepage/services/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: Item[] = [];
  total: number = 0;
  promotion: any = '';
  userInfo: User | any;
  guestInfo: any = {}; // Đặt giá trị mặc định là một đối tượng trống
  isLoggedIn: boolean = false;
  paymentHandler: any = null;
  discountAmount: number = 0;
  public payPalConfig?: IPayPalConfig;

  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest!: FormGroup;

  createToken(): void {
    const name = this.stripeTest.get('name')!.value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private renderer: Renderer2,
    private fb: FormBuilder, private stripeService: StripeService
  ) { }

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    this.initConfig((this.total - this.discountAmount) / 25000);

    this.authService.afAuth.authState.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.authService.getUserInfo(user.uid).subscribe((userInfo) => {
          this.userInfo = userInfo;
          // Điền thông tin người dùng vào form khi đã đăng nhập
          if (this.userInfo) {
            this.guestName = this.userInfo.displayName || '';
            this.guestEmail = this.userInfo.email || '';
            this.guestAddress = this.userInfo.address || '';
            this.guestPhone = this.userInfo.phone || '';
          }
        });
      }
    });


    const script = `
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src='https://embed.tawk.to/6504f6330f2b18434fd8cadb/1hadm3eov';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();`;
    const el = this.renderer.createElement('script');
    el.text = script;
    this.renderer.appendChild(document.body, el);

  }

  async applyPromotion() {
    // Lấy mã khuyến mãi từ input
    const promotionCode = this.promotion;
    console.log(promotionCode)
    // Sử dụng AngularFirestore để truy vấn dữ liệu
    const promotionRef = this.afs.collection('promotion').doc(promotionCode);
    console.log(promotionRef)

    // Lắng nghe sự thay đổi của tài liệu với mã khuyến mãi tương ứng
    promotionRef.valueChanges().subscribe((promotion: any) => {
      console.log(promotion)

      if (promotion) {
        // Tính giảm giá dựa trên phần trăm giảm giá từ mã khuyến mãi
        const discountPercentage = promotion.discountPercentage;
        this.discountAmount = (this.total * discountPercentage) / 100;


      } else {
        // Nếu mã khuyến mãi không tồn tại, đặt giá trị giảm giá về 0
        this.discountAmount = 0;
      }
    });
  }

  private initConfig(total: any): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: total,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: total
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: total,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
        if (this.isLoggedIn && this.userInfo) {
          // Cập nhật thông tin người dùng từ form nhập liệu
          this.userInfo.displayName = this.guestName;
          this.userInfo.email = this.guestEmail;
          this.userInfo.address = this.guestAddress;
          this.userInfo.phone = this.guestPhone;
          if (this.selectedPaymentMethod == 'thẻ tín dụng') {

            this.authService.updateUserInfo(this.userInfo.uid, this.userInfo)
              .then(() => {
                this.showSuccessToast('Đặt hàng thành công!');
                this.saveOrderToFirestore();
              })
              .catch((error) => {
                window.alert('Lưu thông tin người dùng không thành công!');
              });
          }
          else {
            this.authService.updateUserInfo(this.userInfo.uid, this.userInfo)
              .then(() => {
                this.showSuccessToast('Đặt hàng thành công!');
                this.saveOrderToFirestore();
              })
              .catch((error) => {
                window.alert('Lưu thông tin người dùng không thành công!');
              });
          }
        } else {
          this.guestInfo = {
            name: this.guestName,
            email: this.guestEmail,
            address: this.guestAddress,
            phone: this.guestPhone,
          };
          if (this.selectedPaymentMethod == 'thẻ tín dụng') {
            this.authService.saveGuestOrder(this.cartItems, this.guestInfo)
              .then(() => {
                this.showSuccessToast('Đặt hàng thành công!');
                // console.log('Đã xác nhận đơn hàng thành công.');
                this.saveOrderToFirestore();
              })
              .catch((error) => {
                window.alert('Lưu thông tin đơn hàng của khách không thành công!');
              });
          }
          else {
            this.authService.saveGuestOrder(this.cartItems, this.guestInfo)
              .then(() => {
                this.showSuccessToast('Đặt hàng thành công!');
                // console.log('Đã xác nhận đơn hàng thành công.');
                this.saveOrderToFirestore();
              })
              .catch((error) => {
                window.alert('Lưu thông tin đơn hàng của khách không thành công!');
              });
          }
        }
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  private showSuccessToast(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000, // Thời gian hiển thị toast message (đơn vị: milliseconds)
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['success']
    });
  }


  private calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  removeFromCart(item: Item) {
    this.cartService.removeFromCart(item);
    this.calculateTotal();
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }

  updateQuantity(item: Item) {
    this.cartService.updateCartItemQuantity(item);
    this.calculateTotal();
  }

  async checkout() {
    if (this.isLoggedIn && this.userInfo) {
      // Cập nhật thông tin người dùng từ form nhập liệu
      this.userInfo.displayName = this.guestName;
      this.userInfo.email = this.guestEmail;
      this.userInfo.address = this.guestAddress;
      this.userInfo.phone = this.guestPhone;
      if (this.selectedPaymentMethod == 'thẻ tín dụng') {

        this.authService.updateUserInfo(this.userInfo.uid, this.userInfo)
          .then(() => {
            this.showSuccessToast('Đặt hàng thành công!');
            this.saveOrderToFirestore();
          })
          .catch((error) => {
            window.alert('Lưu thông tin người dùng không thành công!');
          });
      }
      else {
        this.authService.updateUserInfo(this.userInfo.uid, this.userInfo)
          .then(() => {
            this.showSuccessToast('Đặt hàng thành công!');
            this.saveOrderToFirestore();
          })
          .catch((error) => {
            window.alert('Lưu thông tin người dùng không thành công!');
          });
      }
    } else {
      this.guestInfo = {
        name: this.guestName,
        email: this.guestEmail,
        address: this.guestAddress,
        phone: this.guestPhone,
      };
      if (this.selectedPaymentMethod == 'thẻ tín dụng') {
        this.authService.saveGuestOrder(this.cartItems, this.guestInfo)
          .then(() => {
            this.showSuccessToast('Đặt hàng thành công!');
            // console.log('Đã xác nhận đơn hàng thành công.');
            this.saveOrderToFirestore();
          })
          .catch((error) => {
            window.alert('Lưu thông tin đơn hàng của khách không thành công!');
          });
      }
      else {
        this.authService.saveGuestOrder(this.cartItems, this.guestInfo)
          .then(() => {
            this.showSuccessToast('Đặt hàng thành công!');
            // console.log('Đã xác nhận đơn hàng thành công.');
            this.saveOrderToFirestore();
          })
          .catch((error) => {
            window.alert('Lưu thông tin đơn hàng của khách không thành công!');
          });
      }
    }
  }

  saveOrderToFirestore() {
    // Lưu thông tin đơn hàng vào Firestore
    const orderId = this.afs.createId();
    const orderData = {
      id: orderId,
      cartItems: this.cartItems,
      buyer: this.userInfo || this.guestInfo,
      orderTime: new Date(),
      total: (this.total - this.discountAmount),
      paymentMethod: this.selectedPaymentMethod,
    };

    const notification = {
      id: orderId,
      buyer: this.userInfo || this.guestInfo,
      orderTime: new Date(),
      total: (this.total - this.discountAmount),
      describe: "Bạn vừa có đơn hàng mới!",
    };

    // Thực hiện lưu vào Firestore
    this.authService.saveOrder(orderData)
      .then(() => {
        console.log('Đã lưu thông tin đơn hàng vào Firestore');
        this.cartService.clearCart();
        this.resetForm();
      })
      .catch((error) => {
        console.error('Lỗi khi lưu thông tin đơn hàng vào Firestore:', error);
      });

    // Thực hiện lưu vào Firestore
    this.authService.saveNotification(notification)
      .then(() => {
        console.log('Đã lưu thông tin thông báo vào Firestore');
      })
      .catch((error) => {
        console.error('Lỗi khi lưu thông tin thông báo vào Firestore:', error);
      });

    this.clearCart();
  }

  resetForm() {
    // Reset giá trị của guestInfo về một đối tượng trống
    this.guestInfo = {};

    // Reset form nhập liệu cho guest
    this.guestName = '';
    this.guestEmail = '';
    this.guestAddress = '';
    this.guestPhone = '';
  }

  // Tạo các biến để lưu thông tin nhập liệu của guest thông qua ngModel
  guestName: string = '';
  guestEmail: string = '';
  guestAddress: string = '';
  guestPhone: string = '';
  selectedPaymentMethod: string = '';

  CartNotEmpty(): boolean {
    return this.cartItems.length > 0 && this.selectedPaymentMethod === 'tiền mặt';
  }

}
