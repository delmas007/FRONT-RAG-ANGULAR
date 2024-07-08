import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ApiService} from "../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";

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
export class VerifyCodeComponent implements OnInit {
  digits: string[] = new Array(6).fill('');
  isError: boolean = false;
  resendDisabled: boolean = false;
  countdownTimer: number = 3; // Temps en secondes
  email!: string ;
  code: string[] = ['', '', '', '', '', ''];

  constructor(private apiService: ApiService, private http: HttpClient,private router: Router,private activatedRoute : ActivatedRoute) {}

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.resendDisabled = true; // Désactive le lien de renvoi
    const interval = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        clearInterval(interval);
        this.resendDisabled = false; // Active à nouveau le lien de renvoi
        this.countdownTimer = 30; // Réinitialise le compte à rebours
      }
    }, 1000); // 1000 ms = 1 seconde
  }

  // verifyCode() {
  //   const code = this.code.join('');
  //   this.apiService.Verification(code)
  //     .then((response: any) => {
  //       this.router.navigateByUrl("/connexion")
  //     })
  //     .catch(error => {
  //       this.isError = true;
  //       setTimeout(() => {
  //         this.isError = false;
  //         // Ajouter la classe shake aux champs d'entrée
  //         const inputs = document.querySelectorAll('.code-inputs input');
  //         inputs.forEach(input => input.classList.add('shake'));
  //         // Retirer la classe shake après l'animation
  //         setTimeout(() => {
  //           inputs.forEach(input => input.classList.remove('shake'));
  //         }, 400);
  //       }, 7000);
  //     });
  // }
  verifyCode() {
    const code = this.code.join('');
    this.apiService.Verification(code)
      .then((response: any) => {
        this.router.navigateByUrl("/connexion");
      })
      .catch(error => {
        this.isError = true;
        const inputs = document.querySelectorAll('.code-inputs input');
        inputs.forEach(input => input.classList.add('shake'));

        setTimeout(() => {
          this.isError = false;
          inputs.forEach(input => input.classList.remove('shake'));
        }, 400);
      });
  }

  resendCode() {
    this.countdownTimer = 30;
    this.startCountdown();
    this.email = this.activatedRoute.snapshot.params['email']

    // Appel à votre service HTTP pour renvoyer le code
    this.apiService.resendMail(this.email).then((response: any) => {
      console.log('Code renvoyé avec succès', response)
    })
      .catch(error => {
        console.log('Erreur lors de l\'envoi du code', error)
      });
  }

  onResendClick(event: Event) {
    event.preventDefault();
    this.resendCode();
  }


  onModelChange(event: any, index: number) {
    if (event && event.target && typeof event.target.value === 'string') {
      const value = event.target.value.trim();
      if (value.match(/^[0-9]$/) && index < this.digits.length) {
        this.digits[index] = value;

        if (index < this.digits.length - 1) {
          const nextInput = event.target.nextElementSibling as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        } else {
          this.verifyCode();
        }
      } else {
        this.digits[index] = '';
      }

      console.log('État actuel des chiffres :', this.digits);
    }
  }

  moveFocus(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!/^\d$/.test(input.value)) {
      input.value = '';
      return;
    }
    if (input.value.length > 0 && index < this.code.length - 1) {
      const nextInput = document.querySelectorAll('.code-inputs input')[index + 1] as HTMLInputElement;
      nextInput.focus();
    } else {
      this.verifyCode();
    }
  }




}
