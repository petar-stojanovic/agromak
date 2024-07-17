import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar, ModalController
} from "@ionic/angular/standalone";
import {Category, SubCategory} from "../../shared/models/category";
import {CategoryService} from "../../services/category.service";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-select-category-modal',
  templateUrl: './select-category-modal.component.html',
  styleUrls: ['./select-category-modal.component.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonAccordionGroup,
    IonAccordion,
    IonLabel,
    AsyncPipe,
    NgForOf,
    NgIf,
    JsonPipe,
    IonSpinner
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCategoryModalComponent  {

  categories!: Category[];

  constructor(private _categoryService: CategoryService,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController) {
    this._categoryService.categories$.subscribe(async categories => {
      this.categories = categories;
      this.ref.markForCheck();
    });
  }

  accordionGroupChange = (ev: any) => {
    const selectedValue = ev.detail.value;

    console.log(selectedValue)
    console.log(
      `Expanded: ${selectedValue === undefined ? 'None' : ev.detail.value}`
    );
  };

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async selectCategory(subcategory: SubCategory) {
    await this.modalCtrl.dismiss(subcategory.name);
  }
}
