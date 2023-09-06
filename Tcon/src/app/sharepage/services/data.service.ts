import { Item } from './item';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})

export class DataService{
    constructor(private afs: AngularFirestore){}

    addItem(item: Item){
        item.id = this.afs.createId();
        return this.afs.collection('/Items').add(item);
    }

    getAllItem(){
        return this.afs.collection('/Items').snapshotChanges();
    }

    deleteItem(item: Item){
        return this.afs.doc('/Items/' + item.id).delete();
    }

    updateItem(item: Item){
        return this.afs.doc('/Items/' + item.id).update(item);
    }
}