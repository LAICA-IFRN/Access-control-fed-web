import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DevicePaginateModel } from '../models/devices/device-paginate.model';
import { DevicePaginateResponse } from '../models/devices/device-paginate-response.model';
import { DevicesDashboardDataModel } from '../models/devices/device-dashboard-data.model';

@Injectable({
    providedIn: 'root'
})
export class DevicesService {
    private api: string;
    private deviceService: string;
    private environmentService: string;
    private dashboardUrl: string;
    private token: string;

    constructor(public httpClient: HttpClient) {
        this.api = environment.api;
        this.deviceService = this.api + 'devices';
        this.environmentService = this.api + 'environments';
        this.dashboardUrl = this.deviceService + '/dashboard';
        this.token = sessionStorage.getItem("AUTH_TOKE");
    }

    public getMicrocontrollers(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<DevicePaginateResponse>(this.deviceService + '/microcontrollers/paginate', request, { headers });
    }

    public getRFIDs(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<DevicePaginateResponse>(this.deviceService + '/rfid/paginate', request, { headers });
    }

    public getMobiles(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<DevicePaginateResponse>(this.deviceService + '/mobile/paginate', request, { headers });
    }

    public getEnvironmentsForPendingMicrocontrollers(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<any>(this.environmentService + '/paginate', request, { headers });
    }

    public activateMicrocontroller(microcontrollerId: number, environmentId: string): any {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.post<any>(this.deviceService + `/microcontrollers/activate?id=${microcontrollerId}&environmentId=${environmentId}`, {}, { headers });
    }

    public getDataForDashboard(): Observable<DevicesDashboardDataModel> {
        const headers = {
            Authorization: `Bearer ${this.token}`
        };
        return this.httpClient.get<DevicesDashboardDataModel>(this.dashboardUrl, { headers });
    }
}
