import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory, WriteFileResult } from '@capacitor/filesystem';
import { LocalFile } from 'src/app/_models/LocalFile';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  localFile = new BehaviorSubject<LocalFile | null>(null);

  http = inject(HttpClient);
  error = inject(ErrorService);

  constructor() {}

  get file() {
    return this.localFile.asObservable();
  }

  public async selectImage() {
    // Take a photo
    const selectedImage = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Prompt, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
      promptLabelCancel: 'Cancelar',
      promptLabelPhoto: 'Selecionar foto',
      promptLabelPicture: 'Tirar foto',
      promptLabelHeader: 'Selecione uma opção',
    });

    if (!selectedImage) {
      new Error('Imagem não foi selecionada');
      return;
    }

    return this.savePicture(selectedImage);
  }

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    this.localFile.next({
      name: fileName,
      path: savedFile.uri,
      data: `data:image/jpeg;base64,${base64Data}`,
    } as LocalFile);
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
      file: savedFile,
    };
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  public async startUpload(): Promise<{
    imagePath: string;
    message: string;
  } | null> {
    return new Promise((resolve, reject) => {
      this.file.subscribe(async (file) => {
        if (!file) {
          reject('Nenhum arquivo selecionado');
          return;
        }

        try {
          // Lê o arquivo salvo no diretório
          const fileData = await Filesystem.readFile({
            path: file.name,
            directory: Directory.Data,
          });

          // Converte de base64 para um blob
          const byteCharacters = atob(fileData.data as string);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          // Cria o FormData e envia a requisição
          const formData = new FormData();
          formData.append('image', blob, file.name);

          console.log('Enviando FormData:', formData);

          this.http
            .post<{ imagePath: string; message: string }>(
              `${environment.baseUrl}/photos`,
              formData,
            )
            .pipe(
              tap((response) => {
                console.log('Upload realizado:', response);
                resolve(response); // Retorna o objeto para o método que chamou
              }),
              catchError((error) => {
                console.error('Erro no upload:', error);
                reject(error);
                return [];
              }),
            )
            .subscribe();
        } catch (error) {
          console.error('Erro ao ler o arquivo:', error);
          reject(error);
        }
      });
    });
  }
}
