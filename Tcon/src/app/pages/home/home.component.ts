import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Item } from 'src/app/sharepage/services/item';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/sharepage/services/cart.service';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private afs: AngularFirestore, private cartService: CartService, private router: Router) {
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
        items: 2
      },
      740: {
        items: 3
      },
      940: {
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
        items: 3
      },
      940: {
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
    this.router.navigate(['/phone', product.id]);
  }
}
