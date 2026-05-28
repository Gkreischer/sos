import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError } from 'rxjs';

// Criamos uma interface para tipar o formato exato que o Laravel envia
export interface LaravelValidationError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  public handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro inesperado.';
    let validationErrors: { [key: string]: string[] } | null = null;

    switch (error.status) {
      case 0:
        // Erro de rede ou client-side
        console.error('An error occurred:', error.error);
        errorMessage =
          'Não foi possível conectar ao servidor. Verifique sua internet.';
        break;
      case 400:
        // Erro de validação
        console.error('An error occurred:', error.error);
        errorMessage = 'Ocorreu um erro de validação.';
        validationErrors = error.error.errors;
        break;
      case 401:
        // Usuário não autenticado
        break;
      default:
        // O backend retornou um código de erro (400, 404, 500, etc)
        console.error(
          `Backend returned code ${error.status}, body was: `,
          error.error,
        );

        // Verificamos se o erro que veio do Laravel possui a estrutura esperada
        const backendError = error.error as LaravelValidationError;

        if (backendError && backendError.message) {
          errorMessage = backendError.message;
        }

        if (backendError && backendError.errors) {
          validationErrors = backendError.errors;
        }
    }

    // Retornamos um objeto de erro customizado contendo a mensagem geral e os erros detalhados
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: validationErrors, // Aqui estão os erros de validação (ex: price, quantity...)
    }));
  }
}
