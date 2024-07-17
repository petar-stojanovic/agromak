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
import {Category} from "../../shared/models/category";
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

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<any>();

  categories!: Category[];

  constructor(private _categoryService: CategoryService,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController) {
    this._categoryService.categories$.subscribe(async categories => {
      this.categories = categories;
      this.ref.markForCheck();
    });
  }

  async cancelChanges() {
    await this.modalCtrl.dismiss();
    this.selectionCancel.emit();
  }
}
