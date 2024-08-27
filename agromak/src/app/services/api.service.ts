import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";
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

  addDocument(path: string, data: any) {
    const dataRef = this.collectionRef(path);
    return addDoc(dataRef, data);
  }

  getDocById(path: string) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  getDocs(path: string, queryFns: any[] = []) {
    let dataRef: any = this.collectionRef(path);
    if (queryFns.length > 0) {
      dataRef = query(dataRef, ...queryFns);
    }
    return getDocs(dataRef);
  }

  collectionDataQuery(path: string, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      dataRef = query(dataRef, queryFn);
    }
    return collectionData<any>(dataRef);
  }

  docDataQuery(path: string, shouldHaveId?: boolean, queryFn?: any) {
    let dataRef: any = this.docRef(path);
    if (queryFn) {
      dataRef = query(dataRef, queryFn);
    }
    if (shouldHaveId) {
      return docData(dataRef, {idField: 'id'});
    }
    return docData<any>(dataRef);
  }

  whereQuery(fieldPath: string, condition: WhereFilterOp, value: any) {
    return where(fieldPath, condition, value);
  }
}