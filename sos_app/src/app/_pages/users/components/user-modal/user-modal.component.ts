import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/_models/User';
import { ModalService } from 'src/app/_services/modal.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit {
  user!: User;

  userForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastService
    ) {
    
  }

  mountForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      corporate_name: ['', [Validators.required]],
      fantasy_name: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.mountForm();
    if (this.user) {
      console.log(this.user);
      this.patchForm();
    }
  }

  patchForm() {
    this.userForm.patchValue(this.user);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  submit() {
    console.log(this.userForm.value);
  }

  update() {
    this.userService.updateUser(this.userForm.value, this.user.id).subscribe({
      next: () => {
          this.closeModal();
          this.toastService.presentToast(
            'Usuário criado com sucesso!',
            'bottom',
            2000,
            'success'
          );
        },
        error: () => {
          this.toastService.presentToast(
            'Erro ao criar o usuário!',
            'bottom',
            2000,
            'danger'
          );
        },
    });
  }
}
