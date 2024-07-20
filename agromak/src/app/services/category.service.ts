import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, combineLatest, map, Observable, switchMap} from "rxjs";
import {Category, SubCategory} from "../shared/models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.categories.asObservable();

  constructor(private angularFirestore: AngularFirestore,
              private http: HttpClient) {
    this.loadCategories();
  }


  loadCategories() {
    this.angularFirestore.collection<Category>('categories').snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          return a.payload.doc.data() as Category;
        })),
        switchMap(categories => {
          const categoryObservables = categories.map(category => {
            return this.getSubcategories(category.name).pipe(
              map(subcategories => {
                return {
                  ...category,
                  sub_categories: subcategories
                };
              })
            );
          });
          return combineLatest(categoryObservables);
        })
      ).subscribe(categories => {
      console.log(categories)
      this.categories.next(categories);
    });
  }

  private getSubcategories(parentCategory: string): Observable<SubCategory[]> {
    return this.angularFirestore.collection(`categories/${parentCategory}/sub_categories`).snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          return a.payload.doc.data() as SubCategory;
        }))
      );
  }


  saveAllCategories() {
    this.http.get<Category[]>('/assets/categories.json')
      .subscribe(async it => {
        console.log(it)
        await this.addCategories(it);
      })
  }


  private async addCategories(categories: Category[]): Promise<void> {
    for (const category of categories) {
      console.log(category)
      const categoryRef = this.angularFirestore.collection('categories').doc(category.name);
      const categoryData = {
        name: category.name,
        order: category.order,
      };
      await categoryRef.set(categoryData);

      if (category.sub_categories && category.sub_categories.length > 0) {
        await this.addSubcategories(categoryRef.collection('sub_categories'), category.sub_categories, category.name);
      }
    }
  }

  private async addSubcategories(subcategoriesRef: any, subcategories: SubCategory[], parentCategory: string): Promise<void> {
    for (const subcategory of subcategories) {
      const subcategoryData: SubCategory = {
        name: subcategory.name,
        order: subcategory.order,
      };

      const subcategoryRef = subcategoriesRef.doc(subcategory.name);
      await subcategoryRef.set(subcategoryData);


      if (subcategory.sub_categories && subcategory.sub_categories.length > 0) {
        await this.addSubcategories(subcategoryRef.collection('sub_categories'), subcategory.sub_categories, subcategory.name);
      }
    }
  }

}
