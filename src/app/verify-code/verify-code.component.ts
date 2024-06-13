import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent {
  digits: string[] = new Array(6).fill('');
  isError: boolean = false;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  verifyCode() {
    const code = this.digits.join('');
    console.log('Vérification du code:', code);
    this.apiService.Verification(code)
      .then((response: any) => {
        console.log('Code validé avec succès!', response);
      })
      .catch(error => {
        console.error('Échec de la validation du code.', error);
        this.isError = true;
        setTimeout(() => this.isError = false, 5000);
      });
  }

  onModelChange(value: any, index: number) {
    const trimmedValue = value.trim();
    if (trimmedValue && trimmedValue.match(/^[0-9]$/) && index < this.digits.length) {
      this.digits[index] = trimmedValue;

      if (index < this.digits.length - 1) {
        const nextInput = document.getElementById('input_' + (index + 1)) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        this.verifyCode();
      }
    } else {
      this.digits[index] = '';
    }

    console.log('État actuel des chiffres:', this.digits);
  }

  resendCode() {
    this.http.get('/api/resend-code').subscribe({
      next: (response) => console.log('Code renvoyé avec succès', response),
      error: (error) => console.error('Erreur lors de l\'envoi du code', error)
    });
  }
}