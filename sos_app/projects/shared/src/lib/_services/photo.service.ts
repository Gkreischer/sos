import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Camera, CameraDirection, MediaResult } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LocalFileInterface } from 'shared';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'shared';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  localFile = new BehaviorSubject<LocalFileInterface | null>(null);

  http = inject(HttpClient);
  error = inject(ErrorService);

  constructor() {}

  get file() {
    return this.localFile.asObservable();
  }

  public async selectImage() {
    // Take a photo
    const selectedImage = await Camera.takePhoto({
      quality: 90,
      editable: 'in-app', // replaces allowEditing: true
      cameraDirection: CameraDirection.Rear, // replaces direction
      targetWidth: 1280, // replaces width (1)
      targetHeight: 720, // replaces height (1)
    });

    if (!selectedImage) {
      new Error('Imagem não foi selecionada');
      return;
    }

    return this.savePicture(selectedImage);
  }

  private async savePicture(photo: MediaResult) {
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
    } as LocalFileInterface);
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
      file: savedFile,
    };
  }

  private async readAsBase64(photo: MediaResult) {
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

          this.http
            .post<{ imagePath: string; message: string }>(
              `${environment.baseUrl}/photos`,
              formData,
            )
            .pipe(
              tap((response) => {
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

  async takePicture() {
    try {
      const result = (await Camera.takePhoto({
        quality: 100,
        includeMetadata: true,
        targetWidth: 1280,
        targetHeight: 720,
      })) satisfies MediaResult;

      if (!result) {
        return false;
      }

      return {
        webPath: result.webPath,
        format: result.metadata?.format,
        resolution: result.metadata?.resolution,
      };
    } catch (e) {
      const error = e as any;
      // error.code contains the structured error code (e.g. 'OS-PLUG-CAMR-0003')
      // when thrown by the native layer. See the Errors section for all codes.
      const message = error.code
        ? `[${error.code}] ${error.message}`
        : error.message;
      console.error(message);
      return;
    }
  }
}
