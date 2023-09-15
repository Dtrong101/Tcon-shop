import { Item } from './item';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from './user';
import { Users } from './users';
import { Promotion } from './promotion';

@Injectable({
    providedIn: 'root'
})

export class DataService {
    constructor(private afs: AngularFirestore) { }

    addItem(item: Item) {
        item.id = this.afs.createId();
        return this.afs.collection('/Items').add(item);
    }

    getAllItem() {
        return this.afs.collection('/Items').snapshotChanges();
    }

    deleteItem(item: Item) {
        return this.afs.doc('/Items/' + item.id).delete();
    }

    updateItem(item: Item) {
        return this.afs.doc('/Items/' + item.id).update(item);
    }

    /* Danh sách API user */
    getAllItemUser() {
        return this.afs.collection('/users').snapshotChanges();
    }

    updateItemUser(item: Users) {
        return this.afs.doc('/users/' + item.uid).update(item);
    }

    /* Danh sách API thông báo */
    getAllItemNotification() {
        return this.afs.collection('/notification').snapshotChanges();
    }

    /* Danh sách API mã khuyến mãi */
    getAllItemPromotion() {
        return this.afs.collection('/promotion').snapshotChanges();
    }

    addItemPromotion(item: Promotion) {
        item.id = this.afs.createId();
        return this.afs.collection('/promotion').add(item);
    }

    deleteItemPromotion(item: Promotion) {
        return this.afs.doc('/promotion/' + item.id).delete();
    }

    updateItemPromotion(item: Promotion) {
        return this.afs.doc('/promotion/' + item.id).update(item);
    }

}