import { Injectable } from '@angular/core';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public authState : any = {
    isAuthenticated : false,
    username : undefined,
    role : undefined,
    name : undefined,
    prenom : undefined,
    email : undefined,
  }

  constructor() {
    this.loadToken();
  }

  loadToken() {
    const token = localStorage!.getItem('token');
    if (token) {
      const decodedJwt: any = jwtDecode(token);
      this.authState={
        isAuthenticated: true,
        username: decodedJwt.sub,
        name: decodedJwt.name,
        prenom: decodedJwt.prenom,
        role: decodedJwt.scope,
        token: token
      };
    }
  }
  public setAuthState(state : any){
    this.authState = {...this.authState, ...state};
  }
}