import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Item } from 'src/app/sharepage/services/item';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/sharepage/services/cart.service';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private afs: AngularFirestore, private cartService: CartService, private router: Router, private renderer: Renderer2
    ) {
    this.products$ = this.afs.collection<Item>('Items').valueChanges();
    this.bestSellingItem$ = new Observable<Item>();

  }
  filteredProducts$: Observable<Item[]> = of([]);
  bestSellingItem$: Observable<Item | undefined>;


  ngOnInit(): void {
    this.products$ = this.afs.collection<Item>('Items').valueChanges();
    this.countDownTimer();
    this.bestSellingItem$ = this.afs.doc<Item>('Items/OCgaeSMmqxOJZZ27X5Sa').valueChanges();
    this.filteredProducts$ = this.products$.pipe(
      map(products => products.filter(item => item.color === 'Đen'))
    );
    this.products$.subscribe(products => {
      console.log(products);
      // Tiếp tục xử lý dữ liệu nếu cần
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

  products$: Observable<Item[]>;
  id:any;
  drop(param:any){
    if(this.id == param){
      this.id =""
    }
    else{
      this.id = param;
    }
  }

  partnersArray:any = [
    {
      imgName: "../../../assets/knowledge_graph_logo.png"
    },
    {
      imgName: "../../../assets/samsung-logo-text-png-1.png"
    },
    {
      imgName: "../../../assets/download.png"
    },
    {
      imgName: "../../../assets/anker2729.jpg"
    },
    {
      imgName: "../../../assets/pisen-logo.png"
    },
    {
      imgName: "../../../assets/mophie-logo.png"
    }
  ]

  ItemsOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['',''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      },
      1140: {
        items: 4
      }
    },
    nav: false
  }


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: false
  }

  PolicyOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-caret-left"></i>', '<i class="fa fa-caret-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      },
      1040: {
        items: 3
      }
    },
    nav: true
  }

  testimonial: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fa fa-caret-left"></i>', '<i class="fa fa-caret-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  BannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  days: any;
  hours: any;
  mins: any;
  secs: any;

  x = setInterval(()=>{
    var futureDate = new Date("May 08, 2024 08:05:02").getTime();
    var today = new Date().getTime();
    var distance = futureDate - today;
    this.days =Math.floor( distance / (1000 * 60 * 60 *24));
    this.hours =Math.floor(( distance % (1000 * 60 * 60 *24)) / (1000 * 60 * 60));
    this.mins =Math.floor(( distance % (1000 * 60 * 60)) / (1000 * 60));
    this.secs =Math.floor(( distance % (1000 * 60)) / (1000));
    if (distance < 0){
      clearInterval(this.x);
      this.days ="Chương trình khuyến mãi đã tạm dừng"
    };
  }, 1000)

  countDownTimer(){

  }

  addToCart(product: Item) {
    // Gọi hàm addToCart từ CartService để thêm sản phẩm vào giỏ hàng
    this.cartService.addToCart(product);
  }

  goToItemDetail(product: Item) {
    console.log(product);
    this.router.navigate(['/phone', product.id]);
  }
}
