import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  standalone: true,
})
export class ImageUploadComponent  implements OnInit {
  @Input() form!: FormGroup;

  constructor() { }

  ngOnInit() {}

}
