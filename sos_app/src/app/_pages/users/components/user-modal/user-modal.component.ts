import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { User } from 'src/app/_models/User';
import { UserType } from 'src/app/_models/UserType';
import { AlertService } from 'src/app/_services/alert.service';
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

  phoneOptions: MaskitoOptions = {
    mask: ({value}) => {
        
      const inputValue = value?.replace(/\D/g, '');

      if (inputValue.length <= 10) {
        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      } else {  
        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      }      
      
    },
} as MaskitoOptions;

readonly maskPredicate: MaskitoElementPredicate = async (el) =>
  (el as HTMLIonInputElement).getInputElement();



  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private alertService: AlertService
    ) {
    
  }

  mountForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: [''],
      cpf: [''],
      corporate_name: [''],
      fantasy_name: [''],
      cnpj: [''],
      cep: [''],
      city: [''],
      state: [''],
      type: ['', [Validators.required]],
      country: ['']
    });
  }

  ngOnInit() {
    this.mountForm();
    if (this.user) {

      this.patchForm();
    }
  }

  patchForm() {
    const user = this.user;
    user.type = this.convertTypeUserToString();
    this.userForm.patchValue(this.user);
  }

  convertTypeUserToString() {
    return this.user.type.toString() as unknown as UserType;
  }


  closeModal() {
    this.modalService.closeModal();
  }

  submit() {
    this.userService.addUser(this.userForm.value).subscribe((user) => {
      this.closeModal();
      this.toastService.presentToast(
        'Usuário criado com sucesso!',
        'bottom',
        2000,
        'success'
      );
    })
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

  async confirmDeleteUser() {
    console.log('deletando');
    await this.alertService.presentAlert(
      'Atenção',
      '',
      'Tem certeza que deseja excluir este usuário?',
      [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.deleteUser(this.user);
          },
        },
      ]
    );
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe({
      next: (user) => {
        this.closeModal();
        console.log(user)
        this.toastService.presentToast(
          'Usuário deletado com sucesso!',
          'bottom',
          2000,
          'success'
        );
      },
      error: (err) => {
        this.toastService.presentToast(err, 'bottom', 2000, 'danger');
      },
    });
  }
}
