import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {ApiService} from "../service/api.service";
import {RagComponent} from "../rag/rag.component";
import {Utilisateur} from "../Model/utilisateur";
import {StateService} from "../service/state.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgStyle
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  question: string = '';
  response: string = '';
  showResponse: boolean = false;
  message: boolean = false;
  loader: boolean = false;
  copySuccess: boolean = false;

  constructor(public apiService: ApiService,private state: StateService) {

  }
  @ViewChild('responseTextarea') responseTextarea!: ElementRef;

  isButtonEnabled(): boolean {
    return this.question.trim().length > 0 && !this.message;
  }
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.response)
      .then(() => {
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
  }

  submitQuestion(): void {
    this.envoyerQuestion(this.question);

  }

  adjustTextarea(textarea: HTMLTextAreaElement | Event): void {
    const textElement: HTMLTextAreaElement = (textarea instanceof Event) ? (<HTMLTextAreaElement>textarea.target) : textarea;
    textElement.style.height = 'auto'; // Réinitialiser la hauteur
    textElement.style.height = `${textElement.scrollHeight}px`; // Ajuster la hauteur à celle du contenu
  }
  envoyerQuestion(question: string) {
    // id :this.state.authState.id
    let  user :Utilisateur = {id :this.state.authState.id,username:'',password:'',nom:'',prenom:'',email:''}
    this.message = true;
    this.loader = true;
    this.apiService.question(question,user)
      .then(reponse => {
        this.response = reponse.result;
        this.showResponse = true;
        setTimeout(() => {
          this.adjustTextarea(this.responseTextarea.nativeElement);
        }, 0);
        this.message = false;
        this.loader = false;
      })
      .catch(err => {
        if (err.status === 429) {
          this.response = "Limite de requêtes dépassée. Veuillez réessayer plus tard.";
        } else if (err.status === 500) {
          this.response = "Erreur temporaire du serveur. Veuillez réessayer plus tard.";
        } else {
          console.error(err);
          this.response = "Une erreur s'est produite. Veuillez réessayer plus tard.";
        }
        this.message = false;
        this.loader = false;
      });
  }

  ngOnInit(): void {

  }

}
