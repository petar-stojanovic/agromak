import {Component, OnInit} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup, IonContent, IonIcon,
  IonItem,
  IonLabel, IonList, IonModal,
  IonSelect,
  IonSelectOption
} from "@ionic/angular/standalone";
import {CategoryService} from "../../services/category.service";
import {Observable} from "rxjs";
import {Category} from "../../shared/models/category";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {caretDownOutline} from "ionicons/icons";

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss'],
  standalone: true,
  imports: [
    IonSelect,
    IonSelectOption,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    NgIf,
    AsyncPipe,
    NgForOf,
    IonList,
    IonContent,
    IonModal,
    IonIcon
  ]
})
export class SelectCategoryComponent {

  categories$: Observable<Category[]>;

  constructor(private _categoryService: CategoryService) {
    this.categories$ = this._categoryService.categories$;

    addIcons({caretDownOutline})

  }

}
