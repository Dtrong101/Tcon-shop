import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../services/user';
import { Item } from '../services/item';
import { DataService } from '../services/data.service';
import { Renderer2, ElementRef } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user$: Observable<firebase.default.User | null>;
  isAdmin = false;
  cartItemCount: number = 0;
  id: any;
  private itemsCollection!: AngularFirestoreCollection<Item>;
  searchResults: Item[] = [];
  notificationCount: number = 0;

  private cartItemCountSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private data: DataService,
    private renderer: Renderer2, 
    private elementRef: ElementRef
  ) {
    this.cartItemCountSubscription = this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
    this.user$ = this.afAuth.authState;
    this.itemsCollection = this.afs.collection<Item>('Items');
  }

  isAdminUser: boolean = false;
  ngOnInit() {
    this.user$.subscribe(async (user) => {
      if (user) {
        const userRef = this.afs.doc(`users/${user.uid}`);
        const userSnapshot = await userRef.get().toPromise();
        const userData = userSnapshot?.data() as User;
        this.isAdminUser = userData?.role === 'admin' ? true : false;
      } else {
        this.isAdminUser = false;
      }
      console.log(this.isAdminUser);
    });
    this.itemsCollection = this.afs.collection<Item>('Items');

    this.data.getAllItemNotification().subscribe(
      (res) => {
        this.notificationCount = res.length
      },
      (err) => {
        alert('Lỗi khi xử lý dữ liệu sản phẩm');
      }
    );
  }

  drop(param: any) {
    if (this.id == param) {
      this.id = '';
    } else {
      this.id = param;
    }
  }

  logout() {
    this.authService.SignOut();
  }

  searchQuery: string = '';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim().toLowerCase(); // Chuyển query thành chữ thường

    if (query !== '') {
      // Perform the search using Firestore query
      this.itemsCollection.ref
        .get()
        .then((querySnapshot) => {
          // Clear the previous search results
          this.searchResults = [];

          // Iterate through the query results and add matching items to the searchResults array
          querySnapshot.forEach((doc) => {
            const item = doc.data() as Item;
            if (item.color === 'Đen' && item.name.toLowerCase().includes(query)) {
              this.searchResults.push(item);
            }
          });
        })
        .catch((error) => {
          console.error('Error searching items:', error);
        });
    } else {
      // Clear the search results if the search query is empty
      this.searchResults = [];
    }
  }




  
  toggleActiveClass() {
    const overlayElement = this.elementRef.nativeElement.querySelector('.offcanvas-menu-overlay');
    const overlayElementTwo = this.elementRef.nativeElement.querySelector('.offcanvas-menu-wrapper');

    if (overlayElement && overlayElementTwo) {
      this.renderer.addClass(overlayElement, 'active');
      this.renderer.addClass(overlayElementTwo, 'active');
    }
   
  }
  RemoveClass() {
    const overlayElement = this.elementRef.nativeElement.querySelector('.offcanvas-menu-overlay');
    const overlayElementTwo = this.elementRef.nativeElement.querySelector('.offcanvas-menu-wrapper');
    if (overlayElement && overlayElementTwo) {
      this.renderer.removeClass(overlayElement, 'active');
      this.renderer.removeClass(overlayElementTwo, 'active');
    }
   
  }
}


