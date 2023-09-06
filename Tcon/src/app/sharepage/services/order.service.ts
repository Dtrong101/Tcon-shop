import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { catchError } from 'rxjs/operators';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private afs: AngularFirestore) {
    this.ordersCollection = this.afs.collection('/orders');
  }
  private ordersCollection: AngularFirestoreCollection<any>;


  // Phương thức để lấy tất cả đơn hàng và sắp xếp theo ngày tạo
  getAllOrdersSortedByDate() {
    return this.afs.collection('/orders', ref => ref.orderBy('orderTime', 'desc')).snapshotChanges();
  }

  getAllOrders(): Observable<any[]> {
    return this.ordersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getOrderById(orderId: string) {
    return this.afs.collection('orders').doc(orderId).valueChanges();
  }
  
  
}
