import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private api: string;
    private token: string;

    constructor(public httpClient: HttpClient) {
      this.api = environment.api + 'logs';
      this.token = sessionStorage.getItem("AUTH_TOKE");
    }

    public getAccessLogs(request: any): any {
      const headers = {
        Authorization: `Bearer ${this.token}`
      };
      return this.httpClient.post<any>(this.api + '/access', request, { headers });
    }
}