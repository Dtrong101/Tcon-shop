import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../sharepage/services/item';
import { CartService } from 'src/app/sharepage/services/cart.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(private afs: AngularFirestore, private cartService: CartService, private router: Router) {
    this.itemsCollection = this.afs.collection<Item>('Items');
    this.items = this.itemsCollection.valueChanges();
   }

  ngOnInit(): void {
    this.sortByName();
  }

  addToCart(product: Item) {
    // Gọi hàm addToCart từ CartService để thêm sản phẩm vào giỏ hàng
    this.cartService.addToCart(product);
  }

   // Hàm để sắp xếp sản phẩm theo tên theo bảng chữ cái
   sortByName() {
    this.items = this.items.pipe(
      map(items => items.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  // Hàm để sắp xếp sản phẩm theo giá tiền tăng dần
  sortByPriceAscending() {
    this.items = this.items.pipe(
      map(items => items.sort((a, b) => a.price - b.price))
    );
  }

  // Hàm để sắp xếp sản phẩm theo giá tiền giảm dần
  sortByPriceDescending() {
    this.items = this.items.pipe(
      map(items => items.sort((a, b) => b.price - a.price))
    );
  }

  goToItemDetail(product: Item) {
    this.router.navigate(['/phone', product.id]);
  }
}
