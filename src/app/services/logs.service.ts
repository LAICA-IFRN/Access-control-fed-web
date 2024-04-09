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

    constructor(public httpClient: HttpClient) {
        this.api = environment.api + 'logs';
        //this.api = 'http://localhost:8000/logs';
    }

    public getAccessLogs(request: LogsFilter): Observable<LogsResponse> {
        return this.httpClient.post<LogsResponse>(this.api + "/access", request);
    }

    public getAuditLogs(request: LogsFilter): Observable<LogsResponse> {
        return this.httpClient.post<LogsResponse>(this.api + "/audit", request);
    }
}
