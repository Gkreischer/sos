import { Component, inject, OnInit } from '@angular/core';
import { PostService } from 'src/app/_services/post.service';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonTextarea,
  IonButton,
  IonChip,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonContent,
  IonText,
  IonCard,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { ModalService } from 'src/app/_services/modal.service';
import { PostInterface } from 'src/app/_interfaces/PostInterface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { UserInterface } from 'src/app/_interfaces/UserInterface';
@Component({
  selector: 'app-post-modal-add-edit',
  standalone: true,
  templateUrl: './post-modal-add-edit.component.html',
  styleUrl: './post-modal-add-edit.component.css',
  imports: [
    IonCardContent,
    IonCard,
    IonContent,
    IonIcon,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonTextarea,
    IonButton,
    AsyncPipe,
  ],
})
export class PostModalAddEditComponent implements OnInit {
  postService = inject(PostService);
  modalService = inject(ModalService);
  formBuilder = inject(FormBuilder);
  loadingService = inject(LoadingService);

  post$: Observable<PostInterface | null> = this.postService.post$;
  postId: number | null = null;

  isLoading$: Observable<boolean> = this.loadingService.isLoading$;

  formPost!: FormGroup;

  ngOnInit() {
    this.mountForm();
    if (this.postId) {
      this.getPostById(this.postId);
    }
  }

  getPostById(id: number) {
    this.postService
      .getPost(id)
      .subscribe((res) => this.formPost.patchValue(res));
  }

  mountForm() {
    this.formPost = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  closeModal() {
    this.modalService.closeModal();
  }

  update() {
    this.postService
      .updatePost(this.postId!, this.formPost.value)
      .subscribe((res) => {
        this.closeModal();
      });
  }

  submit() {
    this.postService.createPost(this.formPost.value).subscribe((res) => {
      this.closeModal();
    });
  }
}
