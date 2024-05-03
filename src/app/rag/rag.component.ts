import { Component } from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ApiService} from "../service/api.service";

interface FileDetail {
  name: string;
  sizeMB: number;
  originalFile: File;
}

@Component({
  selector: 'app-rag',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DecimalPipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './rag.component.html',
  styleUrl: './rag.component.css'
})
export class RagComponent {
  files: File[] = [];
  invalidFiles: File[] = [];
  inputLabel = 'Choisir des fichiers';
  actions : Array<any> = [
    { nom : 'pdf' , type : '.pdf' , icon :'bi bi-file-pdf-fill',nav : 'nav-link'},
    { nom : 'powerpoint' , type : '.pptx' , icon :'bi bi-file-earmark-slides-fill',nav : 'nav-link'},
    { nom : 'excel' , type : '.xlsx' , icon :'bi bi-file-earmark-spreadsheet-fill',nav : 'nav-link'},
    { nom : 'word' , type : '.docx' , icon :'bi bi-file-earmark-word-fill',nav : 'nav-link'}
  ]
  constructor(private apiService: ApiService) {

  }

  currentAction : any='';




  setCurrentAction (action : any){
    this.currentAction=action;
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const newFiles = Array.from(input.files);

      // Obtenir l'extension autorisée à partir de l'action actuelle
      const allowedExtensions = [this.currentAction.type.toLowerCase()];

      // Filtrer les fichiers non autorisés
      this.invalidFiles = newFiles.filter(
        (file) => !allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
      );

      if (this.invalidFiles.length > 0) {
        // Affiche le message d'erreur pour les fichiers invalides
        console.log('Les fichiers non autorisés:', this.invalidFiles);
      }

      // Garder seulement les fichiers autorisés
      const validFiles = newFiles.filter(
        (file) => allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
      );

      // Ajout des fichiers valides à la liste des fichiers
      this.files = [...this.files, ...validFiles];
      this.inputLabel = 'Fichiers ajoutés';
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    if (this.files.length === 0) {
      this.inputLabel = 'Choisir des fichiers';
    }
  }

  fileSizeInMb(size: number): string {
    return (size / 1_000_000).toFixed(2);
  }

  getIconClass(fileName: string): string {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return 'bi bi-file-pdf-fill';
    } else if (fileName.toLowerCase().endsWith('.pptx')) {
      return 'bi bi-file-earmark-slides-fill';
    } else if (fileName.toLowerCase().endsWith('.xlsx')) {
      return 'bi bi-file-earmark-spreadsheet-fill';
    } else if (fileName.toLowerCase().endsWith('.docx')) {
      return 'bi bi-file-earmark-word-fill';
    }
    return 'bi bi-file-earmark';
  }
  envoyerFichiers() {
    if (this.files && this.files.length > 0) {
      const formData = new FormData();
      this.files.forEach((file, index) => {
        // Assurez-vous d'ajouter chaque fichier sous un nom d'entrée unique si nécessaire
        formData.append('files[]', file); // Utilisez 'files[]' pour indiquer un tableau de fichiers
        console.log('Fichier ajouté:', file.name);
        console.log('formData', formData);
      });
    }


    // this.apiService.envoyerFichiersWord(formData).subscribe({
      //   next: (response) => {
      //     console.log('Réponse:', response);
      //   },
      //   error: (error) => {
      //     console.error('Erreur:', error); // Gérer les erreurs
      //   },
      // });

  }

}
