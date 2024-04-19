import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LogsFilter } from '../models/logs/logs.filter';
import { LogsResponse } from '../models/logs/logs.response';

@Injectable({
    providedIn: 'root'
})
export class LogsService {
    private api: string;
    private token: string;

    constructor(public httpClient: HttpClient) {
        this.api = environment.api + 'logs';
        this.token = sessionStorage.getItem("AUTH_TOKE");
    }

    public getAccessLogs(request: LogsFilter): Observable<LogsResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<LogsResponse>(this.api + "/access", request, { headers });
    }

    public getAuditLogs(request: LogsFilter): Observable<LogsResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<LogsResponse>(this.api + "/audit", request, { headers });
    }
}
