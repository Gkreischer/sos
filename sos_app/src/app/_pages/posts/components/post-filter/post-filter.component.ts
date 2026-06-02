import { Component, OnInit, inject } from '@angular/core';
import {
  IonCard,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/_services/post.service';

@Component({
  selector: 'app-post-filter',
  templateUrl: './post-filter.component.html',
  styleUrls: ['./post-filter.component.scss'],
  imports: [
    IonInput,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonButton,
    IonCard,
    ReactiveFormsModule,
  ],
})
export class PostFilterComponent implements OnInit {
  postService = inject(PostService);
  formBuilder = inject(FormBuilder);

  filterForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.mountForm();
  }

  mountForm() {
    this.filterForm = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
  }

  searchPost() {
    this.postService.setPostFilter(this.filterForm.value);
  }
}
