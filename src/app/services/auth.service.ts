import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly urlBase: string = environment.api;
  private readonly controllerToken: string = "tokenize";
  public token: string;  

  constructor(private router: Router, private httpCliente: HttpClient) { }

  public login(email: string, password: string): Observable<any>{
    return this.httpCliente.post<Observable<any>>(`${this.urlBase}${this.controllerToken}/user`, {
      document: email,
      password: password
    });
  }

  public userDatail(id: string): Observable<any>{
    return this.httpCliente.get<Observable<any>>(`${this.urlBase}users/${id}`);
  }

  public logout(): void {
    sessionStorage.removeItem("AUTH_TOKE");
    this.router.navigate(["/auth/login"]);
  }
}
