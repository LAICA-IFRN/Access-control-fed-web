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
    private environmentService: any;
    private dashboardUrl: string;

    constructor(public httpClient: HttpClient) {
        this.api = environment.api + 'devices';
        this.environmentService = environment.api + 'environments';
        this.dashboardUrl = this.api + '/dashboard' //environment.api + 'dashboard';
    }

    public getMicrocontrollers(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        return this.httpClient.post<DevicePaginateResponse>(this.api + '/microcontrollers/paginate', request);
    }

    public getRFIDs(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        return this.httpClient.post<DevicePaginateResponse>(this.api + '/rfid/paginate', request);
    }

    public getMobiles(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        return this.httpClient.post<DevicePaginateResponse>(this.api + '/mobile/paginate', request);
    }

    public getEnvironmentsForPendingMicrocontrollers(request: DevicePaginateModel): Observable<DevicePaginateResponse> {
        return this.httpClient.post<any>(this.environmentService + '/env/paginate', request);
    }

    public activateMicrocontroller(microcontrollerId: number, environmentId: string): any {
        //return this.httpClient.post<any>(this.api + '/microcontrollers/activate', {microcontrollerId, environmentId});
        return this.httpClient.post<any>(this.api + `/microcontrollers/activate?id=${microcontrollerId}&environmentId=${environmentId}`, {});
    }

    public getDataForDashboard(): Observable<DevicesDashboardDataModel> {
        return this.httpClient.get<DevicesDashboardDataModel>(this.dashboardUrl);
    }
}
