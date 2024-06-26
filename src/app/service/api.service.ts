import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {Utilisateur} from "../Model/utilisateur";
import {jwtDecode} from "jwt-decode";
import {StateService} from "./state.service";
import {Utilisateur2} from "../Model/utilisateur2";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  Affquestion: boolean = false;

  private host = 'http://localhost:7788';

  constructor(private http: HttpClient) {}
   id = 'dda5dec1-39f5-4344-a962-dc2e7a63e546'
  // envoyerFichiers(formData: FormData,extension:String,user:Utilisateur): Observable<any> {
  //   return this.http.post<any>(`${this.host}/fichier/${extension}/${user}`,formData);
  // }
  envoyerFichiers(formData: FormData,extension:String, user: Utilisateur): Observable<any> {
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    return this.http.post<any>(`${this.host}/fichier/${extension}`, formData);
  }


  // async question(question: String){
  //   return await firstValueFrom(this.http.get<any>(`${this.host}/rag/?query=${question}`));
  // }

  // async question(question: String) {
  //   return await firstValueFrom(
  //     this.http.get<string>(`${this.host}/rag/?query=${question}`, {
  //       responseType: 'json', // Corrigez ici
  //     })
  //   );
  // }
  async question(question: string, user: Utilisateur) {
    return await firstValueFrom(
      this.http.post<any>(`${this.host}/rag/?query=${encodeURIComponent(question)}`,user, {
        responseType: 'json',
      })
    );
  }

  async resendMail(email: string):Promise<any> {
    return await firstValueFrom (
      this.http.post<any>(`${this.host}/resendMail/`,email)
    );
  }

  async Verification(code: string): Promise<any> {
    const body = { code: code };

    return await firstValueFrom(
      this.http.post<any>(`${this.host}/activation/`, body)
    );
  }

  async Login(username: string, password: string): Promise<any> {
    const body = { username: username, password: password };

    return await firstValueFrom(
      this.http.post<any>(`${this.host}/connexion`, body)
    );
  }

  async registration(donnee : Utilisateur2): Promise<any> {
    return await firstValueFrom(
      this.http.post<Utilisateur>(`${this.host}/inscription/`, donnee)
    );
  }

}
