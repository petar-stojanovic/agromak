import {Injectable} from '@angular/core';
import {collection, collectionData, doc, Firestore, getDoc, query, setDoc, where} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: Firestore) {
  }


  docRef(path: string) {
    return doc(this.firestore, path);
  }

  collectionRef(path: string) {
    return collection(this.firestore, path);
  }

  setDocument(path: string, data: any) {
    const dataRef = this.docRef(path);
    return setDoc(dataRef, data);
  }

  getDocById(path: string) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  collectionDataQuery(path: string, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      dataRef = query(dataRef, queryFn);
    }
    return collectionData<any>(dataRef);
  }

  whereQuery(fieldPath: string, condition: WhereFilterOp, value: any) {
    return where(fieldPath, condition, value);
  }
}
