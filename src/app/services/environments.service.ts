import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnvironmentsFilter } from '../models/environments/environments.filter';
import { EnvironmentsResponse } from '../models/environments/environments.response';
import { EnvironmentsDashboardDataModel } from '../models/environments/environments-dashboard-data.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentsService {
  private api: string;

  constructor(public httpClient: HttpClient) {
    this.api = environment.api + 'environments';
    //this.api = 'http://localhost:8000/environments';
  }

  public getEnvironments(request: EnvironmentsFilter): Observable<EnvironmentsResponse> {
    //console.log('getEnvironments', request);
    
    return this.httpClient.post<EnvironmentsResponse>(this.api + "/env/paginate", request);
  }

  public getDashboardData(): Observable<EnvironmentsDashboardDataModel> {
    return this.httpClient.get<EnvironmentsDashboardDataModel>(this.api + '/env/dashboard');
  }
}
