import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  checkLogin(username: string, password: string){
    const userData = {
      username: 'user@abc.com',
      pass: 'password'
    };

    if (userData.username === username && userData.pass === password){
      return true;
    }
    else {
      return false;
    }
  }
}
