import {Component, Input, OnInit} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
  imports: [
    IonicModule,
    RouterLink
  ],
  standalone: true
})
export class AdListComponent implements OnInit {
  @Input()
  ads: Ad[] = [];

  @Input()
  isLoading = true;

  placeholderArray = new Array(6);

  constructor() {
  }

  ngOnInit() {
  }

}
