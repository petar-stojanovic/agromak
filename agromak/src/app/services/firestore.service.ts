import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore,
              private http: HttpClient) {
  }

  // create a job that will save all categories and subcategories to angular firestore
  saveAllCategories() {
    return this.http.get('/assets/categories.json');
  }
}
