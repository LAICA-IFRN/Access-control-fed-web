import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnvironmentsFilter } from '../models/environments/environments.filter';
import { EnvironmentsResponse } from '../models/environments/environments.response';
import { EnvironmentResponse } from '../models/environments/environment.response';
import { EnvironmentsDashboardDataModel } from '../models/environments/environments-dashboard-data.model';
import { EvironmentModel } from 'src/app/models/environments/environment.model';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentsService {
  private api: string;
  private token: string;

  constructor(public httpClient: HttpClient) {
    this.api = environment.api + 'environments';
    this.token = sessionStorage.getItem("AUTH_TOKE");
  }

  public getEnvironments(request: EnvironmentsFilter): Observable<EnvironmentsResponse> {
    const headers = {
      Authorization: `Bearer ${this.token}`
    };
    console.log(this.token)
    return this.httpClient.post<EnvironmentsResponse>(this.api + "/paginate", request, { headers });
  }

  public getDashboardData(): Observable<EnvironmentsDashboardDataModel> {
    const headers = {
      Authorization: `Bearer ${this.token}`
    };
    return this.httpClient.get<EnvironmentsDashboardDataModel>(this.api + '/dashboard', { headers });
  }

  public createEnvironment(request: EvironmentModel): Observable<EnvironmentResponse>{
    const headers = {
            Authorization: `Bearer ${this.token}`
        }; 
        return this.httpClient.post<any>(this.api + "/", request, { headers })
  } 
}
