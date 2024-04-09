import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private api: string;

    constructor(public httpClient: HttpClient) {
      this.api = environment.api + 'logs';
    }

    public getAccessLogs(request: any): any {
      return this.httpClient.post<any>(this.api + '/access', request);
    }
}